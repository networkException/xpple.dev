import {CommandSyntaxError} from "../errors/command-syntax-error.js";

export class StringReader {

    static #SYNTAX_ESCAPE = '\\';
    static #SYNTAX_DOUBLE_QUOTE = '"';
    static #SYNTAX_SINGLE_QUOTE = '\'';

    static #isAllowedNumber(char: string): boolean {
        return char >= '0' && char <= '9' || char === '.' || char === '-';
    }

    static #isQuotedStringStart(char: string): boolean {
        return char === StringReader.#SYNTAX_DOUBLE_QUOTE || char === StringReader.#SYNTAX_SINGLE_QUOTE;
    }

    static #isWhitespace(char: string): boolean {
        return char === ' ' || char === '\t';
    }

    static #isAllowedInUnquotedString(char: string): boolean {
        return char >= '0' && char <= '9'
            || char >= 'A' && char <= 'Z'
            || char >= 'a' && char <= 'z'
            || char === '_' || char === '-'
            || char === '.' || char === '+';
    }

    public cursor: number;

    public constructor(public string: string) {
        this.cursor = 0;
    }

    public getString(): string {
        return this.string;
    }

    public setCursor(cursor: number) {
        this.cursor = cursor;
    }

    public getRemainingLength(): number {
        return this.string.length - this.cursor;
    }

    public getTotalLength(): number {
        return this.string.length;
    }

    public getCursor(): number {
        return this.cursor;
    }

    public getRead(): string {
        return this.string.substring(0, this.cursor);
    }

    public getRemaining(): string {
        return this.string.substring(this.cursor);
    }

    public canRead(length?: number): boolean {
        if (length) {
            return this.cursor + length <= this.string.length;
        }
        return this.cursor + 1 <= this.string.length;
    }

    public peek(offset?: number): string {
        if (offset) {
            return this.string.charAt(this.cursor + offset);
        }
        return this.string.charAt(this.cursor);
    }

    public read(): string {
        return this.string.charAt(this.cursor++);
    }

    public skip(): void {
        this.cursor++;
    }

    public skipWhitespace(): void {
        while (this.canRead() && StringReader.#isWhitespace(this.peek())) {
            this.skip();
        }
    }

    public readInt(): number {
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

    public readFloat(): number {
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

    public readUnquotedString(): string {
        const start = this.cursor;
        while (this.canRead() && StringReader.#isAllowedInUnquotedString(this.peek())) {
            this.skip();
        }
        return this.string.substring(start, this.cursor);
    }

    public readQuotedString(): string {
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

    public readStringUntil(terminator: string): string {
        let result = "";
        let escaped = false;
        while (this.canRead()) {
            const char = this.read();
            if (escaped) {
                if (char === terminator || char === StringReader.#SYNTAX_ESCAPE) {
                    result += char;
                    escaped = false;
                } else {
                    this.setCursor(this.getCursor() - 1);
                    throw new CommandSyntaxError(this.string);
                }
            } else if (char === StringReader.#SYNTAX_ESCAPE) {
                escaped = true;
            } else if (char === terminator) {
                return result;
            } else {
                result += char;
            }
        }
        throw new CommandSyntaxError("Couldn't read string.");
    }

    public readString(): string {
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

    public readBoolean(): boolean {
        const start = this.cursor;
        const value = this.readString();
        if (!value) {
            throw new CommandSyntaxError(this.string);
        }
        if (value === "true") {
            return true;
        } else if (value === "false") {
            return false;
        } else {
            this.cursor = start;
            throw new CommandSyntaxError(`Invalid boolean '${value}'.`);
        }
    }

    public expect(char: string): void {
        if (!this.canRead() || this.peek() !== char) {
            throw new CommandSyntaxError(`Expected '${char}'.`);
        }
        this.skip();
    }
}
