import {Command} from "../command.js";
import {PathArgument} from "../arguments/path-argument.js";
import {StringReader} from "../string-reader.js";

export class LsCommand extends Command {

    public constructor() {
        super("ls", "List all directories and files.");
    }

    public override async execute(reader: StringReader): Promise<void> {
        const directory = new PathArgument().parse(reader);
        for (const dirName of directory.getDirectories().keys()) {
            this.sendFeedback(dirName);
        }
        for (const fileName of directory.getFiles().keys()) {
            this.sendFeedback(fileName);
        }
    }
}
