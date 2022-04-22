import { Command } from "../command.js";
import { UnknownCommandError } from "../../errors/unknown-command-error.js";
export class HelpCommand extends Command {
    constructor() {
        super("help", "Get help.");
    }
    async execute(reader) {
        if (reader.canRead()) {
            const commandString = reader.readString();
            let command = Command.commands.get(commandString);
            if (command === undefined) {
                throw new UnknownCommandError(commandString);
            }
            this.sendFeedback(command.description);
            return;
        }
        this.sendFeedback("Available commands:");
        for (const command of Command.commands.values()) {
            this.sendFeedback(" - " + command.rootLiteral);
        }
        this.sendFeedback("To get help for a specific command, type 'help &lt;command&gt;'.");
    }
}
