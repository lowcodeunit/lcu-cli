import { Logger } from '../logging/logger';
import { Command } from 'commander';
import { ICommandService } from './commands/ICommandService';
export declare class LowCodeUnityCLIService {
    protected version: string;
    protected logger: Logger;
    protected program: Command;
    constructor(version: string, logger: Logger);
    SetupCLI(commands: ICommandService[]): Promise<void>;
    StartCLI(args: string[]): Promise<void>;
    protected handleInteruptCommand(): void;
    protected setupCli(): Promise<void>;
}
