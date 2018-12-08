import { CLIConfig } from './../core/cli-config';
import { CLIOptions } from './../core/cli-options';
import { LCUOra, LCUColor } from './ICommandService';
import { Logger } from './../../logging/logger';
import { Command } from 'commander';
import inquirer, { Questions } from 'inquirer';
import handlebars from 'handlebars';
import fs from 'fs-extra';
import path from 'path';
import Ora from 'ora';
import Chalk from 'chalk';
import userHome from 'user-home';
import clear from 'clear';
import _ from 'lodash';

const defaultChalkColor: LCUColor = 'blue';

export abstract class BaseCommandService {
    //  Constants
    //  Fields
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
        await fs.ensureDir(target);

        var contents = await fs.readdir(source);

        contents.forEach(async (content) => {
            if (content != this.SysPath) {
                var srcPath = this.pathJoin(source, content);

                var tgtPath = this.pathJoin(target, content);

                var srcStats = await fs.stat(srcPath);

                if (srcStats.isDirectory()) {
                    await this.compileTemplatesInDirectory(srcPath, tgtPath, context);
                } else {
                    var compiled = await this.compileTemplateFromPath(context, srcPath);
                    
                    await fs.writeFile(tgtPath, compiled);
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
            await fs.stat('lcu.json');

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

            var templatesRepoPath = this.pathJoin(lcuConfig.environment.tempFiles, 'repos', lcuConfig.templates.repository);

            return await this.loadCLIConfig(templatesRepoPath);
        }
    }

    protected async loadLCUConfig() {
        return await this.loadJSON('lcu.json');
    }

    protected async loadLCUConfigTemplate(...pathParts: string[]) {
        var path = this.pathJoin(...pathParts, 'lcu.json');

        return await this.loadFile(path);
    }

    protected async loadFile(file: string) {
        var fileContent = await fs.readFile(file);

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
        return path.join(...paths).replace('{{userHomePath}}', this.userHomePath);
    }

    protected async saveLCUConfig(lcuConfig: any) {
        await fs.writeJson('lcu.json', lcuConfig, { spaces: '\t' });
    }
}