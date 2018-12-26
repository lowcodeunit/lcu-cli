import { BaseCommandService } from "./BaseCommandService";
import { Command } from "commander";
export declare class DAFCommandService extends BaseCommandService {
    constructor();
    Setup(program: Command): Promise<Command>;
    protected ensureActionName(actionName: string): Promise<string>;
}
