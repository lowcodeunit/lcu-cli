#!/usr/bin/env node
import { Logger } from './logging/logger';
import { LowCodeUnityCLIService } from './cli/lcu-cli.service';
import { ICommandService } from './cli/commands/ICommandService';
import { InitializeCommandService } from './cli/commands/initialize.command.service';
import { version } from '../package.json';
import { ProjectCommandService } from './cli/commands/project.command.service';

var logger = new Logger();

(async () => {
    var cli = new LowCodeUnityCLIService(version, logger);

    var commands: ICommandService[] = [];

    commands.push(new InitializeCommandService());

    commands.push(new ProjectCommandService());

    await cli.SetupCLI(commands);

    await cli.StartCLI(process.argv);
})();
