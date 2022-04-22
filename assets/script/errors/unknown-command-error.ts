import {CommandSyntaxError} from "./command-syntax-error.js";

export class UnknownCommandError extends CommandSyntaxError {

    public constructor(commandString: string) {
        super(`Unknown command '${commandString}'. Execute 'help' for a list of commands.`);
    }

    public override getName(): string {
        return "UnknownCommandError";
    }
}
