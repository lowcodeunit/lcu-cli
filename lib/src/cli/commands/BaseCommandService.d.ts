import { CLIConfig } from './../core/cli-config';
import { LCUOra, LCUColor } from './ICommandService';
import { Command } from 'commander';
import { Questions } from 'inquirer';
export declare abstract class BaseCommandService {
    protected readonly userHomePath: string;
    protected readonly Ora: LCUOra;
    SysPath: string;
    constructor();
    abstract Setup(program: Command): Promise<Command>;
    protected clear(): Promise<void>;
    protected establishNextSteps(steps: string[], color?: LCUColor): Promise<void>;
    protected establishSectionHeader(title: string, color?: LCUColor, showHeader?: boolean, length?: number): Promise<void>;
    protected establishHeader(): Promise<void>;
    protected inquir(questions: Questions<{}> | string, errMsg?: string, exitOnError?: boolean): Promise<void | {}>;
    protected isLcuInitialized(): Promise<boolean>;
    protected jsonCleanup(value: string): string;
    protected loadCLIConfig(rootPath: string): Promise<CLIConfig>;
    protected loadLCUConfig(): Promise<any>;
    protected loadFile(file: string): Promise<string>;
    protected loadJS(file: string): Promise<any>;
    protected loadJSON(file: string): Promise<any>;
    protected loadTemplateInquirerQuestions(rootPath: string): Promise<any>;
    protected mergeObjects(root: any, merged: any): Promise<any>;
}
