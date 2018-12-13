import { BaseCommandService } from './BaseCommandService';
import { Command } from 'commander';
export declare class ProjectCommandService extends BaseCommandService {
    constructor();
    Setup(program: Command): Promise<Command>;
    protected ensureProjectName(projectName: string): Promise<string>;
    protected processTemplateInquiries(templatesRepoPath: string, context: any): Promise<any>;
}
