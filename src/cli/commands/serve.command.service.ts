import { Logger } from '../../logging/logger';
import { BaseCommandService } from './BaseCommandService';
import { Command } from 'commander'
import Chalk from 'chalk';
import exeq from 'exeq';
import chokidar from 'chokidar';
import { AsyncHelpers } from '../../helpers/3rdparty-async';
import request from 'request';
import { createReadStream } from 'fs-extra';
import recursive from 'recursive-readdir';

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

                        //  Broadcast to dev-stream start of new app, so as to clear out all old dev-stream files for the app

                        recursive(outputPath, (err, files) => {
                            files.forEach(file => {
                                this.processFileChange(file, context.host, context.app);
                            });  
                        });

                        Logger.Basic('Initial files loaded to dev-stream')

                        var watcher = chokidar.watch(outputPath, {persistent: true});

                        watcher
                            .on('add', (path) => {
                                this.processFileChange(path, context.host, context.app);
                            })
                            .on('change', (path) => {
                                this.processFileChange(path, context.host, context.app);
                            })
                            .on('unlink', (path) => {
                                this.processFileChange(path, context.host, context.app);
                            })
                            .on('error', (error) => {
                                console.error('Error happened', error);
                            });

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
    protected processFileChange(filePath: string, host: string, app: string, shouldDelete: boolean = false) {
        if (filePath.startsWith('\\'))
            filePath = filePath.substring(1);

        Logger.Basic(`Processing file change for ${filePath} to ${host}${app} as ${(!shouldDelete ? 'upload' : 'delete')}`);
        
        if (host.indexOf('://') < 0)
            host = `http://${host}`;
        
        var url = `${host}${app}`;
        
        if (!shouldDelete) {
            var req = request.post({
                url: url,
                headers: {
                    'f-dev-stream': 'future-auth-key??'
                }
              }, function (err, resp, body) {
                if (err) {
                    Logger.Basic('Error!' + err);
                } else {
                    Logger.Basic('URL: ' + body);
                }
            });

          var form = req.form();

          form.append('file', createReadStream(filePath));
        } else {
            url += `?deletePath=${filePath}`
            
            var req = request.delete({
                url: url,
                headers: {
                  'f-dev-stream': 'future-auth-key??'
                }
              }, function (err, resp, body) {
                if (err) {
                    Logger.Basic('Error!');
                } else {
                    Logger.Basic('URL: ' + body);
                }
            });
        }
    }
}