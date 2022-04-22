import { Directory } from "./directory";

export abstract class INode {
    public constructor(public name: string, public parent?: Directory) {
    }

    public getPath(): string {
        const parts = [];

        let directory: Directory | undefined;

        do {
            let currentINode: INode = directory ?? this;

            parts.push(currentINode.name);

            directory = currentINode.parent;
        } while (directory !== undefined && directory.isRoot())

        parts.reverse();

        return parts.join('/');
    }
}

