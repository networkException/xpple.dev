import {Command} from "../command.js";

export class XppleCommand extends Command {

    public constructor() {
        super("xpple", "Say hi to me!");
    }

    public override async execute(): Promise<void> {
        this.sendFeedback("Hey!");
    }
}
