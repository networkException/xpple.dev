import { Command } from "../command.js";
import { FileManager } from "../file_manager/file-manager.js";
import { PathArgument } from "../arguments/path-argument.js";
export class CdCommand extends Command {
    constructor() {
        super("cd", "Go to a directory.");
    }
    async execute(reader) {
        if (!reader.canRead()) {
            FileManager.setCurrentDirectory(FileManager.getRoot());
            return;
        }
        const directory = new PathArgument().parse(reader);
        FileManager.setCurrentDirectory(directory);
    }
}
