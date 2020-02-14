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
            .option('-iw|--initWith [initWith]', 'The initialization type to specify a set of docs to create.')
            .option('-ic|--includeComponent [includeComponent]', 'Whether or not to include component files containing documentation setup code.')
            .option('-ir|--includeRouting [includeRouting]', 'Whether or not to include a route for the newly created component.')
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
                        initWith: options.initWith || null,
                        includeComponent: options.includeComponent || false,
                        includeRouting: options.includeRouting || false
                    };

                    context.projectName = await this.ensureInquired(context.projectName, 'project');

                    try {
                        let lcuConfig = await this.loadLCUConfig();

                        let templateRepoPath = this.pathJoin(this.tempFiles, 'repos', lcuConfig.templates.repository, 'documentation');

                        let answers = await this.inquir(templateRepoPath);

                        context = await this.mergeObjects(context, answers);
                        await this.processTemplateCommands(templateRepoPath, context);

                        this.Ora.succeed(`Completed documentation setup in the project: ${context.projectName}.`);
                        
                    } catch (err) {
                        this.Ora.fail(`Issue establishing documentation: \r\n${err}`);
                        
                        process.exit(1);
                    }
                }
            });
    }

}