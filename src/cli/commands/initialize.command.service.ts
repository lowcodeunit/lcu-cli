import { BaseCommandService } from './BaseCommandService';
import { Command } from 'commander'
import Chalk from 'chalk';
import { AsyncHelpers } from '../../helpers/3rdparty-async';

export class InitializeCommandService extends BaseCommandService {
    //  Fields

    //  Properties

    //  Constructors
    constructor() {
        super();
    }

    //  API Methods
    public async Setup(program: Command): Promise<Command> {
        /**
         * For local testing
         * 
         * Can pull repo from a feature branch, for testing or whatever like -
         * 
         * default: lowcodeunit-devkit/lcu-cli-templates-core#feature\/8193-angular-10 - shannon
         */
        return program
            .command('initialize')
            .alias('init')
            .description('Initialize location as an LCU compatible directory.')
            .option('-r|--repository <repo>', 'The Template repository path to use as default for all projects (default: lowcodeunit-devkit/lcu-cli-templates-core).')
            .option('-p|--projects-path <path>', 'The path to use for projects working directory (default: projects).')
            .option('-w|--workspace <workspace>', 'The name of the workspce to use.')
            .option('-s|--scope <scope>', 'The @scope to use for package names.')
            .option('-d|--docs <docs>', 'Whether or not to add docs to the base of the project.')
            .action(async (options: any) => {
                if (await this.isLcuInitialized())
                    this.establishSectionHeader('LCU Already Initialized', 'yellow');
                else {
                    this.establishSectionHeader('Initializing');

                    var context = {
                        projectsPath: options.projectsPath || 'projects',
                        repo: options.repository || 'lowcodeunit-devkit/lcu-cli-templates-core',
                        scope: options.scope,
                        workspace: options.workspace,
                        docs: options.docs || false,
                    };

                    try {
                        context.scope = await this.ensureInquired(context.scope, 'scope');
    
                        context.workspace = await this.ensureInquired(context.workspace, 'workspace');
    
                        var repoTempPath = this.pathJoin(this.tempFiles, 'repos', context.repo);

                        /**
                         * For Local testing
                         * 
                         * Can pull lcu-cli-templates-core for a local test from smart-matrix like, where 
                         * shannon-test is a folder containing commander files App, LCU, Library, Momentum, etc.
                         * 
                         * var repoTempPath = this.pathJoin(this.tempFiles, 'repos', 'shannon-test');
                         */

                        await this.establishTemplatesRepo(repoTempPath, context.repo);

                        var answers = this.inquir(this.pathJoin(repoTempPath, 'initialize'));

                        context = Object.assign(context, answers);

                        await this.processTemplates(context, 'initialize');

                        this.Ora.succeed('Completed initialization of the LCU');

                        this.establishNextSteps(['Initialize a new project:', 'lcu proj [project-name]'])
                    } catch (err) {
                        this.Ora.fail(`Issue establishing templates`);

                        process.exit(1);
                    }
                }
            });
    }

    //  Helpers
    protected async establishTemplatesRepo(repoTempPath: string, repo: string) {
        return new Promise<{}>(async (resolve, reject) => {
            console.log('SHANNON ' + repo);
            var ora = this.Ora.start(`Loading Templates Repository '${repo}'`);

            await AsyncHelpers.rimraf(repoTempPath).catch(err => {
                ora.fail(`Issue cleaning temp path @ '${Chalk.yellow(repoTempPath)}': ${Chalk.red(err)}`);

                process.exit(1);

                reject();
            });

            await AsyncHelpers.downloadGit(repo, repoTempPath).catch((err) => {
                ora.fail(`Template loading failed with: \n\t${Chalk.red(err)}`);

                process.exit(1);

                reject();
            });

            ora.succeed(`Loaded Templates to '${repoTempPath}'`);

            resolve();
        });
    }

    protected async processTemplates(context: any, subPath: string) {
        var templatesRepoPath = this.pathJoin(this.tempFiles, 'repos', context.repo);

        var source = this.pathJoin(templatesRepoPath, subPath);

        await this.processTemplateCommands(source, context);
    }
}