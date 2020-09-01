import { Command } from 'commander';

export interface ICommandService {
    Setup(program: Command): Promise<Command>;
}

export interface LCUOra {
    start(text?: string): LCUOra;

    stop(): LCUOra;

    succeed(text?: string): LCUOra;

    fail(text?: string): LCUOra;

    warn(text?: string): LCUOra;

    info(text?: string): LCUOra;

    stopAndPersist(options?: LCUPersistOptions | string): LCUOra;

    clear(): LCUOra;

    render(): LCUOra;

    frame(): LCUOra;

    text: string;

    color: LCUColor;

    // making this optional, because it doesn't seem to exist,
    //but I'm not sure if it's used further down the line - Shannon
    frameIndex?: number;
}

export interface LCUPersistOptions {
    symbol?: string;
    text?: string;
}

export type LCUColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray';
