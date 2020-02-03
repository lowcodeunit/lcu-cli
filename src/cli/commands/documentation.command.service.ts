import { BaseCommandService } from "./BaseCommandService";
import { Command } from 'commander';

export class DocumentationCommandService extends BaseCommandService {
    
    constructor() {
        super();
    }

    public async Setup(program: Command): Promise<Command> {
        return program
            .command('documentation [name]')
            .alias('docs')
            .description('Initialize a basic documentation structure with the LCU-Documentation library.')
            .option('-p|--project <project>', 'The project to add the documentation files to.')
            .option('-m|--module <module>', 'The module within a project to add the documentation module to.')
            .option('--path <path>', 'The path within a project to add the documentation files to.')
            .action(async (name: string, options: any) => {
                if (!(await this.isLcuInitialized())) {
                    this.establishSectionHeader('LCU must be Initialized', 'yellow');

                    this.establishNextSteps(['Initialize the LCU: ', 'lcu init']);
                } else {
                    this.establishSectionHeader('LCU Documentation Setup');

                    let context: any = {
                        name: name,
                        module: options.module || 'app.module.ts',
                        path: options.path || 'docs',
                        projectName: options.project || 'demo',
                        template: options.template || null
                    };

                    // context.name = await this.ensureName(context.name); // TODO: Do we need a name for this?

                    context.projectName = await this.ensureInquired(context.projectName, 'project');

                    try {
                        let lcuConfig = await this.loadLCUConfig();

                        let templateRepoPath = this.pathJoin(this.tempFiles, 'repos', lcuConfig.templates.repository, 'documentation');

                        let answers = await this.inquir(templateRepoPath);

                        context = await this.mergeObjects(context, answers);

                        answers = await this.processTemplateInquiries(templateRepoPath, context); // TODO: Add more templates!

                        context = await this.mergeObjects(context, answers);

                        await this.processTemplateCommands(this.pathJoin(templateRepoPath, context.template), context);

                        this.Ora.succeed(`Completed documenation setup in the project: ${context.projectName}.`);
                        
                    } catch (err) {
                        this.Ora.fail(`Issue establishing documentation: \r\n${err}`);
                        
                        process.exit(1);
                    }
                }
            });
    }

    protected async processTemplateInquiries(templateRepoPath: string, context: any) {
        let cliConfig = await this.loadCLIConfig();

        let questions = [];

        if (!context.template) {
            questions.push({
                type: 'list',
                name: 'template',
                message: `Choose ${cliConfig.Documents.Title}:`,
                choices: cliConfig.Documents.Options
            });
        }

        let setupQuestions: any = await this.loadTemplateInquirerQuestions(templateRepoPath);

        if (setupQuestions && setupQuestions.length > 0) {
            questions.push(...setupQuestions);
        }

        let answers: any = await this.inquir(questions);

        let repoTemplateTempPath = this.pathJoin(templateRepoPath, answers.template);

        let templateAnswers: any = await this.inquir(repoTemplateTempPath);

        answers = await this.mergeObjects(answers, templateAnswers);

        return answers;
    }

}