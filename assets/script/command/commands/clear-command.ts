import {Command} from "../command.js";
import {CommandHandler} from "../command-handler.js";

export class ClearCommand extends Command {

    public constructor() {
        super("clear", "Clear the screen.");
    }

    public override async execute(): Promise<void> {
        CommandHandler.cliContainer.querySelectorAll(":scope > :is(span, br)").forEach(e => e.remove());
    }
}
