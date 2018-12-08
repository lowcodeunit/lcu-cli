import { Logger } from '../logging/logger';
import { Command } from 'commander';
export declare class LowCodeUnityCLIService {
    protected version: string;
    protected logger: Logger;
    protected program: Command;
    constructor(version: string, logger: Logger);
    SetupCLI(): Promise<void>;
    StartCLI(args: string[]): Promise<void>;
    protected initCliCommand(): Promise<void>;
    protected setupInitializeCommand(): Promise<void>;
}
