import { Logger } from '../logging/logger';
import commander, { Command } from 'commander'
import { ICommandService } from './commands/ICommandService';

export class LowCodeUnityCLIService {
    //  Fields
    protected program: Command;

    //  Properties

    //  Constructors
    constructor(protected version: string, protected logger: Logger) {
        this.program = commander
            .version(this.version, '-v|--version');
    }

    //  API Methods
    public async SetupCLI(commands: ICommandService[]) {
        await this.setupCli();

        commands.forEach(async (command) => {
            await command.Setup(this.program);
        });

        process.on('SIGINT', async () => {
            await this.handleInteruptCommand();
        });
    }

    public async StartCLI(args: string[]) {
        this.program.parse(args);
    }

    //  Helpers

    protected handleInteruptCommand() {
        //  TODO: Doesn't Work on windows!?  Maybe anywhere?  Want it to exit without prompt.    
        process.exit(1);
    }

    protected async setupCli() {
        this.program
            .description('This is the home of the LCU DevKit and the LCU CLI code.');
    }
}