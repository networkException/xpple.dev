import { CommandHandler } from "./command-handler.js";
export class Command {
    rootLiteral;
    description;
    static commands = new Map();
    static register(command) {
        Command.commands.set(command.rootLiteral, command);
    }
    sendFeedback(string) {
        CommandHandler.sendFeedback(string);
    }
    sendError(string) {
        CommandHandler.sendError(string);
    }
    constructor(rootLiteral, description) {
        this.rootLiteral = rootLiteral;
        this.description = description;
    }
    async execute(reader) {
        throw new Error("Method of Abstract Class cannot be called");
    }
}
