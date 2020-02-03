import Chalk from 'chalk';
import { AsyncHelpers } from '../../helpers/3rdparty-async';
import { Logger } from '../../logging/logger';
import { BaseCommandService } from './BaseCommandService';
import { Command } from 'commander';

export class SolutionCommandService extends BaseCommandService {
    //  Fields

    //  Properties

    //  Constructors
    constructor() {
        super();
    }

    //  API Methods
    public async Setup(program: Command): Promise<Command> {
        return program
            .command('solution [name]')
            .alias('sln')
            .description('Initialize an LCU Solution from core templates.')
            .option('-p|--project <project>', 'The project to add the Solution to.')
            .option('-e|--export <export>', 'The export file within a project to add the Solution to.')
            .option('-m|--module <module>', 'The module within a project to add the Solution to.')
            .option('-b|--disableLcuBootstrap <disableLcuBootstrap>', 'Whether or not to add custom bootstrap method to application.')
            .option('--path <path>', 'The path within a project to add the Solution to.')
            .action(async (name: string, options: any) => {
                if (!(await this.isLcuInitialized())) {
                    this.establishSectionHeader('LCU must be Initialized', 'yellow');

                    this.establishNextSteps(['Initialize the LCU:', 'lcu init'])
                } else {
                    this.establishSectionHeader('LCU Solution Setup');

                    var context: any = {
                        name: name,
                        disableLcuBootstrap: options.disableLcuBootstrap || false,
                        export: options.export || 'src/lcu.api.ts',
                        module: options.module || 'app.module.ts',
                        path: options.path || 'lib/elements',
                        projectName: options.project || 'common',
                        template: options.template || null
                    };

                    context.name = await this.ensureName(context.name);

                    context.projectName = await this.ensureInquired(context.projectName, 'project');

                    try {
                        var lcuConfig = await this.loadLCUConfig();

                        var templateRepoPath = this.pathJoin(this.tempFiles, 'repos', lcuConfig.templates.repository, 'solution')

                        var answers = await this.inquir(templateRepoPath);

                        context = await this.mergeObjects(context, answers);

                        answers = await this.processTemplateInquiries(templateRepoPath, context);

                        context = await this.mergeObjects(context, answers);

                        await this.processTemplateCommands(this.pathJoin(templateRepoPath, context.template), context);

                        this.Ora.succeed(`Completed setup for solution ${context.projectName}.`);
                    } catch (err) {
                        this.Ora.fail(`Issue establishing solution: \r\n${err}`);

                        process.exit(1);
                    }
                }
            });
    }

    //  Helpers
    protected async ensureName(name: string) {
        return await this.ensureInquired(name, 'name');
    }

    protected async processTemplateInquiries(templatesRepoPath: string, context: any) {
        var cliConfig = await this.loadCLIConfig();

        var questions = [];

        if (!context.template)
            questions.push({
                type: 'list',
                name: 'template',
                message: `Choose ${cliConfig.Solutions.Title}:`,
                choices: cliConfig.Solutions.Options
            });

        var setupQuestions: any = await this.loadTemplateInquirerQuestions(templatesRepoPath);

        if (setupQuestions && setupQuestions.length > 0)
            questions.push(...setupQuestions)

        var answers: any = await this.inquir(questions);

        var repoTemplateTempPath = this.pathJoin(templatesRepoPath, answers.template);

        var templateAnswers: any = await this.inquir(repoTemplateTempPath);

        answers = await this.mergeObjects(answers, templateAnswers);

        return answers
    }
}