import { Logger } from './../../logging/logger';
import { BaseCommandService } from './BaseCommandService';
import { Command } from 'commander';

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
      .option('-t|--template <template>', 'The path to use for projects working directory (default: projects).')
      .action(async (projectName: string, options: any) => {
        if (!(await this.isLcuInitialized())) {
          this.establishSectionHeader('LCU must be Initialized', 'yellow');

          this.establishNextSteps(['Initialize the LCU:', 'lcu init']);
        } else {
          this.establishSectionHeader('Project Setup');

          var context: any = {
            projectName: projectName,
            template: options.template || null
          };

          context.projectName = await this.ensureProjectName(context.projectName);

          Logger.Basic(`Project: ${context.projectName} on ${context.template}`);

          try {
            var lcuConfig = await this.loadLCUConfig();

            var templateRepoPath = this.pathJoin(this.tempFiles, 'repos', lcuConfig.templates.repository, 'project');

            var answers = await this.inquir(templateRepoPath);

            context = await this.mergeObjects(context, answers);

            answers = await this.processTemplateInquiries(templateRepoPath, context);

            context = await this.mergeObjects(context, answers);

            await this.processTemplateCommands(this.pathJoin(templateRepoPath, context.template), context);

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
      var answs: any = await this.inquir(
        [
          {
            type: 'input',
            name: 'projectName',
            message: 'What is the project name?'
          }
        ],
        'Issue loading project name'
      );

      projectName = answs.projectName;
    }

    return projectName;
  }

  protected async processTemplateInquiries(templatesRepoPath: string, context: any) {
    var cliConfig = await this.loadCLIConfig();

    var questions = [];

    if (!context.template) {
      questions.push({
        type: 'list',
        name: 'template',
        message: `Choose ${cliConfig.Projects.Title}:`,
        choices: cliConfig.Projects.Options
      });
    }

    var setupQuestions: any = await this.loadTemplateInquirerQuestions(templatesRepoPath);

    if (setupQuestions && setupQuestions.length > 0) questions.push(...setupQuestions);

    var answers: any = await this.inquir(questions);

    var repoTemplateTempPath = this.pathJoin(templatesRepoPath, answers.template);

    var templateAnswers: any = await this.inquir(repoTemplateTempPath);

    answers = await this.mergeObjects(answers, templateAnswers);

    return answers;
  }
}
