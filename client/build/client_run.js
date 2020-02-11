"use strict";

var e = require("net");

let t = new class {
    constructor() {
        this.events = {};
    }
    on(e, t) {
        this.events[e] = t;
    }
    send(e) {
        this.socket.write(e + "\r\n");
    }
    connect(t, n, s) {
        if (!this.events.data) throw new Error("Missing data event binding!");
        if (!this.events.close) throw new Error("Missing close event binding!");
        if (!this.events.error) throw new Error("Missing error event binding!");
        return this.socket = new e.Socket, this.socket.on("data", e => {
            this.events.data(e);
        }), this.socket.on("close", () => {
            this.events.close();
        }), this.socket.on("error", e => {
            this.events.error(e);
        }), s ? this.socket.connect(n, t, s) : this.socket.connect(n, t);
    }
};

process.argv.splice(2, process.argv.length);

t.on("data", e => {
    e = Buffer.from(e, "utf-8").toString(), console.log(e);
}), t.on("close", () => {}), t.on("error", e => {
    if (e) throw e;
});

let n = t.connect("ottegi.com", 4922);

n.write("joinGame"), process.openStdin().addListener("data", (function(e) {
    n.write(e.toString().trim() + "\r\n");
}));
