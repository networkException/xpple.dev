import {CommandHandler} from "./command/command-handler.js";
import {FileManager} from "./command/file_manager/file-manager.js";
import {WebStorageManager} from "./web-storage-manager.js";

CommandHandler.init();
FileManager.init();
WebStorageManager.loadDirectoriesAndFiles();
