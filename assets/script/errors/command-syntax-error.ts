export class CommandSyntaxError extends Error {

    public constructor(message: string) {
        super(message);
    }

    public getName(): string {
        return "CommandSyntaxError";
    }
}
