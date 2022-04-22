import { Directory } from "./directory.js";
import { CommandHandler } from "../command-handler.js";
import { isString } from "../utils.js";
import { File } from "./file.js";
export class FileManager {
    static #root;
    static #currentDirectory;
    static init() {
        this.#root = new Directory("~", undefined, true);
        this.setCurrentDirectory(this.#root);
    }
    static getRoot() {
        return this.#root;
    }
    static getCurrentDirectory() {
        return this.#currentDirectory;
    }
    static setCurrentDirectory(directory) {
        this.#currentDirectory = directory;
        let dirString = directory.name;
        while (directory.parent !== undefined) {
            directory = directory.parent;
            dirString = directory.name + '/' + dirString;
        }
        const labels = CommandHandler.inputField.labels ?? [];
        if (labels.length !== 1) {
            throw new Error("Too many labels were associated to this input field.");
        }
        const label = labels[0];
        const span = label.querySelector("span");
        if (span === null) {
            throw new Error("No span associated with label");
        }
        span.textContent = dirString;
        const textContent = label.textContent;
        if (textContent === null) {
            throw new Error("No text in label");
        }
        CommandHandler.prompt = textContent;
    }
    static serialise(directory) {
        let contents = {};
        for (const dir of directory.getDirectories().values()) {
            const tmp = this.serialise(dir);
            contents = { ...contents, ...tmp };
        }
        for (const [name, file] of directory.getFiles()) {
            contents = { ...contents, ...{ [name]: file.getContent() } };
        }
        return {
            [directory.name]: {
                ...contents
            }
        };
    }
    static deserialise(object, directory) {
        for (const [key, value] of Object.entries(object)) {
            if (isString(value)) {
                const file = new File(key, directory);
                file.write(value);
                directory.addFile(file);
            }
            else {
                const dir = new Directory(key, directory);
                this.deserialise(value, dir);
                directory.addDirectory(dir);
            }
        }
    }
}
