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
        return program
            .command('initialize')
            .alias('init')
            .description('Initialize location as an LCU compatible directory.')
            .option('-r|--repository <repo>', 'The Template repository path to use as default for all projects (default: smart-matrix/lcu-cli-templates-core).')
            .option('-t|--temp-path <temp>', `The temporary files path to use (default: {{userHomePath}}\\smart-matrix\\lcu).`)
            .action(async (options: any) => {
                if (await this.isLcuInitialized())
                    this.establishSectionHeader('LCU Already Initialized', 'yellow');
                else {
                    this.establishSectionHeader('Initializing');

                    var context = {
                        projectsPath: 'projects',
                        repo: options.repository || 'lowcodeunit/lcu-cli-templates-core',
                        tempPath: options.tempPath || '{{userHomePath}}\\smart-matrix\\lcu'
                    };

                    try {
                        var answers = await this.establishTemplatesRepo(this.pathJoin(context.tempPath, 'repos', context.repo), context.repo);

                        context = Object.assign(context, answers);

                        await this.processTemplates(context);

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

    protected async processTemplates(context: any) {
        var ora = this.Ora.start('Started creation of LCU config file...');

        var lcuFile = await this.loadLCUConfigTemplate(context.tempPath, 'repos', context.repo, this.SysPath);

        lcuFile = await this.compileTemplate(lcuFile, context);

        var lcuConfig = JSON.parse(lcuFile);

        await this.saveLCUConfig(lcuConfig);

        ora.succeed('Completed creation of the LCU config file.');
    }
}