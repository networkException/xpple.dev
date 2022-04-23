import {Command} from "./command.js";
import {XppleCommand} from "./commands/xpple-command.js";
import {UnknownCommandError} from "../errors/unknown-command-error.js";
import {StringReader} from "./string-reader.js";
import {CommandSyntaxError} from "../errors/command-syntax-error.js";
import {DiscordCommand} from "./commands/discord-command.js";
import {HelpCommand} from "./commands/help-command.js";
import {ClearCommand} from "./commands/clear-command.js";
import {UserAgentCommand} from "./commands/user-agent-command.js";
import {IpCommand} from "./commands/ip-command.js";
import {EchoCommand} from "./commands/echo-command.js";
import {CdCommand} from "./commands/cd-command.js";
import {MkDirCommand} from "./commands/mkdir-command.js";
import {LsCommand} from "./commands/ls-command.js";
import {TouchCommand} from "./commands/touch-command.js";
import {WebStorageManager} from "../web-storage-manager.js";
import {CatCommand} from "./commands/cat-command.js";
import {PwdCommand} from "./commands/pwd-command.js";

export class CommandHandler {

    static cliContainer: HTMLElement;
    static #inputContainer: HTMLElement;
    static inputField: HTMLInputElement;
    static prompt: string;
    static #history: Array<string> = new Array<string>();
    static #historyIndex = 0;

    static init(): void {
        const cliContainer = document.getElementById("cli-container");
        if (cliContainer === null) {
            return console.error("CLI container doesn't exist.");
        }

        const inputContainer = document.getElementById("input-container");
        if (inputContainer === null) {
            return console.error("Input container doesn't exist.");
        }

        const inputField = document.getElementById("input-field");
        if (inputField === null) {
            return console.error("Input field doesn't exist.");
        }

        if (!(inputField instanceof HTMLInputElement)) {
            return console.error("Input field is not an input element.");;
        }

        this.cliContainer = cliContainer;
        this.#inputContainer = inputContainer;
        this.inputField = inputField;

        inputField.focus();
        inputField.addEventListener('keydown', async e => {
            switch (e.key) {
                case "Enter":
                    if (e.shiftKey) {
                        break;
                    }
                    const value = inputField.value;
                    inputContainer.style.visibility = "hidden";
                    try {
                        await this.#handleCommand(value);
                    } catch (e) {
                        if (e instanceof CommandSyntaxError) {
                            this.sendError(e.message);
                        } else {
                            this.sendError("An unknown error occurred. See the console for more details.");
                            console.error(e);
                        }
                    }
                    WebStorageManager.saveDirectoriesAndFiles();
                    inputContainer.style.visibility = "visible";
                    inputField.focus();
                    this.#historyIndex = this.#history.length;
                    break;
                case "ArrowUp":
                    if (this.#historyIndex <= 0) {
                        break;
                    }
                    inputField.value = this.#history[--this.#historyIndex];
                    inputField.focus();
                    break;
                case "ArrowDown":
                    if (this.#historyIndex >= this.#history.length - 1) {
                        break;
                    }
                    inputField.value = this.#history[++this.#historyIndex];
                    inputField.focus();
                    break;
            }
        });

        this.#registerCommands();
    }

    public static sendFeedback(string: HTMLElement | string): void {
        this.#inputContainer?.insertAdjacentHTML('beforebegin', `<span style="color: white;">${string}</span><br>`);
    }

    public static sendError(string: HTMLElement | string): void {
        this.#inputContainer?.insertAdjacentHTML('beforebegin', `<span style="color: red;">${string}</span><br>`);
    }

    static async #handleCommand(commandString: string): Promise<void> {
        this.inputField.value = "";
        const cleanCommandString = this.sanitiseString(commandString);
        this.#inputContainer.insertAdjacentHTML('beforebegin', `<span>${this.prompt + cleanCommandString}</span><br>`);
        if (commandString === "") {
            return;
        }
        this.#history.push(commandString);
        const reader = new StringReader(commandString);
        const rootLiteral = reader.readUnquotedString();
        const command = Command.commands.get(rootLiteral);
        if (command === undefined) {
            throw new UnknownCommandError(cleanCommandString);
        }
        reader.skipWhitespace();
        await command.execute(reader);
    }

    public static sanitiseString(string: string): string {
        const element = document.createElement("div");
        element.innerText = string;
        return element.innerHTML;
    }

    static #registerCommands(): void {
        Command.register(new CatCommand());
        Command.register(new CdCommand());
        Command.register(new ClearCommand());
        Command.register(new DiscordCommand());
        Command.register(new EchoCommand());
        Command.register(new HelpCommand());
        Command.register(new IpCommand());
        Command.register(new LsCommand());
        Command.register(new MkDirCommand());
        Command.register(new PwdCommand());
        Command.register(new TouchCommand());
        Command.register(new UserAgentCommand());
        Command.register(new XppleCommand());
    }
}
