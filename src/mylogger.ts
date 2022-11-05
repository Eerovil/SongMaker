const printChildMessages = (childLogger: Logger) => {
    for (const child of childLogger.children) {
        console.groupCollapsed(...child.title);
        printChildMessages(child);
        for (const message of child.messages) {
            console.log(...message);
        }
        console.groupEnd();
    }
}

export class Logger {
    title: any[] = [];
    messages: Array<any[]> = [];
    parent: Logger | undefined = undefined;
    children: Logger[] = [];

    constructor(parent: Logger | undefined = undefined) {
        this.parent = parent;
        if (parent) {
            parent.children.push(this);
        }
    }

    log(...args: any[]) {
        this.messages.push(args);
    }

    print(...args: any[]) {
        if (this.parent) {
            // Let parent handle me
            if (args.length > 0) {
                this.title = args;
            }
            return;
        }
        console.groupCollapsed(...args)
        // This is the top logger. Print everything.
        printChildMessages(this);
        for (let i = 0; i < this.messages.length; i++) {
            console.log(...this.messages[i]);
        }
        console.groupEnd();
    }
}
