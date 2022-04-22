import { Command } from "../command.js";
import { FileManager } from "../file_manager/file-manager.js";
import { Directory } from "../file_manager/directory.js";
import { IllegalArgumentError } from "../../errors/illegal-argument-error.js";
export class MkDirCommand extends Command {
    constructor() {
        super("mkdir", "Create a new directory.");
    }
    async execute(reader) {
        if (reader.canRead()) {
            const dirString = reader.readString();
            const dir = new Directory(dirString, FileManager.getCurrentDirectory());
            const success = FileManager.getCurrentDirectory().addDirectory(dir);
            if (!success) {
                throw new IllegalArgumentError("A directory with this name already exists.");
            }
        }
        else {
            throw new IllegalArgumentError("Expected directory name.");
        }
    }
}
