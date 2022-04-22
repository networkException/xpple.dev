import { Command } from "../command.js";
import { FileManager } from "../file_manager/file-manager.js";
export class PwdCommand extends Command {
    constructor() {
        super("pwd", "Print the path of the current working directory.");
    }
    async execute() {
        this.sendFeedback(FileManager.getCurrentDirectory().getPath());
    }
}
