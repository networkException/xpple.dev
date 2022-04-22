import { Command } from "../command.js";
export class UserAgentCommand extends Command {
    constructor() {
        super("useragent", "Get your current user agent.");
    }
    async execute() {
        this.sendFeedback(navigator.userAgent);
    }
}
