import {File} from "./file.js";
import {IllegalArgumentError} from "../../errors/illegal-argument-error.js";
import {INode} from "./inode.js";

export class Directory extends INode {

    static #pattern: RegExp = /^[a-zA-Z ]+$/;

    #files: Map<string, File> = new Map();

    #directories: Map<string, Directory> = new Map();

    #isRoot: boolean = false;

    public constructor(name: string, parentDirectory?: Directory, isRoot: boolean = false) {
        super(name, parentDirectory)

        this.#isRoot = isRoot;

        if (!Directory.#pattern.test(name) && !isRoot) {
            throw new IllegalArgumentError("Directory name is invalid.");
        }
    }

    public getFiles(): Map<string, File> {
        return this.#files;
    }

    public getDirectories(): Map<string, Directory> {
        return this.#directories;
    }

    public isRoot(): boolean {
        return this.#isRoot;
    }

    public addFile(file: File): boolean {
        if (this.#files.has(file.name)) {
            return false;
        }

        this.#files.set(file.name, file);
        return true;
    }

    public addDirectory(directory: Directory): boolean {
        if (directory.isRoot()) {
            return false;
        }
        if (this.#directories.has(directory.name)) {
            return false;
        }
        this.#directories.set(directory.name, directory);
        return true;
    }

    public deleteFile(file: File | string): boolean {
        if (file instanceof File) {
            return this.#files.delete(file.name);
        }

        return this.#files.delete(file);
    }

    public deleteDirectory(directory: Directory | string): boolean {
        if (directory instanceof Directory) {
            return this.#directories.delete(directory.name);
        }

        return this.#directories.delete(directory);
    }
}
