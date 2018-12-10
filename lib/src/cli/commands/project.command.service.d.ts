import { BaseCommandService } from './BaseCommandService';
import { Command } from 'commander';
export declare class ProjectCommandService extends BaseCommandService {
    constructor();
    Setup(program: Command): Promise<Command>;
    protected ensureProjectName(projectName: string): Promise<string>;
    protected establishTemplatesRepo(repoTempPath: string, repo: string): Promise<{}>;
    protected mergeLcuFiles(lcuConfig: any, lcuConfigTemplate: string, context: any): Promise<any>;
    protected processTemplateInquiries(context: any): Promise<any>;
    protected processTemplates(context: any): Promise<void>;
    protected processTemplateCommands(templateSourcePath: string, context: any): Promise<void>;
    protected processNextCommand(commands: string[], context: any): Promise<void>;
}
