import Chalk from 'chalk';
import { AsyncHelpers } from './../../helpers/3rdparty-async';
import { Logger } from './../../logging/logger';
import { BaseCommandService } from './BaseCommandService';
import { Command } from 'commander'
import exeq from 'exeq';

export class ProjectCommandService extends BaseCommandService {
    //  Fields

    //  Properties

    //  Constructors
    constructor() {
        super();
    }

    //  API Methods
    public async Setup(program: Command): Promise<Command> {
        return program
            .command('project [project-name]')
            .alias('proj')
            .description('Initialize an LCU project from core templates or custom template directories.')
            .option('-r|--repository <repo>', 'The Template repository path to use as default for all projects (default: lowcodeunit-devkit/lcu-cli-templates-core).')
            .option('-p|--projects-path <path>', 'The path to use for projects working directory (default: projects).')
            .action(async (projectName: string, options: any) => {
                if (await this.isLcuInitialized()) {
                    this.establishSectionHeader('LCU Already Initialized', 'yellow');

                    this.establishNextSteps(['Initialize the LCU:', 'lcu init'])
                } else {
                    this.establishSectionHeader('Project Setup');

                    var context = {
                        projectName: projectName,
                        projectsPath: 'projects',
                        template: null,
                        repo: options.repository || 'lowcodeunit-devkit/lcu-cli-templates-core',
                        tempPath: '{{userHomePath}}\\smart-matrix\\lcu'
                    };
                    
                    context.projectName = await this.ensureProjectName(context.projectName);

                    try {
                        var answers = await this.establishTemplatesRepo(this.pathJoin(context.tempPath, 'repos', context.repo), context.repo);

                        context = Object.assign(context, answers);

                        answers = await this.processTemplateInquiries(context);

                        context = await this.mergeObjects(context, answers);

                        await this.processTemplates(context);

                        this.Ora.succeed(`Completed setup for project ${context.projectName}.`);
                    } catch (err) {
                        this.Ora.fail(`Issue establishing project: \r\n${err}`);

                        process.exit(1);
                    }
                }
            });
    }

    //  Helpers
    protected async ensureProjectName(projectName: string) {
        while (!projectName) {
            var answs: any = await this.inquir([
                {
                    type: 'input',
                    name: 'projectName',
                    message: 'What is the project name?'
                }
            ], 'Issue loading project name');

            projectName = answs.projectName;
        }

        return projectName;
    }

    protected async establishTemplatesRepo(repoTempPath: string, repo: string) {
        return new Promise<{}>(async (resolve, reject) => {
            var ora = this.Ora.start(`Loading Templates Repository '${repo}'`);

            await AsyncHelpers.rimraf(repoTempPath).catch(err => {
                ora.fail(`Issue cleaning temp path @ '${Chalk.yellow(repoTempPath)}': ${Chalk.red(err)}`);

                process.exit(1);
            });

            await AsyncHelpers.downloadGit(repo, repoTempPath).catch((err) => {
                ora.fail(`Template loading failed with: \n\t${Chalk.red(err)}`);

                process.exit(1);
            });

            ora.succeed(`Loaded Templates to '${repoTempPath}'`);

            var answers = this.inquir(repoTempPath);

            resolve(answers);
        });
    }

    protected async mergeLcuFiles(lcuConfig: any, lcuConfigTemplate: string, context: any) {
        var lcuCfgTemp = await this.compileTemplate(lcuConfigTemplate, context);

        var tempCfg = JSON.parse(lcuCfgTemp);

        return await this.mergeObjects(lcuConfig, tempCfg);
    }

    protected async processTemplateInquiries(context: any) {
        var templatesRepoPath = this.pathJoin(context.tempPath, 'repos', context.repo);

        var cliConfig = await this.loadCLIConfig(templatesRepoPath);

        var repoTemplatesTempPath = this.pathJoin(templatesRepoPath, cliConfig.Projects.Root);

        var setupQuestions: any = await this.loadTemplateInquirerQuestions(repoTemplatesTempPath);

        var questions = [
            {
                type: 'list',
                name: 'template',
                message: `Choose ${cliConfig.Projects.Title}:`,
                choices: cliConfig.Projects.Options
            }
        ];

        if (setupQuestions && setupQuestions.length > 0)
            questions.push(...setupQuestions)

        var answers: any = await this.inquir(questions);

        var repoTemplateTempPath = this.pathJoin(repoTemplatesTempPath, answers.template);

        var templateQuestions: any = await this.loadTemplateInquirerQuestions(repoTemplateTempPath);

        var templateAnswers: any = await this.inquir(templateQuestions);

        answers = await this.mergeObjects(answers, templateAnswers);

        return answers
    }

    protected async processTemplates(context: any) {
        var templatesRepoPath = this.pathJoin(context.tempPath, 'repos', context.repo);

        var cliConfig = await this.loadCLIConfig(templatesRepoPath);

        var source = this.pathJoin(templatesRepoPath, cliConfig.Projects.Root, context.template);

        await this.processTemplateCommands(source, context);
    }

    protected async processTemplateCommands(templateSourcePath: string, context: any) {
        var ora = this.Ora.start(`Loading ${context.template} commands ...`);

        var commandsFile = await this.compileTemplateFromPath(context, this.pathJoin(templateSourcePath, this.SysPath, 'commands.json'));

        var commands = <string[]>JSON.parse(commandsFile);

        ora.succeed(`Loaded ${context.template} commands`);

        await this.processNextCommand(commands, context);
    }

    protected processNextCommand(commands: string[], context: any): Promise<void> {
        return new Promise((resolve, reject) => {
            if (commands && commands.length > 0) {
                var command = commands.shift();
    
                var ora = this.Ora.start(`Executing ${context.template} command: ${command}`);
    
                var proc = exeq(command)
    
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
    
                    await this.processNextCommand(commands, context);
                    
                    resolve();
                });
    
                proc.q.on('failed', () => {
                    ora.fail(`Failed execution of command: ${command}`);

                    reject();
                });
            } else {
                this.Ora.succeed(`All commands have been processed for template ${context.template}`);

                resolve();
            }
        });
    }
}