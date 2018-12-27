import { BaseCommandService } from "./BaseCommandService";
import { Command } from "commander";
export declare class DAFCommandService extends BaseCommandService {
    constructor();
    Setup(program: Command): Promise<Command>;
    protected deployAction(context: any): Promise<void>;
    protected ensureActionName(actionName: string): Promise<string>;
    protected switchAction(env?: "prod" | "dev", project?: string): Promise<void>;
}
