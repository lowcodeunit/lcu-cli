import { BaseCommandService } from "./BaseCommandService";
import { Command } from "commander";
import { AsyncHelpers } from "../../helpers/3rdparty-async";
import Chalk from 'chalk';

export class StarterCommandService extends BaseCommandService {
    protected slnName: string;
    
    constructor() {
        super();
    }

    public async Setup(program: Command): Promise<Command> {
        return program
            .command('starter')
            .alias('str')
            .description('Initialize, generate, and establish an entire LCU project structure.')
            .option('-s|--scope <scope>', 'The @scope to use for package names.')
            .option('-w|--workspace <workspace>', 'The name of the workspace to use.')
            .option('-sn|--slnName <slnName>', 'The name of the project solution.')
            .option('-d|--docs <docs>', 'Whether or not to add docs to the base of the project.')
            .action(async (options: any) => {
                if (await this.isLcuInitialized()) {
                    this.establishSectionHeader('LCU Already Initialized', 'yellow');
                } else {
                    let context = {
                        projectsPath: 'projects',
                        repo: 'lowcodeunit-devkit/lcu-cli-templates-core',
                        scope: options.scope,
                        workspace: options.workspace,
                        slnName: options.slnName,
                        docs: options.docs || false,
                        projectName: 'lcu',
                        template: 'LCU',
                        initWith: null
                    };

                    try {
                        // Initialize
                        await this.initialize(context);

                        // Project
                        await this.setupProject(context);

                        // Solution
                        let slnContext: any = {
                            name: this.slnName,
                            disableLcuBootstrap: false,
                            export: 'src/lcu.api.ts',
                            module: 'app.module.ts',
                            path: 'lib/elements',
                            projectName: 'common',
                            template: 'Core'
                        };
                        await this.setupSolution(slnContext);

                        this.Ora.succeed('Completed initialization and creation of the LCU');
                    } catch(err) {
                        this.Ora.fail(`Issue establishing LCU: \r\n${err}`);

                        process.exit(1);
                    }
                }
            });
    }

    protected async initialize(context: any) {
        this.establishSectionHeader('LCU Initializing');
        context.scope = await this.ensureInquired(context.scope, 'scope');
        context.workspace = await this.ensureInquired(context.workspace, 'workspace');
        context.slnName = await this.ensureInquired(context.slnName, 'slnName', 'What is the solution name?');
        this.slnName = context.slnName;
        let repoTempPath = this.pathJoin(this.tempFiles, 'repos', context.repo);
        await this.establishTemplatesRepo(repoTempPath, context.repo);
        let answers = this.inquir(this.pathJoin(repoTempPath, 'initialize'));
        context = Object.assign(context, answers);
        await this.processTemplates(context, 'initialize');
        this.Ora.succeed('Completed initialization step');
    }

    protected async setupProject(context: any) {
        this.establishSectionHeader('LCU Project Setup');
        let lcuConfig = await this.loadLCUConfig();
        let templateRepoPath = this.pathJoin(this.tempFiles, 'repos', lcuConfig.templates.repository, 'project');
        let projAnswers = {"template":"LCU"};
        context = await this.mergeObjects(context, projAnswers);
        await this.processTemplateCommands(this.pathJoin(templateRepoPath, context.template), context);
        this.Ora.succeed(`Completed setup for project ${context.projectName}.`);
    }

    protected async setupSolution(context: any) {
        this.establishSectionHeader('LCU Solution Setup');        
        let lcuConfig = await this.loadLCUConfig();
        let templateRepoPath = this.pathJoin(this.tempFiles, 'repos', lcuConfig.templates.repository, 'solution');
        let slnAnswers = {"template":"Core"};
        context = await this.mergeObjects(context, slnAnswers);
        await this.processTemplateCommands(this.pathJoin(templateRepoPath, context.template), context);
        this.Ora.succeed(`Completed setup for solution ${context.projectName}.`);
    }

    //  Helpers
    protected async ensureName(name: string) {
        return await this.ensureInquired(name, 'name');
    }

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
