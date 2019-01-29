#!/usr/bin/env node
import { Logger } from './logging/logger';
import { LowCodeUnityCLIService } from './cli/lcu-cli.service';
import { ICommandService } from './cli/commands/ICommandService';
import { InitializeCommandService } from './cli/commands/initialize.command.service';
import { version } from '../package.json';
import { DAFCommandService } from './cli/commands/daf.command.service';
import { ElementCommandService } from './cli/commands/element.command.service';
import { ProjectCommandService } from './cli/commands/project.command.service';
import { ServeCommandService } from './cli/commands/serve.command.service';
import { UpdateCommandService } from './cli/commands/update.command.service';

var logger = new Logger();

(async () => {
    var cli = new LowCodeUnityCLIService(version, logger);

    var commands: ICommandService[] = [];

    commands.push(new InitializeCommandService());

    commands.push(new ProjectCommandService());

    commands.push(new ElementCommandService());

    commands.push(new ServeCommandService());

    commands.push(new UpdateCommandService());

    commands.push(new DAFCommandService());

    await cli.SetupCLI(commands);

    await cli.StartCLI(process.argv);
})();
