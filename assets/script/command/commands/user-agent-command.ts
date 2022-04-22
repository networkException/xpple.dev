import {Command} from "../command.js";

export class UserAgentCommand extends Command {

    constructor() {
        super("useragent", "Get your current user agent.");
    }

    public override async execute(): Promise<void> {
        this.sendFeedback(navigator.userAgent);
    }
}
