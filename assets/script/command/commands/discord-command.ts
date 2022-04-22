import {Command} from "../command.js";

export class DiscordCommand extends Command {

    public  constructor() {
        super("discord", "Get the link to my Discord.");
    }

    public override async execute(): Promise<void> {
        this.sendFeedback(`<a href="https://discord.xpple.dev/" target="_blank">https://discord.xpple.dev/</a>`);
    }
}
