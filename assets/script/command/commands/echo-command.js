import { Command } from "../command.js";
import { CommandHandler } from "../command-handler.js";
export class EchoCommand extends Command {
    constructor() {
        super("echo", "Print something to the screen.");
    }
    async execute(reader) {
        const text = reader.getRemaining();
        this.sendFeedback(CommandHandler.sanitiseString(text));
    }
}
