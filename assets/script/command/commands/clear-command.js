import { Command } from "../command.js";
import { CommandHandler } from "../command-handler.js";
export class ClearCommand extends Command {
    constructor() {
        super("clear", "Clear the screen.");
    }
    async execute() {
        CommandHandler.cliContainer.querySelectorAll(":scope > :is(span, br)").forEach(e => e.remove());
    }
}
