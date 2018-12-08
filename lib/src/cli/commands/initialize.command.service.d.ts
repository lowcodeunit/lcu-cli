import { BaseCommandService } from './BaseCommandService';
import { Command } from 'commander';
export declare class InitializeCommandService extends BaseCommandService {
    constructor();
    Setup(program: Command): Promise<Command>;
    protected establishTemplatesRepo(repoTempPath: string, repo: string): Promise<{}>;
    protected processTemplates(context: any): Promise<void>;
}
