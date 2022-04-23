import { Command } from "../command.js";
import { FileManager } from "../file_manager/file-manager.js";
import { File } from "../file_manager/file.js";
import { IllegalArgumentError } from "../../errors/illegal-argument-error.js";
export class TouchCommand extends Command {
    constructor() {
        super("touch", "Create a new file.");
    }
    async execute(reader) {
        if (reader.canRead()) {
            const fileString = reader.readString();
            const file = new File(fileString, FileManager.getCurrentDirectory());
            const success = FileManager.getCurrentDirectory().addFile(file);
            if (!success) {
                throw new IllegalArgumentError("A file with this name already exists.");
            }
        }
        else {
            throw new IllegalArgumentError("Expected file name.");
        }
    }
}