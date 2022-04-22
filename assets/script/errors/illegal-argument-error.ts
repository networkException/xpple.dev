import {CommandSyntaxError} from "./command-syntax-error.js";

export class IllegalArgumentError extends CommandSyntaxError {

    public constructor(argument: string) {
        super(`Illegal argument: ${argument}`);
    }

    public override getName(): string {
        return "IllegalArgumentError";
    }
}
