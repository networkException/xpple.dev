import { CommandSyntaxError } from "./command-syntax-error.js";
export class IllegalArgumentError extends CommandSyntaxError {
    constructor(argument) {
        super(`Illegal argument: ${argument}`);
    }
    getName() {
        return "IllegalArgumentError";
    }
}
