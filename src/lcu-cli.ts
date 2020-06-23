#!/usr/bin/env node
import { Logger } from './logging/logger';
import { LowCodeUnitCLIService } from './cli/lcu-cli.service';
import { ICommandService } from './cli/commands/ICommandService';
import { InitializeCommandService } from './cli/commands/initialize.command.service';
import { version } from '../package.json';
import { ProjectCommandService } from './cli/commands/project.command.service';
import { UpdateCommandService } from './cli/commands/update.command.service';
import { SolutionCommandService } from './cli/commands/solution.command.service';
import { DocumentationCommandService } from './cli/commands/documentation.command.service';

var logger = new Logger();

(async () => {
    var cli = new LowCodeUnitCLIService(version, logger);

    var commands: ICommandService[] = [];

    commands.push(new InitializeCommandService());

    commands.push(new ProjectCommandService());

    commands.push(new SolutionCommandService());

    // commands.push(new ServeCommandService()); // TODO: 'serve' is not ready for release yet

    commands.push(new UpdateCommandService());

    commands.push(new DocumentationCommandService());

    await cli.SetupCLI(commands);

    await cli.StartCLI(process.argv);
})();
