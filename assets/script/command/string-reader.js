import { CommandSyntaxError } from "../errors/command-syntax-error.js";
export class StringReader {
    string;
    static #SYNTAX_ESCAPE = '\\';
    static #SYNTAX_DOUBLE_QUOTE = '"';
    static #SYNTAX_SINGLE_QUOTE = '\'';
    static #isAllowedNumber(char) {
        return char >= '0' && char <= '9' || char === '.' || char === '-';
    }
    static #isQuotedStringStart(char) {
        return char === StringReader.#SYNTAX_DOUBLE_QUOTE || char === StringReader.#SYNTAX_SINGLE_QUOTE;
    }
    static #isWhitespace(char) {
        return char === ' ' || char === '\t';
    }
    static #isAllowedInUnquotedString(char) {
        return char >= '0' && char <= '9'
            || char >= 'A' && char <= 'Z'
            || char >= 'a' && char <= 'z'
            || char === '_' || char === '-'
            || char === '.' || char === '+';
    }
    cursor;
    constructor(string) {
        this.string = string;
        this.cursor = 0;
    }
    getString() {
        return this.string;
    }
    setCursor(cursor) {
        this.cursor = cursor;
    }
    getRemainingLength() {
        return this.string.length - this.cursor;
    }
    getTotalLength() {
        return this.string.length;
    }
    getCursor() {
        return this.cursor;
    }
    getRead() {
        return this.string.substring(0, this.cursor);
    }
    getRemaining() {
        return this.string.substring(this.cursor);
    }
    canRead(length) {
        if (length) {
            return this.cursor + length <= this.string.length;
        }
        return this.cursor + 1 <= this.string.length;
    }
    peek(offset) {
        if (offset) {
            return this.string.charAt(this.cursor + offset);
        }
        return this.string.charAt(this.cursor);
    }
    read() {
        return this.string.charAt(this.cursor++);
    }
    skip() {
        this.cursor++;
    }
    skipWhitespace() {
        while (this.canRead() && StringReader.#isWhitespace(this.peek())) {
            this.skip();
        }
    }
    readInt() {
        const start = this.cursor;
        while (this.canRead() && StringReader.#isAllowedNumber(this.peek())) {
            this.skip();
        }
        const number = parseInt(this.string.substring(start, this.cursor));
        if (!number) {
            this.cursor = start;
            throw new CommandSyntaxError("Invalid integer.");
        }
        return number;
    }
    readFloat() {
        const start = this.cursor;
        while (this.canRead() && StringReader.#isAllowedNumber(this.peek())) {
            this.skip();
        }
        const number = parseFloat(this.string.substring(start, this.cursor));
        if (!number) {
            this.cursor = start;
            throw new CommandSyntaxError("Invalid float.");
        }
        return number;
    }
    readUnquotedString() {
        const start = this.cursor;
        while (this.canRead() && StringReader.#isAllowedInUnquotedString(this.peek())) {
            this.skip();
        }
        return this.string.substring(start, this.cursor);
    }
    readQuotedString() {
        if (!this.canRead()) {
            return "";
        }
        const next = this.peek();
        if (!StringReader.#isQuotedStringStart(next)) {
            throw new CommandSyntaxError("Expected an opening quote.");
        }
        this.skip();
        return this.readStringUntil(next);
    }
    readStringUntil(terminator) {
        let result = "";
        let escaped = false;
        while (this.canRead()) {
            const char = this.read();
            if (escaped) {
                if (char === terminator || char === StringReader.#SYNTAX_ESCAPE) {
                    result += char;
                    escaped = false;
                }
                else {
                    this.setCursor(this.getCursor() - 1);
                    throw new CommandSyntaxError(this.string);
                }
            }
            else if (char === StringReader.#SYNTAX_ESCAPE) {
                escaped = true;
            }
            else if (char === terminator) {
                return result;
            }
            else {
                result += char;
            }
        }
        throw new CommandSyntaxError("Couldn't read string.");
    }
    readString() {
        if (!this.canRead()) {
            return "";
        }
        const next = this.peek();
        if (StringReader.#isQuotedStringStart(next)) {
            this.skip();
            return this.readStringUntil(next);
        }
        return this.readUnquotedString();
    }
    readBoolean() {
        const start = this.cursor;
        const value = this.readString();
        if (!value) {
            throw new CommandSyntaxError(this.string);
        }
        if (value === "true") {
            return true;
        }
        else if (value === "false") {
            return false;
        }
        else {
            this.cursor = start;
            throw new CommandSyntaxError(`Invalid boolean '${value}'.`);
        }
    }
    expect(char) {
        if (!this.canRead() || this.peek() !== char) {
            throw new CommandSyntaxError(`Expected '${char}'.`);
        }
        this.skip();
    }
}
