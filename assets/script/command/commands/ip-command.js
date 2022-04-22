import { Command } from "../command.js";
import { CommandHandler } from "../command-handler.js";
export class IpCommand extends Command {
    constructor() {
        super("ip", "Get your IP address.");
    }
    async execute() {
        const text = await (await fetch("https://api.ipify.org")).text();
        this.sendFeedback(CommandHandler.sanitiseString(text));
    }
}
