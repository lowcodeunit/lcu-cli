import { Logger } from '../../logging/logger';
import { BaseCommandService } from './BaseCommandService';
import { Command } from 'commander'
import Chalk from 'chalk';
import exeq from 'exeq';
import chokidar from 'chokidar';
import { AsyncHelpers } from '../../helpers/3rdparty-async';

export class ServeCommandService extends BaseCommandService {
    //  Fields

    //  Properties

    //  Constructors
    constructor() {
        super();
    }

    //  API Methods
    public async Setup(program: Command): Promise<Command> {
        return program
            .command('serve')
            .description('Serve an LCU app into a dev-stream.')
            .option('-p|--project <project>', 'The project to serve.')
            .option('-h|--host <host>', 'The host to serve to.')
            .option('-a|--app <app>', 'The app path to serve to (must match an LCU configured dev-stream app).')
            .action(async (options: any) => {
                if (!(await this.isLcuInitialized())) {
                    this.establishSectionHeader('LCU must be Initialized', 'yellow');

                    this.establishNextSteps(['Initialize the LCU:', 'lcu init'])
                } else {
                    this.establishSectionHeader('Serving');

                    var context = {
                        project: options.project,
                        host: options.host,
                        app: options.app
                    };

                    var angularJson: any = await this.loadJSON('angular.json');

                    var projects = Object.keys(angularJson.projects);

                    context.project = await this.ensureInquiredOptions(context.project, "project", projects);
                    
                    context.host = await this.ensureInquired(context.host, "host");
                    
                    context.app = await this.ensureInquired(context.app, "application");

                    Logger.Basic(context);
                    
                    try {
                        var ora = this.Ora.start(`Serving the project ${context.project}`);

                        var outputPath = angularJson.projects[context.project].architect.build.options.outputPath;

                        Logger.Basic(outputPath);
                    
                        //  Broadcast to dev-stream start of new app, so as to clear out all old dev-stream files for the app

                        var watcher = chokidar.watch(outputPath, {persistent: true});

                        watcher
                            .on('add', (path) => {
                                console.log('File', path, 'has been added');
                            })
                            .on('change', (path) => {
                                console.log('File', path, 'has been changed');
                            })
                            .on('unlink', (path) => {
                                console.log('File', path, 'has been removed');
                            })
                            .on('error', (error) => {
                                console.error('Error happened', error);
                            });

                        //  Broadcast the files from output path to dev-stream

                        //  Start a watch listener on the output path of project to stream all changes up the dev-stream

                        // await this.processCommand([`ng build ${context.project} --watch`], context);

                        ora.succeed('Completed serving of the project');
                    } catch (err) {
                        this.Ora.fail(`Issue updating LCU`);

                        console.log(err);

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