import { File } from "./file.js";
import { IllegalArgumentError } from "../../errors/illegal-argument-error.js";
import { INode } from "./inode.js";
export class Directory extends INode {
    static #pattern = /^[a-zA-Z ]+$/;
    #files = new Map();
    #directories = new Map();
    #isRoot = false;
    constructor(name, parentDirectory, isRoot = false) {
        super(name, parentDirectory);
        this.#isRoot = isRoot;
        if (!Directory.#pattern.test(name) && !isRoot) {
            throw new IllegalArgumentError("Directory name is invalid.");
        }
    }
    getFiles() {
        return this.#files;
    }
    getDirectories() {
        return this.#directories;
    }
    isRoot() {
        return this.#isRoot;
    }
    addFile(file) {
        if (this.#files.has(file.name)) {
            return false;
        }
        this.#files.set(file.name, file);
        return true;
    }
    addDirectory(directory) {
        if (directory.isRoot()) {
            return false;
        }
        if (this.#directories.has(directory.name)) {
            return false;
        }
        this.#directories.set(directory.name, directory);
        return true;
    }
    deleteFile(file) {
        if (file instanceof File) {
            return this.#files.delete(file.name);
        }
        return this.#files.delete(file);
    }
    deleteDirectory(directory) {
        if (directory instanceof Directory) {
            return this.#directories.delete(directory.name);
        }
        return this.#directories.delete(directory);
    }
}
