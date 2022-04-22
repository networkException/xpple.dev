import {Command} from "../command.js";
import {FileManager} from "../file_manager/file-manager.js";
import {IllegalArgumentError} from "../../errors/illegal-argument-error.js";
import {CommandHandler} from "../command-handler.js";
import {StringReader} from "../string-reader.js";

export class CatCommand extends Command {

    public constructor() {
        super("cat", "View the contents of a file.");
    }

    public override async execute(reader: StringReader): Promise<void> {
        if (reader.canRead()) {
            const fileString = reader.readString();
            const file = FileManager.getCurrentDirectory().getFiles().get(fileString);
            if (file === undefined) {
                throw new IllegalArgumentError("File does not exist.");
            }
            this.sendFeedback(CommandHandler.sanitiseString(file.getContent()));
        } else {
            throw new IllegalArgumentError("Expected file name.");
        }
    }
}
