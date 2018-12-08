import { CLIConfig } from '../core/cli-config';
import { CLIOptions } from '../core/cli-options';
import { BaseCommandService } from './BaseCommandService';
import { Command } from 'commander';
export declare class ProjectCommandService extends BaseCommandService {
    constructor();
    Setup(program: Command): Promise<Command>;
    protected ensureProjectName(projectName: string): Promise<string>;
    protected establishTemplates(repoTempPath: string, repo: string): Promise<{
        Answers: {};
        CLI: CLIConfig;
    }>;
    protected loadTemplateInquirerQuestions(rootPath: string): Promise<any>;
    protected processTemplates(cli: CLIOptions, context: any): Promise<void>;
}
