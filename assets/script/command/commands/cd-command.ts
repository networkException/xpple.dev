import {Command} from "../command.js";
import {FileManager} from "../file_manager/file-manager.js";
import {PathArgument} from "../arguments/path-argument.js";
import {StringReader} from "../string-reader.js";

export class CdCommand extends Command {

    public constructor() {
        super("cd", "Go to a directory.");
    }

    public override async execute(reader: StringReader): Promise<void> {
        if (!reader.canRead()) {
            FileManager.setCurrentDirectory(FileManager.getRoot());
            return;
        }
        const directory = new PathArgument().parse(reader);
        FileManager.setCurrentDirectory(directory);
    }
}
