import { BaseCommandService } from './BaseCommandService';
import { Command } from 'commander'
import Chalk from 'chalk';
import { AsyncHelpers } from '../../helpers/3rdparty-async';

export class UpdateCommandService extends BaseCommandService {
    //  Fields

    //  Properties

    //  Constructors
    constructor() {
        super();
    }

    //  API Methods
    public async Setup(program: Command): Promise<Command> {
        return program
            .command('update')
            .alias('up')
            .description('Update location with latest LCU libraries.')
            .action(async (options: any) => {
                if (!(await this.isLcuInitialized())) {
                    this.establishSectionHeader('LCU must be Initialized', 'yellow');

                    this.establishNextSteps(['Initialize the LCU:', 'lcu init'])
                } else {
                    this.establishSectionHeader('Updating');

                    var lcuConfig = await this.loadLCUConfig();
                    
                    var context = {
                        repo: options.repository || lcuConfig.templates.repository || 'lowcodeunit-devkit/lcu-cli-templates-core'
                    };

                    lcuConfig.templates.repository = context.repo;

                    try {
                        await this.saveLCUConfig(lcuConfig);

                        var repoTempPath = this.pathJoin(this.tempFiles, 'repos', context.repo);

                        await this.establishTemplatesRepo(repoTempPath, context.repo);

                        var answers = this.inquir(this.pathJoin(repoTempPath, 'update'));

                        context = Object.assign(context, answers);

                        await this.processTemplates(context, 'update');

                        this.Ora.succeed('Completed initialization of the LCU');
                    } catch (err) {
                        this.Ora.fail(`Issue updating LCU`);

                        process.exit(1);
                    }
                }
            });
    }

    //  Helpers
    protected async establishTemplatesRepo(repoTempPath: string, repo: string) {
        return new Promise<{}>(async (resolve, reject) => {
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