import { BaseCommandService } from './BaseCommandService';
import path from 'path';
import { Command } from 'commander'
import Chalk from 'chalk';
import { AsyncHelpers } from '../../helpers/3rdparty-async';

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
            .command('solution [solution-name]')
            .alias('sln')
            .description('Initialize an LCU Solution into the project.')
            .option('-p|--projects-path <path>', 'The path to initialize the LCU Solution to.')
            .option('-r|--repository <repo>', 'The Template repository path to use.')
            .option('-t|--temp-path <temp>', 'The temp file path to use.')
            .action(async (projectName: string, options: any) => {
                this.establishSectionHeader('Initializing');
                
                var config = {
                    projectName: projectName,
                    projectsPath: 'projects',
                    repo: options.repository || 'smart-matrix/lcu-cli-templates-core',
                    tempPath: path.join(options.tempPath || `${this.userHomePath}\\smart-matrix\\lcu-sln`)
                };

                config.projectName = await this.ensureProjectName(config.projectName);

                var answers = await this.establishTemplates(path.join(config.tempPath, config.projectName, 'templates-repo'), config.repo).catch(err => {
                    this.Ora.fail(`Issue establish templates`);

                    process.exit(1);
                });

                config = Object.assign(config, answers);
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

    protected async establishTemplates(repoTempPath: string, repo: string) {
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

            var repoTemplatesTempPath = path.join(repoTempPath, 'templates');

            var choices = await this.loadTemplateOptions(repoTemplatesTempPath);

            var setupQuestions: any = await this.loadTemplateSetupQuestions(repoTemplatesTempPath);

            var questions = [
                {
                    type: 'list',
                    name: 'template',
                    message: 'Choose Template:',
                    choices: choices
                }
            ];

            if (setupQuestions && setupQuestions.length > 0)
                questions.push(...setupQuestions)

            var answers: any = await this.inquir(questions);

            var repoTemplateTempPath = path.join(repoTemplatesTempPath, answers.template);

            var templateQuestions: any = await this.loadTemplateSetupQuestions(repoTemplateTempPath);

            var templateAnswers: any = await this.inquir(templateQuestions);

            answers = Object.assign(answers, templateAnswers);

            resolve(answers)
        });
    }

    protected async loadTemplateOptions(rootPath: string) {
        var file = path.join(rootPath, `${this.SysPath}/options.json`);

        return this.loadJSON(file);
    }

    protected async loadTemplateSetupQuestions(rootPath: string) {
        var file = path.join(rootPath, `${this.SysPath}/setup.js`);

        try {
            return this.loadJS(file);
        } catch (err) {
            console.log(err);

            return [];
        }
    }
}