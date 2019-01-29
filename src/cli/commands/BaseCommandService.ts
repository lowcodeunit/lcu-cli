import { CLIConfig } from './../core/cli-config';
import { CLIOptions } from './../core/cli-options';
import { LCUOra, LCUColor } from './ICommandService';
import { Logger } from './../../logging/logger';
import { Command } from 'commander';
import inquirer, { Questions } from 'inquirer';
import handlebars from 'handlebars';
import { ensureDir, readdir, stat, writeFile, readFile, writeJson } from 'fs-extra';
import { join } from 'path';
import Ora from 'ora';
import Chalk from 'chalk';
import userHome from 'user-home';
import clear from 'clear';
import _ from 'lodash';
import exeq from 'exeq';
import { LCUConfig } from '../core/lcu-config';

const defaultChalkColor: LCUColor = 'blue';

export abstract class BaseCommandService {
    //  Constants

    //  Fields
    protected get tempFiles(): string {
        return '{{userHomePath}}\\smart-matrix\\lcu';
    }

    protected get userHomePath(): string {
        return userHome;
    }

    //  Properties
    protected get Ora(): LCUOra {
        return Ora();
    }

    public SysPath: string;

    //  Constructors
    constructor() {
        this.SysPath = '_sys';

        handlebars.registerHelper('safeFilePath', (filePath) => {
            return this.jsonCleanup(filePath);
        });
    }

    //  API Methods
    public abstract async Setup(program: Command): Promise<Command>;

    //  Helpers
    protected async clear() {
        clear();
    }

    protected async compileTemplate(fileContent: string, context: any) {
        var template = handlebars.compile(fileContent);

        return <string>template(context);
    }

    protected async compileTemplateFromPath(context: any, ...filePaths: string[]) {
        var fileContent = await this.loadFile(this.pathJoin(...filePaths));

        return await this.compileTemplate(fileContent, context);
    }

    protected async compileTemplatesInDirectory(source: string, target: string, context: any) {
        await ensureDir(target);

        var contents = await readdir(source);

        contents.forEach(async (content) => {
            if (content != this.SysPath) {
                var srcPath = this.pathJoin(source, content);

                var tgtPath = this.pathJoin(target, content);

                var srcStats = await stat(srcPath);

                if (srcStats.isDirectory()) {
                    await this.compileTemplatesInDirectory(srcPath, tgtPath, context);
                } else {
                    var compiled = await this.compileTemplateFromPath(context, srcPath);
                    
                    await writeFile(tgtPath, compiled);
                }
            }
        });
    }

    protected async establishNextSteps(steps: string[], color: LCUColor = defaultChalkColor) {
        Logger.Basic('\n');

        steps.forEach(step => {
            Logger.Basic(Chalk[color](`\t${step}`));
        });

        Logger.Basic('\n');
    }

    protected async establishSectionHeader(title: string, color: LCUColor = defaultChalkColor, showHeader: boolean = true,
        length: number = 100) {
        var surroundLength = length - title.length;

        var splitSize = Math.round((surroundLength / 2) / 3);

        var outer = new Array(splitSize * 2).join('=');

        var inner = new Array(splitSize).join('-');

        if (showHeader)
            this.establishHeader();

        Logger.Basic(Chalk[color](`${outer}${inner}  ${title}  ${inner}${outer}`));
    }
    
    protected async ensureInquired(value: string, propName: string, message: string = null) {
        while (!value) {
            var answs: any = await this.inquir([
                {
                    type: 'input',
                    name: propName,
                    message: message || `What is the ${propName}?`
                }
            ], `Issue loading ${propName}`);

            value = answs[propName];
        }

        return value;
    }

    protected async establishHeader() {
        this.clear();

        Logger.Headline("LCU-CLI");
    }

    protected async inquir(questions: Questions<{}> | string, errMsg?: string, exitOnError: boolean = true) {
        if (_.isString(questions)) {
            questions = await this.loadTemplateInquirerQuestions(<string>questions);
        }

        return await inquirer.prompt(<Questions<{}>>questions).catch(err => {
            this.Ora.fail(errMsg || err);

            if (exitOnError)
                process.exit(1);
        });
    }

    protected async isLcuInitialized() {
        try {
            await stat('lcu.json');

            return true;
        } catch (err) {
            return false;
        }
    }

    protected jsonCleanup(value: string) {
        return value.replace(/[\\]/g, "\\$&");
    }

    protected async loadCLIConfig(rootPath?: string) {
        if (rootPath) {
            var file = this.pathJoin(rootPath, `lcu-cli-config.json`);

            return await this.loadJSON(file);
        } else {
            var lcuConfig = await this.loadLCUConfig();

            var templatesRepoPath = this.pathJoin(this.tempFiles, 'repos', lcuConfig.templates.repository);

            return await this.loadCLIConfig(templatesRepoPath);
        }
    }

    protected async loadLCUConfig(): Promise<LCUConfig> {
        return await this.loadJSON('lcu.json');
    }

    protected async loadLCUConfigTemplate(...pathParts: string[]) {
        var path = this.pathJoin(...pathParts, 'lcu.json');

        return await this.loadFile(path);
    }

    protected async loadFile(file: string) {
        var fileContent = await readFile(file);

        var content = fileContent.toString('utf8');

        return content;
    }

    protected async loadJS(file: string) {
        var js = await this.loadFile(file);

        return eval(js);
    }

    protected async loadJSON(file: string) {
        var json = await this.loadFile(file);

        return JSON.parse(json);
    }

    protected async loadTemplateInquirerQuestions(rootPath: string) {
        var file = this.pathJoin(rootPath, `${this.SysPath}/inquir.js`);

        try {
            return await this.loadJS(file);
        } catch (err) {
            console.log(err);

            return [];
        }
    }

    protected async mergeObjects(root: any, merged: any) {
        return _.merge(root, merged);
    }

    protected pathJoin(...paths: string[]) {
        return join(...paths).replace('{{userHomePath}}', this.userHomePath);
    }

    protected async processTemplateCommands(templateSourcePath: string, context: any) {
        var ora = this.Ora.start(`Loading commands ...`);

        var commandsFile = await this.compileTemplateFromPath(context, this.pathJoin(templateSourcePath, this.SysPath, 'commands.json'));

        var commands = <string[]>JSON.parse(commandsFile);

        ora.succeed(`Loaded commands`);

        await this.processCommand(commands, context);
    }

    protected processCommand(commands: string[], context: any): Promise<void> {
        return new Promise((resolve, reject) => {
            if (commands && commands.length > 0) {
                var command = commands.shift();
    
                var ora = this.Ora.start(`Executing command: ${command}`);
    
                var proc = exeq(command);
    
                proc.q.on('stdout', (data) => {
                    // Logger.Basic(data);
                });
    
                proc.q.on('stderr', (data) => {
                    Logger.Basic(data);
                });
    
                proc.q.on('killed', (reason) => {
                    ora.fail(`Command execution failed for ${command}: ${reason}`);
                });
    
                proc.q.on('done', async () => {
                    ora.succeed(`Successfully executed command: ${command}`);
    
                    await this.processCommand(commands, context);
                    
                    resolve();
                });
    
                proc.q.on('failed', () => {
                    ora.fail(`Failed execution of command: ${command}`);

                    reject();
                });
            } else {
                this.Ora.succeed(`All commands have been processed for template`);

                resolve();
            }
        });
    }

    protected async saveLCUConfig(lcuConfig: LCUConfig) {
        await this.writeJson('lcu.json', lcuConfig);
    }

    protected async writeJson(file: string, val: any) {
        await writeJson(file, val, { spaces: '\t' });
    }
}