export class CommandSyntaxError extends Error {
    constructor(message) {
        super(message);
    }
    getName() {
        return "CommandSyntaxError";
    }
}
