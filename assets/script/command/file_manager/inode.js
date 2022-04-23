export class INode {
    name;
    parent;
    constructor(name, parent) {
        this.name = name;
        this.parent = parent;
    }
    getPath() {
        const parts = [];
        let directory;
        do {
            let currentINode = directory ?? this;
            parts.push(currentINode.name);
            directory = currentINode.parent;
        } while (directory !== undefined);
        parts.reverse();
        return parts.join('/');
    }
}
