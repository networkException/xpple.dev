import { Command } from "../command.js";
import { PathArgument } from "../arguments/path-argument.js";
export class LsCommand extends Command {
    constructor() {
        super("ls", "List all directories and files.");
    }
    async execute(reader) {
        const directory = new PathArgument().parse(reader);
        for (const dirName of directory.getDirectories().keys()) {
            this.sendFeedback(dirName);
        }
        for (const fileName of directory.getFiles().keys()) {
            this.sendFeedback(fileName);
        }
    }
}
