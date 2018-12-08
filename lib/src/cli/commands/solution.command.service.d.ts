import { BaseCommandService } from './BaseCommandService';
import { Command } from 'commander';
export declare class SolutionCommandService extends BaseCommandService {
    constructor();
    Setup(program: Command): Promise<Command>;
    protected ensureProjectName(projectName: string): Promise<string>;
    protected establishTemplates(repoTempPath: string, repo: string): Promise<{}>;
    protected loadTemplateOptions(rootPath: string): Promise<any>;
    protected loadTemplateSetupQuestions(rootPath: string): Promise<any>;
}
