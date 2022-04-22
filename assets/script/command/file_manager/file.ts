import {Directory} from "./directory.js";
import {IllegalArgumentError} from "../../errors/illegal-argument-error.js";
import {isString} from "../utils.js";
import {INode} from "./inode.js";

export class File extends INode {

    static #pattern: RegExp = /^[a-zA-Z ]+\.[a-zA-Z]+$/;

    #content: string = "";

    public constructor(name: string, parentDirectory: Directory) {
        super(name, parentDirectory);

        if (!File.#pattern.test(name)) {
            throw new IllegalArgumentError("File name is invalid.");
        }
    }

    public getContent(): string {
        return this.#content;
    }

    public write(input: string | number) {
        if (isString(input)) {
            this.#content = input;
        }

        this.#content = input.toString(10);
    }
}
