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
            .option('-p|--projects-path <path>', 'The path to use for projects working directory (default: projects).')
            .action(async (projectName: string, options: any) => {
                if (!(await this.isLcuInitialized())) {
                    this.establishSectionHeader('LCU Is Not Yet Initialized', 'yellow');

                    this.establishNextSteps(['Initialize the LCU:', 'lcu init'])
                } else {
                    this.establishSectionHeader('Project Setup');

                    var context = {
                        projectName: projectName,
                        projectsPath: 'projects',
                        template: null
                    };

                    context.projectName = await this.ensureProjectName(context.projectName);

                    try {
                        var answers = await this.processTemplateInquiries(context);

                        context = await this.mergeObjects(context, answers);

                        var err = await this.ensureProject(context);

                        if (!err) {
                            await this.processTemplates(context);

                            this.Ora.succeed(`Completed setup for project ${context.projectName}.`);
                        } else {
                            this.Ora.fail(err);
                        }
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

    protected async ensureProject(context: any) {
        var lcuConfig = await this.loadLCUConfig();

        var templatesRepoPath = this.pathJoin(lcuConfig.environment.tempFiles, 'repos', lcuConfig.templates.repository);

        var cliConfig = await this.loadCLIConfig(templatesRepoPath);

        if (!lcuConfig.projects)
            lcuConfig.projects = {};

        if (lcuConfig.projects[context.projectName])
            return 'Project already exists';

        lcuConfig.projects[context.projectName] = {
            name: context.projectName,
            source: `./${context.projectsPath}/${context.projectName}`,
            target: `./dist/${context.projectsPath}`,
            template: context.template
        };

        var lcuCfgTemp = await this.loadLCUConfigTemplate(templatesRepoPath, cliConfig.Projects.Root, this.SysPath);

        lcuConfig = await this.mergeLcuFiles(lcuConfig, lcuCfgTemp, context);

        lcuCfgTemp = await this.loadLCUConfigTemplate(templatesRepoPath, cliConfig.Projects.Root, context.template, this.SysPath);

        lcuConfig = await this.mergeLcuFiles(lcuConfig, lcuCfgTemp, context);

        if (!lcuConfig.DefaultProject)
            lcuConfig.DefaultProject = context.projectName;

        await this.saveLCUConfig(lcuConfig);

        return null;
    }

    protected async mergeLcuFiles(lcuConfig: any, lcuConfigTemplate: string, context: any) {
        var lcuCfgTemp = await this.compileTemplate(lcuConfigTemplate, context);

        var tempCfg = JSON.parse(lcuCfgTemp);

        return await this.mergeObjects(lcuConfig, tempCfg);
    }

    protected async processTemplateInquiries(context: any) {
        var lcuConfig = await this.loadLCUConfig();

        var templatesRepoPath = this.pathJoin(lcuConfig.environment.tempFiles, 'repos', lcuConfig.templates.repository);

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
        var lcuConfig = await this.loadLCUConfig();

        var templatesRepoPath = this.pathJoin(lcuConfig.environment.tempFiles, 'repos', lcuConfig.templates.repository);

        var cliConfig = await this.loadCLIConfig(templatesRepoPath);

        var projectConfig = lcuConfig[context.projectsPath][context.projectName];

        var ora = this.Ora.start(`Starting scaffolding from ${projectConfig.template} project template...`);

        var source = this.pathJoin(templatesRepoPath, cliConfig.Projects.Root, projectConfig.template);

        var target = this.pathJoin(projectConfig.source);

        await this.processTemplateCommands(source, target, context);

        await this.compileTemplatesInDirectory(source, target, context);

        ora.succeed(`Completed scaffolding of the ${projectConfig.template} project.`);
    }

    protected async processTemplateCommands(templateSourcePath: string, targetPath: string, context: any) {
        var ora = this.Ora.start(`Loading ${context.template} commands ...`);

        var commandsFile = await this.compileTemplateFromPath(context, this.pathJoin(templateSourcePath, this.SysPath, 'commands.json'));

        var commands = <string[]>JSON.parse(commandsFile);

        ora.succeed(`Loaded ${context.template} commands`);

        await this.processNextCommand(commands, context);
    }

    protected async processNextCommand(commands: string[], context: any) {
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

                await this.processNextCommand(commands, context)
            });

            proc.q.on('failed', () => {
                ora.fail(`Failed execution of command: ${command}`);
            });
        } else {
            this.Ora.succeed(`All commands have been processed for template ${context.template}`)
        }
    }
}