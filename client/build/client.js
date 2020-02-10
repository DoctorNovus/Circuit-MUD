"use strict";

var t = require("net");

let e = (new class {
    constructor() {
        this.events = {};
    }
    on(t, e) {
        this.events[t] = e;
    }
    send(t) {
        this.socket.write(t + "\r\n");
    }
    connect(e, s, n) {
        if (!this.events.data) throw new Error("Missing data event binding!");
        if (!this.events.close) throw new Error("Missing close event binding!");
        if (!this.events.error) throw new Error("Missing error event binding!");
        this.socket = new t.Socket, this.socket.on("data", t => {
            this.events.data(t);
        }), this.socket.on("close", () => {
            this.events.close();
        }), this.socket.on("error", t => {
            this.events.error(t);
        }), n ? this.socket.connect(s, e, n) : this.socket.connect(s, e);
    }
}).connect("localhost", 23);

e.on("data", t => {
    t = Buffer.from(t, "utf-8").toString(), console.log(t);
}), process.openStdin().addListener("data", (function(t) {
    e.write(t.toString().trim());
}));
