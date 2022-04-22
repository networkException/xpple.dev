import {Command} from "../command.js";
import {FileManager} from "../file_manager/file-manager.js";
import {Directory} from "../file_manager/directory.js";
import {IllegalArgumentError} from "../../errors/illegal-argument-error.js";
import {StringReader} from "../string-reader.js";

export class MkDirCommand extends Command {

    public constructor() {
        super("mkdir", "Create a new directory.");
    }

    public override async execute(reader: StringReader): Promise<void> {
        if (reader.canRead()) {
            const dirString = reader.readString();
            const dir = new Directory(dirString, FileManager.getCurrentDirectory());
            const success = FileManager.getCurrentDirectory().addDirectory(dir);
            if (!success) {
                throw new IllegalArgumentError("A directory with this name already exists.");
            }
        } else {
            throw new IllegalArgumentError("Expected directory name.");
        }
    }
}
