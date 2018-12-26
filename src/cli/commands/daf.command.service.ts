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
        "-d|--dest|--destination <destination>",
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
            var lcuConfig = await this.loadLCUConfig();

            var fullName = `${context.scope}/${context.package}`;

            var commands = [];

            switch (context.actionName) {
              case "Deploy":
                commands.push(`npm i ${fullName}@latest --save`);
                break;
            }

            await this.processCommand(commands, context);

            await copy(
              `node_modules/${context.scope}/${context.package}`,
              context.destination
            );

            this.Ora.succeed(
              `Completed setup for project ${context.projectName}.`
            );
          } catch (err) {
            this.Ora.fail(`Issue establishing project: \r\n${err}`);

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
