import { Logger } from './../../logging/logger';
import { BaseCommandService } from './BaseCommandService';
import { Command } from 'commander'
import Chalk from 'chalk';
import exeq from 'exeq';
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
            .option('-s|--scope <scope>', 'The scope to add the Solution to.')
            .option('--ver-to <ver-to>', 'The version to update to.')
            .action(async (options: any) => {
                if (!(await this.isLcuInitialized())) {
                    this.establishSectionHeader('LCU must be Initialized', 'yellow');

                    this.establishNextSteps(['Initialize the LCU:', 'lcu init'])
                } else {
                    this.establishSectionHeader('Updating');

                    var lcuConfig = await this.loadLCUConfig();

                    var context = {
                        repo: options.repository || lcuConfig.templates.repository || 'lowcodeunit-devkit/lcu-cli-templates-core',
                        scopes: options.scope ? options.scope.split(',') : ['@lcu', '@lowcodeunit'],
                        version: options.verTo || 'latest'
                    };

                    console.log(context);
                    
                    lcuConfig.templates.repository = context.repo;

                    try {
                        await this.saveLCUConfig(lcuConfig);

                        var repoTempPath = this.pathJoin(this.tempFiles, 'repos', context.repo);

                        await this.establishTemplatesRepo(repoTempPath, context.repo);

                        var answers = this.inquir(this.pathJoin(repoTempPath, 'update'));

                        context = Object.assign(context, answers);

                        await this.processTemplates(context, 'update');

                        await this.upgradeLCUPackages(context.scopes, context.version);

                        this.Ora.succeed('Completed update of the LCU');
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

    protected async upgradeLCUPackages(scopes: string[], version: string) {
        return new Promise<{}>(async (resolve, reject) => {
            var packageJSON = await this.loadJSON('package.json');

            var deps: [] = packageJSON.dependencies || [];

            var devDeps: [] = packageJSON.devDependencies || [];

            var lcuUpgradeCommands = [];

            var depsUpgradeCommands = Object.keys(deps).map(depKey => {
                var dep = deps[depKey];

                if (scopes.some(v => depKey.startsWith(v)))
                    return `${depKey}@${version}`;
                else
                    return null;
            }).filter(d => d != null);

            if (depsUpgradeCommands && depsUpgradeCommands.length > 0) 
                lcuUpgradeCommands.push(`npm i ${depsUpgradeCommands.join(' ')} --save`);

            var devDepsUpgradeCommands = Object.keys(devDeps).map(depKey => {
                var dep = deps[depKey];

                if (scopes.some(v => depKey.startsWith(v)))
                    return `${depKey}@${version}`;
                else
                    return null;
            }).filter(d => d != null);

            if (devDepsUpgradeCommands && devDepsUpgradeCommands.length > 0) 
                lcuUpgradeCommands.push(`npm i ${devDepsUpgradeCommands.join(' ')} --save-dev`);

            if (lcuUpgradeCommands.length > 0) {
                var upgrade = lcuUpgradeCommands.join(' && ');

                Logger.Basic(`Executing upgrade command '${upgrade}'...`);

                var proc = exeq(upgrade);

                proc.q.on('stdout', (data) => {
                    Logger.Basic(data);
                });

                proc.q.on('stderr', (data) => {
                    Logger.Basic(data);
                });

                proc.q.on('killed', (reason) => {
                    Logger.Basic(`Killed upgrade command '${upgrade}'!`);
                });

                proc.q.on('done', async () => {
                    Logger.Basic(`Executed upgrade command '${upgrade}'!`);

                    resolve();
                });

                proc.q.on('failed', () => {
                    Logger.Basic(`Failed upgrade command '${upgrade}'!`);

                    reject();
                });
            } else {
                Logger.Basic(`Executed upgrade command !`);

                resolve();
            }
        });
    }
}