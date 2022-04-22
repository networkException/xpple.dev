import {Command} from "../command.js";
import {CommandHandler} from "../command-handler.js";
import {StringReader} from "../string-reader.js";

export class EchoCommand extends Command {

    public constructor() {
        super("echo", "Print something to the screen.");
    }

    public override async execute(reader: StringReader): Promise<void> {
        const text = reader.getRemaining();
        this.sendFeedback(CommandHandler.sanitiseString(text));
    }
}
