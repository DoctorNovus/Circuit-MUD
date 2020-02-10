"use strict";

function e(e) {
    return e && "object" == typeof e && "default" in e ? e.default : e;
}

var t = e(require("telnet")), r = e(require("fs")), s = e(require("bcrypt"));

function n(e, t) {
    let r = e;
    if (t.includes("\n")) t.split("\n").forEach(e => {
        let s = 0;
        for (let t = 0; t < Math.ceil(e.length / 60); t++) s++;
        for (let n = 0; n < Math.ceil(e.length / 60) + s; n++) {
            let s = 0;
            Math.floor((60 - t.substr(0, 60).length) % 2 == 0) || (s = 1), r += "|" + " ".repeat(Math.floor((60 - e.substr(0, 60).length) / 2 - s)) + e.substr(0, 60) + " ".repeat(Math.floor((60 - e.substr(0, 60).length) / 2 - s)) + "|\n", 
            e = e.substr(60, e.length);
        }
    }); else {
        console.log(t);
        let e = 0;
        for (let r = 0; r < Math.ceil(t.length / 60); r++) e++;
        for (let s = 0; s < Math.ceil(t.length / 60) + e; s++) {
            let e = 0;
            Math.floor((60 - t.substr(0, 60).length) / 2) % 2 != 0 && (e = 1), r += "|" + " ".repeat(Math.floor((60 - t.substr(0, 60).length) / 2)) + t.substr(0, 60) + " ".repeat(Math.floor((60 - t.substr(0, 60).length) / 2 - e)) + "|\n", 
            t = t.substr(60, t.length);
        }
    }
    return r;
}

class o {
    constructor() {
        this.stories = [], this.categories = [], this.hobbies = [], this.entities = [];
    }
    Story(e) {
        let t = new i(e);
        return this.stories.push(t), t;
    }
    Category(e) {
        let t = new l(e);
        return this.categories.push(t), t;
    }
    Hobby(e) {
        let t = new c(e);
        return this.categories.push(t), t;
    }
    Action(e, t) {
        return new u(e, t);
    }
    Item(e) {
        return new h(e);
    }
}

class a {
    constructor(e) {
        this.title = e, this.body = "", this.author = "", this.footer = "";
    }
}

class i extends a {
    constructor(e) {
        super(e);
    }
    editBody(e) {
        this.body = "", Array.isArray(e) && (this.body = e.join("\n"));
    }
    create(e, t) {
        if (t && null != e.categories.find(e => e.title == t)) {
            this.body = "";
            let r = e.categories.find(e => e.title == t);
            try {
                for (let e of r.parts) null != e && (this.body += e.text + "\n");
            } catch (e) {
                for (let e of r.actions) null != e && (this.body += e.name + "-" + e.description + "\n");
            }
        }
        let r = "";
        return r += "-".repeat(61) + "\n", r += "|" + " ".repeat((60 - this.title.length) / 2) + this.title + " ".repeat((60 - this.title.length) / 2) + "|\n", 
        r += "-".repeat(61) + "\n", r = n(r, this.body), r += "-".repeat(61) + "\n", r;
    }
}

class l extends a {
    constructor(e) {
        super(e), this.parts = [];
    }
    addParts(e) {
        if (Array.isArray(e)) for (let t = 0; t < e.length; t++) {
            let r = {
                text: e[t]
            };
            this.parts.push(r);
        } else {
            let t = {
                text: e
            };
            this.parts.push(t);
        }
    }
    removeParts(e) {
        if (Array.isArray(e)) for (let t = 0; t < e.length; t++) for (let r = 0; r < this.parts.length; r++) this.parts[r].id == e[t] && this.parts.splice(r, 1); else for (let t = 0; t < this.parts.length; t++) this.parts[t].id == e && this.parts.splice(t, 1);
    }
    addHobbies(e) {
        if (Array.isArray(e)) for (let t = 0; t < e.length; t++) this.parts.push(e.title); else this.parts.push(e.title);
    }
    create(e, t) {
        if (t && null != e.categories.find(e => e.title == t)) {
            this.body = "";
            let r = e.categories.find(e => e.title == t);
            try {
                for (let e of r.parts) null != e && (this.body += e.text + "\n");
            } catch (e) {
                for (let e of r.actions) null != e && (this.body += e.name + "-" + e.description + "\n");
            }
        }
        let r = "";
        return r += "-".repeat(61) + "\n", r += "|" + " ".repeat((60 - this.title.length) / 2) + this.title + " ".repeat((60 - this.title.length) / 2) + "|\n", 
        r += "-".repeat(61) + "\n", r = n(r, this.body), r += "-".repeat(61) + "\n", r;
    }
}

class c extends a {
    constructor(e) {
        super(e), this.actions = [];
    }
    addAction(e) {
        this.actions.push(e);
    }
    executeAction(e) {
        this.actions.find(t => t.name == e).execute();
    }
}

class u {
    constructor(e, t) {
        this.name = e, this.description = t;
    }
    addLife(e) {
        this.code = e;
    }
    execute(...e) {
        e ? this.code(e) : this.code;
    }
}

class h {
    constructor(e) {
        this.name = e;
    }
}

let d = new class {
    file(e) {
        return r.readFileSync(e);
    }
    json(e) {
        return JSON.parse(r.readFileSync(e));
    }
}, f = new class {
    encrypt(e) {
        return s.hashSync(e, 7);
    }
    compare(e, t) {
        return s.compareSync(e, t);
    }
}, p = d.json("./admins.json").admins, y = d.json("./database.json"), g = d.json("./worlds.json"), b = d.json("./config.json").ores, m = new o, w = m.Story("Circuit MUD");

w.editBody([ "Welcome to Circuit MUD", "Please login with command: login <username> <password> | or create using: create <username> <password>", 'Type "help" for commands' ]);

let $ = m.Story("Help Menu");

$.editBody([ "Command Categories are as follows: ", "Pathways", "Communication", "Hobbies" ]);

let j = m.Category("Pathways"), x = m.Category("Communication"), S = m.Category("Hobbies"), M = m.Hobby("Mining"), k = m.Action("mine", "mines things around you");

k.addLife((...e) => {
    let t = y.users.find(t => t.username == e[0][0]), r = function(e) {
        let t;
        return g[P(e).currentWorld].map.forEach(r => {
            r.forEach(r => {
                r.pos.x == P(e).pos.x && r.pos.y == P(e).pos.y && (t = r);
            });
        }), t;
    }(t.username), s = [];
    Object.keys(r.resources).forEach(e => {
        s.push(e);
    }), s.forEach(s => {
        if (b[s].hardness <= t.tools.pickaxe && r.resources.hasOwnProperty(s) && r.resources[s].count > 0) {
            let n = Math.floor(2 * Math.random());
            r.resources[s].count - n > 0 && (t.ores[s] += n, r.resources[s].count -= n, n > 0 && O(e[0][1], `You have obtained ${s}`));
        }
    });
}), M.addAction(k);

// Crafting
let v = m.Hobby("Crafting"), C = m.Hobby("Fighting");

// Fighting
j.addParts([ "exit - Exit's the connection", "logout - Logs out of the server" ]), 
x.addParts([ "say - speaks to other players", "whisper - whispers to another player privately", "announce - speak to the whole server" ]), 
S.addParts([ "Type help <hobby> for commands on hobby" ]), S.addHobbies([ M, v, C ]);

let E = [];

function O(e, t) {
    try {
        e.write(t + "\r\n");
    } catch (e) {}
}

function U(e, t) {
    if (t) switch (t.option) {
      case "world":
        E.forEach(r => {
            if (r.world == t.world) try {
                r.client.write(e + "\n");
            } catch (e) {}
            A(e + "\n");
        });
    } else E.forEach(t => {
        t = t.client;
        try {
            t.write(e + "\r\n");
        } catch (e) {}
    }), A(e + "\n");
}

function A(e) {
    r.appendFile("./logs.txt", e + "\n", () => {
        console.log(`Logged data => ${e}`);
    });
}

function W() {
    var e = new Date, t = Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds());
    return new Date(t).toISOString();
}

function T() {
    r.writeFile("./database.json", JSON.stringify(y, null, 4), () => {}), r.writeFile("./worlds.json", JSON.stringify(g, null, 4), () => {});
}

// Autosave
function P(e) {
    return y.users.find(t => t.username == e);
}

t.createServer(e => {
    let t, s = "", n = !1;
    O(e, w.create()), e.on("end", () => {
        if (t) {
            for (let e = 0; e < E.length; e++) {
                E[e].username == t && E.splice(e, 1);
            }
            U(`[${t}] has left the server. ${E.length} users remaining`);
        }
    }), e.on("error", e => {
        console.log(e);
    }), e.on("data", a => {
        if ("\r\n" == (a = Buffer.from(a, "utf-8").toString()) || "\n" == a || "\r" == a) {
            let a;
            s.trim();
            let i = [];
            if (s.split(" ").forEach((e, t) => {
                0 == t ? a = e : i.push(e.replace(/(\r\n|\n|\r)/, " "));
            }), 1 == n && function(e) {
                return !!p.find(t => t == e);
            }(t)) switch (a) {
              case "save":
                T(), U("Game has been saved. ");
            }
            if (0 == n) switch (a) {
              case "login":
                if (y.users.find(e => e.username == i[0])) {
                    let r = 0;
                    for (let s = 0; s < y.users.length; s++) if (f.compare(i[1], y.users[s].password)) {
                        n = !0, t = i[0];
                        let r = m.Story("Logged in");
                        r.editBody([ "Username: " + i[0] ]), O(e, r.create()), E.find(e => e.username == t) || E.push({
                            username: i[0],
                            client: e,
                            world: P(i[0]).currentWorld
                        }), U(`User [${t}] has connected to the server! \n${E.length} users are online | ${W()}`);
                    } else r++;
                    r > 0 && O(e, "You have used the wrong credentials. Please try again. ");
                } else O(e, "That user does not exist. Please create an account. ");
                break;

              case "create":
                if (y.users.find(e => e.username == i[0])) O(e, "That user exists"); else {
                    let s = {
                        username: i[0],
                        password: f.encrypt(i[1]),
                        ores: {
                            coal: 0,
                            iron: 0,
                            gold: 0,
                            titanium: 0,
                            uranium: 0,
                            copper: 0,
                            aluminum: 0,
                            tin: 0,
                            silver: 0,
                            lead: 0,
                            zinc: 0,
                            platinum: 0,
                            palladium: 0,
                            nickel: 0
                        },
                        lastMined: Date.now(),
                        tools: {
                            pickaxe: 1,
                            axe: 1,
                            hoe: 1,
                            spade: 1
                        },
                        currentWorld: "Cyber City",
                        pos: {
                            x: 5,
                            y: 0
                        }
                    };
                    y.users.push(s), r.writeFile("./database.json", JSON.stringify(y, 4, null), () => {});
                    let o = m.Story("Created User");
                    o.editBody([ "Username: " + s.username, "Password: " + s.password ]), O(e, o.create()), 
                    n = !0, t = i[0], E.find(e => e.username == t) || E.push({
                        username: i[0],
                        client: e,
                        world: "main"
                    }), U(`[${t}] has connected to the server for the first time! Please welcome them! \n${E.length} users are online | ${W()}`);
                }

              case "exit":
                e.end();
            } else switch (A(`${t} executed: ${a}:${i.join(" ")}`), a) {
              case "exit":
                e.end();
                break;

              case "help":
                O(e, i ? $.create(m, i) : $.create());
                break;

              case "joinWorld":
                for (let e of Object.keys(g)) if (e == i.join(" ")) {
                    g[e].map.forEach(e => {
                        e.forEach(e => {
                            e.pos.x == P(t).pos.x && e.pos.y == P(t).pos.y && (U(`${P(t).username} has left ${P(t).currentWorld}`, {
                                option: "world",
                                world: P(t).currentWorld
                            }), P(t).currentWorld = i.join(" "), E.find(e => e.username == t).world = i.join(" "), 
                            U(`${P(t).username} has joined ${P(t).currentWorld}`, {
                                option: "world",
                                world: P(t).currentWorld
                            }));
                        });
                    });
                }
                break;

              case "logout":
                n = !1, t = null, O(e, "Logged out successfully!");
                break;

              case "say":
                U(`{${P(t).currentWorld}} [${t}]: ${i.join(" ")} | ${W()}`, {
                    option: "world",
                    world: P(t).currentWorld
                }), A(`Message Sent: {${P(t).currentWorld}} [${t}]: ${i.join(" ")} | ${W()}`);
                break;

              case "announce":
                U(`Announcement > [${t}]: ${i.join(" ")} | ${W()}`), A(`Message Announced: [${t}]: ${i.join(" ")} | ${W()}`);
                break;

              case "mine":
                Date.now() - P(t).lastMined >= 5e3 ? (k.execute(t, e), P(t).lastMined = Date.now()) : O(e, "You can't mine right now, please wait " + Math.floor((5e3 - (Date.now() - P(t).lastMined)) / 1e3) + " seconds");
                break;

              case "stats":
                let r = m.Story("Stats");
                r.editBody(function(e, t, r) {
                    let s = [], n = [];
                    return Object.keys(e).forEach(e => {
                        s.push(e);
                    }), s.forEach(s => {
                        t ? r ? n.push(`${e[s][r]} | ${t}: ${e[s][t]}`) : n.push(`${s} | ${t}: ${e[s][t]}`) : r ? n.push(`${e[s][r]}: ${e[s]}`) : n.push(`${s}: ${e[s]}`);
                    }), n;
                }(P(t).ores)), O(e, r.create());
                break;

              case "go":
                let s, a;
                switch (i[0]) {
                  case "north":
                    a = -1;
                    break;

                  case "east":
                    s = 1;
                    break;

                  case "south":
                    a = 1;
                    break;

                  case "west":
                    s = -1;
                }
                let l = P(t).pos;
                l.x + s >= 0 && l.x + s < 10 && (l.y += s), l.y + a >= 0 && l.y + a < 10 && (l.y += a), 
                T();
                break;

              case "online":
                if (i) {
                    let r;
                    switch (i[0]) {
                      case "server":
                        r = m.Story("Online users in Server"), r.editBody([ `Total Users: ${E.length}` ].concat(E.map(e => e.username))), 
                        O(e, r.create());
                        break;

                      case "world":
                        r = m.Story("Online users in World");
                        let s = [];
                        E.forEach(e => {
                            e.world == P(t).currentWorld && s.push(e.username);
                        }), r.editBody([ `Total Users: ${s.length}` ].concat(s)), O(e, r.create());
                    }
                } else {
                    let t = o.Story("Online users in Server");
                    t.editBody([ `Total Users: ${E.length}` ].concat(E)), O(e, t.create());
                }
            }
            s = "";
        } else "\b" == a ? s = s.substr(0, s.length - 1) : s += a;
    });
}).listen(4922), setInterval(() => {
    r.writeFile("./database.json", JSON.stringify(y, null, 4), () => {}), r.writeFile("./worlds.json", JSON.stringify(g, null, 4), () => {}), 
    U("Game has been saved!");
}, 3e5), setInterval(() => {
    for (let e of Object.keys(g)) {
        let t = g[e];
        t.map.forEach(e => {
            e.forEach(e => {
                Object.values(e.resources).forEach(e => {
                    e.count += Math.floor(10 * Math.random());
                });
            });
        }), U(`${e} has been regenerated! Start finding ore!`, {
            option: "world",
            world: t
        });
    }
    T();
}, 149400);
