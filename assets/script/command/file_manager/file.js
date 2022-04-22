import { IllegalArgumentError } from "../../errors/illegal-argument-error.js";
import { isString } from "../utils.js";
import { INode } from "./inode.js";
export class File extends INode {
    static #pattern = /^[a-zA-Z ]+\.[a-zA-Z]+$/;
    #content = "";
    constructor(name, parentDirectory) {
        super(name, parentDirectory);
        if (!File.#pattern.test(name)) {
            throw new IllegalArgumentError("File name is invalid.");
        }
    }
    getContent() {
        return this.#content;
    }
    write(input) {
        if (isString(input)) {
            this.#content = input;
        }
        this.#content = input.toString(10);
    }
}
