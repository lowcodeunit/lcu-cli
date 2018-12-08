import { Logger } from '../logging/logger';
import { Command } from 'commander';
export declare class LowCodeUnityCLIService {
    protected version: string;
    protected logger: Logger;
    protected readonly currentPath: string;
    protected program: Command;
    SysPath: string;
    constructor(version: string, logger: Logger);
    SetupCLI(): Promise<void>;
    StartCLI(args: string[]): Promise<void>;
    protected ensureProjectName(projectName: string): Promise<string>;
    protected establishTemplates(repoTempPath: string, repo: string): Promise<{}>;
    protected establishSectionHeader(title: string, showHeader?: boolean, length?: number): Promise<void>;
    protected establishHeader(): Promise<void>;
    protected handleInteruptCommand(): void;
    protected loadTemplateOptions(rootPath: string): Promise<any>;
    protected loadTemplateSetupQuestions(rootPath: string): Promise<any>;
    protected loadFile(file: string): Promise<string>;
    protected loadJS(file: string): Promise<any>;
    protected loadJSON(file: string): Promise<any>;
    protected setupCli(): Promise<void>;
    protected setupInitializeCommand(): Promise<void>;
}
