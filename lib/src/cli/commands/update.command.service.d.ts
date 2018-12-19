import { BaseCommandService } from './BaseCommandService';
import { Command } from 'commander';
export declare class UpdateCommandService extends BaseCommandService {
    constructor();
    Setup(program: Command): Promise<Command>;
    protected establishTemplatesRepo(repoTempPath: string, repo: string): Promise<{}>;
    protected processTemplates(context: any, subPath: string): Promise<void>;
    protected upgradeLCUPackages(): Promise<void>;
}
