import Chalk from 'chalk';
import { AsyncHelpers } from '../../helpers/3rdparty-async';
import { Logger } from '../../logging/logger';
import { BaseCommandService } from './BaseCommandService';
import { Command } from 'commander'

export class ElementCommandService extends BaseCommandService {
    //  Fields

    //  Properties

    //  Constructors
    constructor() {
        super();
    }

    //  API Methods
    public async Setup(program: Command): Promise<Command> {
        return program
            .command('element [name]')
            .alias('el')
            .description('Initialize an LCU Element from core templates.')
            .option('-p|--project <project>', 'The project to add the Element to.')
            .option('--path <path>', 'The path within a project to add the Element to.')
            .action(async (name: string, options: any) => {
                if (!(await this.isLcuInitialized())) {
                    this.establishSectionHeader('LCU must be Initialized', 'yellow');

                    this.establishNextSteps(['Initialize the LCU:', 'lcu init'])
                } else {
                    this.establishSectionHeader('LCU Element Setup');

                    var context: any = {
                        name: name,
                        projectName: options.project,
                        template: null
                    };
                    
                    context.name = await this.ensureName(context.name);

                    try {
                        var lcuConfig = await this.loadLCUConfig();
                        
                        var templateRepoPath = this.pathJoin(this.tempFiles, 'repos', lcuConfig.templates.repository, 'element')
                        
                        var answers = await this.inquir(templateRepoPath);

                        context = await this.mergeObjects(context, answers);

                        answers = await this.processTemplateInquiries(templateRepoPath, context);

                        context = await this.mergeObjects(context, answers);

                        Logger.Basic(context);

                        await this.processTemplateCommands(this.pathJoin(templateRepoPath, context.template), context);

                        this.Ora.succeed(`Completed setup for element ${context.projectName}.`);
                    } catch (err) {
                        this.Ora.fail(`Issue establishing element: \r\n${err}`);

                        process.exit(1);
                    }
                }
            });
    }

    //  Helpers
    protected async ensureName(name: string) {
        while (!name) {
            var answs: any = await this.inquir([
                {
                    type: 'input',
                    name: 'name',
                    message: 'What is the element name?'
                }
            ], 'Issue loading element name');

            name = answs.name;
        }

        return name;
    }

    protected async processTemplateInquiries(templatesRepoPath: string, context: any) {
        var cliConfig = await this.loadCLIConfig();

        var questions = [
            {
                type: 'list',
                name: 'template',
                message: `Choose ${cliConfig.Elements.Title}:`,
                choices: cliConfig.Elements.Options
            }
        ];

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