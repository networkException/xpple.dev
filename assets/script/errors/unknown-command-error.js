import { CommandSyntaxError } from "./command-syntax-error.js";
export class UnknownCommandError extends CommandSyntaxError {
    constructor(commandString) {
        super(`Unknown command '${commandString}'. Execute 'help' for a list of commands.`);
    }
    getName() {
        return "UnknownCommandError";
    }
}
