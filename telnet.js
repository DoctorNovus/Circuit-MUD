import { Server, Socket } from "net";

export class TelnetServer {

    constructor() {
        this.events = {};
    }

    on(event, callback) {
        this.events[event] = callback;
    }

    listen(port, callback) {

        if (!this.events["connect"]) { throw new Error("Missing connect event binding!"); }
        if (!this.events["data"]) { throw new Error("Missing data event binding!"); }
        if (!this.events["error"]) { throw new Error("Missing error event binding!"); }

        this.server = new Server((socket) => {
            socket.on("connect", () => {
                this.events["connect"](socket);
            });

            socket.on("data", (data) => {
                this.events["data"](socket, data);
            });

            socket.on("error", (error) => {
                this.events["error"](socket, error);
            });
        });

        if (callback) { this.server.listen(port, callback); } else { this.server.listen(port); }
    }
}

export class TelnetClient {

    constructor() {
        this.events = {};
    }

    on(event, callback) {
        this.events[event] = callback;
    }

    send(data) {
        this.socket.write(data + "\r\n");
    }

    connect(host, port, callback) {

        if (!this.events["data"]) { throw new Error("Missing data event binding!"); }
        if (!this.events["close"]) { throw new Error("Missing close event binding!"); }
        if (!this.events["error"]) { throw new Error("Missing error event binding!"); }

        this.socket = new Socket();

        this.socket.on("data", (data) => {
            this.events["data"](data);
        });
        this.socket.on("close", () => {
            this.events["close"]();
        });
        this.socket.on("error", (error) => {
            this.events["error"](error);
        });

        if (callback) { this.socket.connect(port, host, callback); } else { this.socket.connect(port, host); }
    }
}