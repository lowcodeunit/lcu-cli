import { Logger } from "../../logging/logger";
import { BaseCommandService } from "./BaseCommandService";
import { Command } from "commander";
import exeq from "exeq";
import { copy } from "fs-extra";

export class DAFCommandService extends BaseCommandService {
  //  Fields

  //  Properties

  //  Constructors
  constructor() {
    super();
  }

  //  API Methods
  public async Setup(program: Command): Promise<Command> {
    return program
      .command("daf [action-name]")
      .description(
        "Executed the various DAF related LCU commands against the current workspace."
      )
      .option(
        "-p|--package <package>",
        "The Package name to use in the operation."
      )
      .option("-s|--scope <scope>", "The Scope to use in the operation.")
      .option(
        "-d|--destination <destination>",
        "The Destination to use in the operation."
      )
      .action(async (actionName: string, options: any) => {
        if (!(await this.isLcuInitialized())) {
          this.establishSectionHeader("LCU must be Initialized", "yellow");

          this.establishNextSteps(["Initialize the LCU:", "lcu init"]);
        } else {
          this.establishSectionHeader("Distributed Application Framework");

          var context: any = {
            actionName: actionName,
            destination: options.destination,
            package: options.package,
            scope: options.scope
          };

          context.actionName = await this.ensureActionName(context.actionName);

          try {
            var fullName = `${context.scope}/${context.package}`;

            var installPath = `node_modules/${context.scope}/${
              context.package
            }`;

            var commands = [];

            switch (context.actionName) {
              case "Deploy":
                commands.push(`npm i ${fullName}@latest --save`);

                commands.push(`rimraf ${context.destination}`);
                break;
            }

            await this.processCommand(commands, context);

            await copy(installPath, context.destination);

            this.Ora.succeed(
              `Completed DAF command for ${context.actionName}.`
            );
          } catch (err) {
            this.Ora.fail(`Issue with DAF command: \r\n${err}`);

            process.exit(1);
          }
        }
      });
  }

  //  Helpers
  protected async ensureActionName(actionName: string) {
    while (!actionName) {
      var answs: any = await this.inquir(
        [
          {
            type: "list",
            name: "actionName",
            message: "What action do you want to use?",
            choices: ["Deploy"]
          }
        ],
        "Issue loading action name"
      );

      actionName = answs.actionName;
    }

    return actionName;
  }
}
