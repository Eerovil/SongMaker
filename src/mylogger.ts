export class Logger {
    messages: string[] = [];

    constructor() {}

    log(message: string) {
        this.messages.push(message);
    }

    print(message: string) {
        console.group(message)
        for (let i = 0; i < this.messages.length; i++) {
            console.log(this.messages[i]);
        }
        console.groupEnd();
    }
}
