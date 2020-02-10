"use strict";

var t = require("net");

let e = new class {
    constructor() {
        this.events = {};
    }
    on(t, e) {
        this.events[t] = e;
    }
    send(t) {
        this.socket.write(t + "\r\n");
    }
    connect(e, n, s) {
        if (!this.events.data) throw new Error("Missing data event binding!");
        if (!this.events.close) throw new Error("Missing close event binding!");
        if (!this.events.error) throw new Error("Missing error event binding!");
        return this.socket = new t.Socket, this.socket.on("data", t => {
            this.events.data(t);
        }), this.socket.on("close", () => {
            this.events.close();
        }), this.socket.on("error", t => {
            this.events.error(t);
        }), s ? this.socket.connect(n, e, s) : this.socket.connect(n, e);
    }
};

e.on("data", t => {
    t = Buffer.from(t, "utf-8").toString(), console.log(t);
}), e.on("close", () => {}), e.on("error", t => {
    if (t) throw t;
});

let n = e.connect("localhost", 23);

process.openStdin().addListener("data", (function(t) {
    n.write(t.toString().trim() + "\r\n");
}));
