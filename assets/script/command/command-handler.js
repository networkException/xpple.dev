import {Command} from "./command.js";
import {XppleCommand} from "./commands/xpple-command.js";
import {UnknownCommandError} from "../errors/unknown-command-error.js";
import {StringReader} from "./string-reader.js";
import {CommandSyntaxError} from "../errors/command-syntax-error.js";
import {DiscordCommand} from "./commands/discord-command.js";
import {HelpCommand} from "./commands/help-command.js";
import {ClearCommand} from "./commands/clear-command.js";

export class CommandHandler {

    /**
     * @type {HTMLDivElement}
     */
    static cliContainer = undefined;
    /**
     * @type {HTMLDivElement}
     */
    static #inputContainer = undefined;
    /**
     * @type {HTMLInputElement}
     */
    static #inputField = undefined;
    /**
     * @type {String}
     */
    static #prompt = undefined;
    /**
     * @type {Array<String>}
     */
    static #history = [];
    static #historyIndex = 0;

    static init() {
        this.cliContainer = document.getElementById("cli-container");
        if (this.cliContainer === null) {
            console.error("CLI container doesn't exist.");
            return;
        }
        this.#inputContainer = document.getElementById("input-container");
        if (this.#inputContainer === null) {
            console.error("Input container doesn't exist.");
            return;
        }
        this.#inputField = document.getElementById("input-field");
        if (this.#inputField === null) {
            console.error("Input field doesn't exist.");
            return;
        }
        this.#inputField.focus();
        const labels = this.#inputField.labels;
        if (labels.length !== 1) {
            console.error("Too many labels were associated to this input field.");
            return;
        }
        this.#prompt = this.#inputField.labels[0].innerText;
        this.#inputField.addEventListener('keydown', async e => {
            switch (e.key) {
                case "Enter":
                    if (e.shiftKey) {
                        break;
                    }
                    const value = this.#inputField.value;
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
                    this.#historyIndex = this.#history.length;
                    break;
                case "ArrowUp":
                    if (this.#historyIndex <= 0) {
                        break;
                    }
                    this.#inputField.value = this.#history[--this.#historyIndex];
                    this.#inputField.focus();
                    break;
                case "ArrowDown":
                    if (this.#historyIndex >= this.#history.length - 1) {
                        break;
                    }
                    this.#inputField.value = this.#history[++this.#historyIndex];
                    this.#inputField.focus();
                    break;
            }
        });

        this.#registerCommands();
    }

    static sendFeedback(string) {
        this.#inputContainer.insertAdjacentHTML('beforebegin', `<span style="color: white;">${string}</span><br>`);
    }

    static sendError(string) {
        this.#inputContainer.insertAdjacentHTML('beforebegin', `<span style="color: red;">${string}</span><br>`);
    }

    static async #handleCommand(commandString) {
        this.#inputField.value = "";
        commandString = this.#sanitiseString(commandString);
        this.#inputContainer.insertAdjacentHTML('beforebegin', `<span>${this.#prompt + commandString}</span><br>`);
        if (commandString === "") {
            return;
        }
        this.#history.push(commandString);
        const reader = new StringReader(commandString);
        const rootLiteral = reader.readUnquotedString();
        const command = Command.commands.get(rootLiteral);
        if (command === undefined) {
            throw new UnknownCommandError(commandString);
        }
        reader.skipWhitespace();
        await command.execute(reader);
    }

    static #sanitiseString(string) {
        const element = document.createElement("div");
        element.innerText = string;
        return element.innerHTML;
    }

    static #registerCommands() {
        Command.register(new XppleCommand());
        Command.register(new DiscordCommand());
        Command.register(new HelpCommand());
        Command.register(new ClearCommand());
    }
}