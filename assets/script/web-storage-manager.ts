import {FileManager} from "./command/file_manager/file-manager.js";

export class WebStorageManager {

    static #localStorage = window.localStorage;

    static #sessionStorage = window.sessionStorage;

    static saveDirectoriesAndFiles(): void {
        const obj = FileManager.serialise(FileManager.getRoot());
        this.#localStorage.setItem("files", JSON.stringify(obj));
    }

    static loadDirectoriesAndFiles(): void {
        const json = this.#localStorage.getItem("files");
        if (json === null) {
            return;
        }

        FileManager.deserialise(JSON.parse(json)["~"], FileManager.getRoot());
    }
}
