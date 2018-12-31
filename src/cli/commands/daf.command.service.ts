import { Logger } from "../../logging/logger";
import { BaseCommandService } from "./BaseCommandService";
import { Command } from "commander";
import exeq from "exeq";
import { copy, readJSON, writeJSON, pathExists } from "fs-extra";

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
      .description("Executed the various DAF related LCU commands against the current workspace.")
      .option("-p|--package <package>", "The Package name to use in the operation.")
      .option("-s|--scope <scope>", "The Scope to use in the operation.")
      .option("-d|--destination <destination>", "The Destination to use in the operation.")
      .option("-e|--env <env>", "The Environment to use in the operation.")
      .option("--project <project>", "The Project to use in the operation.")
      .option("--install <install>", "Whether or nor to install the package.")
      .action(async (actionName: string, options: any) => {
        if (!(await this.isLcuInitialized())) {
          this.establishSectionHeader("LCU must be Initialized", "yellow");

          this.establishNextSteps(["Initialize the LCU:", "lcu init"]);
        } else {
          this.establishSectionHeader("Distributed Application Framework");

          var context = {
            actionName: actionName,
            destination: options.destination,
            env: options.env,
            install: options.install,
            package: options.package,
            project: options.project,
            scope: options.scope
          };

          context.actionName = await this.ensureActionName(context.actionName);

          try {
            switch (context.actionName) {
              case "Deploy":
                await this.deployAction(context);
                break;

              case "Switch":
                await this.switchAction(context.env, context.project);
                break;
            }

            this.Ora.succeed(`Completed DAF command for ${context.actionName}.`);
          } catch (err) {
            this.Ora.fail(`Issue with DAF command: \r\n${err}`);

            process.exit(1);
          }
        }
      });
  }

  //  Helpers
  protected async deployAction(context: any) {
    var fullName = `${context.scope}/${context.package}`;

    var installPath = `node_modules/${context.scope}/${context.package}`;

    var commands = [];

    if (context.install) commands.push(`npm i ${fullName}@latest --save`);

    if (await pathExists(context.destination)) commands.push(`rimraf ${context.destination}`);

    await this.processCommand(commands, context);

    await copy(installPath, context.destination);
  }

  protected async ensureActionName(actionName: string) {
    while (!actionName) {
      var answs: any = await this.inquir(
        [
          {
            type: "list",
            name: "actionName",
            message: "What action do you want to use?",
            choices: ["Deploy", "Switch"]
          }
        ],
        "Issue loading action name"
      );

      actionName = answs.actionName;
    }

    return actionName;
  }

  protected async switchAction(env?: "prod" | "dev", project?: string) {
    var angular = await readJSON("angular.json");

    project = project || angular.defaultProject;

    const prodPath = `dist/${project}`;

    const devPath = `C:\\Fathym\\Git\\Apps\\Forge\\Fathym.Forge.Web\\wwwroot\\${project}`;

    const outArgs = {
      DistPath: env == "prod" ? prodPath : env == "dev" ? devPath : null
    };

    var buildOptions = angular.projects[project].architect.build.options;

    if (!outArgs.DistPath) {
      if (buildOptions.outputPath == prodPath) outArgs.DistPath = devPath;
      else if (buildOptions.outputPath == devPath) outArgs.DistPath = prodPath;
    }

    buildOptions.outputPath = outArgs.DistPath;

    await writeJSON("angular.json", angular, { spaces: "\t" });
  }
}
