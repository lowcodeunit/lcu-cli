import { BaseCommandService } from './BaseCommandService';
import { Command } from 'commander';
export declare class SolutionCommandService extends BaseCommandService {
    constructor();
    Setup(program: Command): Promise<Command>;
    protected ensureName(name: string): Promise<string>;
    protected processTemplateInquiries(templatesRepoPath: string, context: any): Promise<any>;
}
