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
        return s.hashSync(e, 15);
    }
    compare(e, t) {
        return s.compareSync(e, t);
    }
}, p = d.json("./admins.json").admins, y = d.json("./database.json"), g = d.json("./worlds.json"), m = new o, b = m.Story("Circuit MUD");

b.editBody([ "Welcome to Circuit MUD", "Please login with command: login <username> <password> | or create using: create <username> <password>", 'Type "help" for commands' ]);

let w = m.Story("Help Menu");

w.editBody([ "Command Categories are as follows: ", "Pathways", "Communication", "Hobbies" ]);

let $ = m.Category("Pathways"), j = m.Category("Communication"), x = m.Category("Hobbies"), S = m.Hobby("Mining"), v = m.Action("mine", "mines things around you");

v.addLife((...e) => {
    let t = y.users.find(t => t.username == e[0][0]), r = (t.tools.pickaxe.level, function(e) {
        let t;
        return g[T(e).currentWorld].map.forEach(r => {
            r.forEach(r => {
                r.pos.x == T(e).pos.x && r.pos.y == T(e).pos.y && (t = r);
            });
        }), t;
    }(t.username)), s = [];
    Object.keys(r.resources).forEach(e => {
        s.push(e);
    }), s.forEach(s => {
        if (t.ores.find(e => e.name == s).hardness <= t.tools.pickaxe.level && r.resources.hasOwnProperty(s) && r.resources[s].count > 0) {
            let n = Math.floor(2 * Math.random());
            r.resources[s].count - n > 0 && (t.ores.find(e => e.name == s).count += n, r.resources[s].count -= n, 
            n > 0 && E(e[0][1], `You have obtained ${s}`));
        }
    });
}), S.addAction(v);

// Crafting
let M = m.Hobby("Crafting"), k = m.Hobby("Fighting");

// Fighting
$.addParts([ "exit - Exit's the connection", "logout - Logs out of the server" ]), 
j.addParts([ "say - speaks to other players", "whisper - whispers to another player privately" ]), 
x.addParts([ "Type help <hobby> for commands on hobby" ]), x.addHobbies([ S, M, k ]);

let C = [];

function E(e, t) {
    try {
        e.write(t + "\n");
    } catch (e) {}
}

function O(e, t) {
    if (t) switch (t.option) {
      case "world":
        C.forEach(r => {
            if (r.world == t.world) try {
                r.client.write(e + "\n");
            } catch (e) {}
            U(e + "\n");
        });
    } else C.forEach(t => {
        t = t.client;
        try {
            t.write(e + "\n");
        } catch (e) {}
    }), U(e + "\n");
}

function U(e) {
    r.appendFile("./logs.txt", e + "\n", () => {
        console.log(`Logged data => ${e}`);
    });
}

function A() {
    var e = new Date, t = Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds());
    return new Date(t).toISOString();
}

function W() {
    r.writeFile("./database.json", JSON.stringify(y, null, 4), () => {}), r.writeFile("./worlds.json", JSON.stringify(g, null, 4), () => {});
}

// Autosave
function T(e) {
    return y.users.find(t => t.username == e);
}

t.createServer(e => {
    let t, s = "", n = !1;
    E(e, b.create()), e.on("end", () => {
        if (t) {
            for (let e = 0; e < C.length; e++) {
                C[e].username == t && C.splice(e, 1);
            }
            O(`[${t}] has left the server. ${C.length} users remaining`);
        }
    }), e.on("error", e => {
        console.log(e);
    }), e.on("data", a => {
        if (/[\n\r]$/.test(a)) {
            let a, i = [];
            if (s.split(" ").forEach((e, t) => {
                0 == t ? a = e : i.push(e.split(/[\n\r\b]$/).join(""));
            }), 1 == n && function(e) {
                return !!p.find(t => t == e);
            }(t)) switch (a) {
              case "save":
                W(), O("Game has been saved. ");
            }
            if (0 == n) switch (a) {
              case "login":
                if (y.users.find(e => e.username == i[0])) for (let r = 0; r < y.users.length; r++) if (f.compare(i[1], y.users[r].password)) {
                    n = !0, t = i[0];
                    let r = m.Story("Logged in");
                    r.editBody([ "Username: " + i[0] ]), E(e, r.create()), C.find(e => e.username == t) || C.push({
                        username: i[0],
                        client: e,
                        world: T(i[0]).currentWorld
                    }), O(`User [${t}] has connected to the server! \n${C.length} users are online | ${A()}`);
                }
                break;

              case "create":
                if (y.users.find(e => e.username == i[0])) E(e, "That user exists"); else {
                    let s = {
                        username: i[0],
                        password: f.encrypt(i[1]),
                        ores: [ {
                            name: "coal",
                            count: 0,
                            rarity: 1 / 34,
                            hardness: 1
                        }, {
                            name: "iron",
                            count: 0,
                            rarity: 1 / 72,
                            hardness: 3
                        }, {
                            name: "gold",
                            count: 0,
                            rarity: 1 / 5465,
                            hardness: 2
                        }, {
                            name: "titanium",
                            count: 0,
                            rarity: 1 / 347,
                            hardness: 4
                        }, {
                            name: "uranium",
                            count: 0,
                            rarity: 1 / 529,
                            hardness: 4
                        }, {
                            name: "copper",
                            count: 0,
                            rarity: 1 / 259,
                            hardness: 1
                        }, {
                            name: "aluminium",
                            count: 0,
                            rarity: 1 / 77,
                            hardness: 3
                        }, {
                            name: "tin",
                            count: 0,
                            rarity: 1 / 741,
                            hardness: 1
                        }, {
                            name: "silver",
                            count: 0,
                            rarity: 1 / 17,
                            hardness: 2
                        }, {
                            name: "lead",
                            count: 0,
                            rarity: 1 / 84,
                            hardness: 2
                        }, {
                            name: "zinc",
                            count: 0,
                            rarity: 1 / 101,
                            hardness: 2
                        }, {
                            name: "platinum",
                            count: 0,
                            rarity: 1 / 962,
                            hardness: 4
                        }, {
                            name: "palladium",
                            count: 0,
                            rarity: 1 / 2329,
                            hardness: 5
                        }, {
                            name: "nickel",
                            count: 0,
                            rarity: 1 / 590,
                            hardness: 2
                        } ],
                        lastMined: Date.now(),
                        tools: {
                            pickaxe: {
                                level: 1
                            },
                            axe: {
                                level: 1
                            },
                            hoe: {
                                level: 1
                            },
                            spade: {
                                level: 1
                            }
                        },
                        weapons: {
                            shotgun: 0,
                            sniper: 0,
                            dagger: 0,
                            rifle: 0,
                            spear: 0,
                            bow: 0,
                            pistol: 0,
                            grenadeLauncher: 0,
                            grenade: 0,
                            crossbow: 0,
                            knife: 0,
                            handGun: 0,
                            assaultRifle: 0,
                            boomerang: 0,
                            uzi: 0,
                            javelin: 0,
                            flameThrower: 0,
                            "long Bow": 0,
                            dart: 0,
                            throwingKnife: 0
                        },
                        liquids: {
                            magma: 0,
                            plasma: 0,
                            water: 0,
                            acid: 0,
                            gas: 0,
                            oil: 0,
                            blood: 0,
                            bromine: 0
                        },
                        currentWorld: "Cyber City",
                        pos: {
                            x: 5,
                            y: 0
                        }
                    };
                    y.users.push(s), r.writeFile("./database.json", JSON.stringify(y, 4, null), () => {});
                    let o = m.Story("Created User");
                    o.editBody([ "Username: " + s.username, "Password: " + s.password ]), E(e, o.create()), 
                    n = !0, t = i[0], C.find(e => e.username == t) || C.push({
                        username: i[0],
                        client: e,
                        world: "main"
                    }), O(`[${t}] has connected to the server for the first time! Please welcome them! \n${C.length} users are online | ${A()}`);
                }
                break;

              case "exit":
                e.end();
            } else switch (U(`${t} executed: ${a}:${i.join(" ")}`), a) {
              case "exit":
                e.end();
                break;

              case "help":
                E(e, i ? w.create(m, i) : w.create());
                break;

              case "joinWorld":
                for (let e of Object.keys(g)) if (e == i.join(" ")) {
                    g[e].map.forEach(e => {
                        e.forEach(e => {
                            e.pos.x == T(t).pos.x && e.pos.y == T(t).pos.y && (O(`${T(t).username} has left ${T(t).currentWorld}`, {
                                option: "world",
                                world: T(t).currentWorld
                            }), T(t).currentWorld = i.join(" "), C.find(e => e.username == t).world = i.join(" "), 
                            O(`${T(t).username} has joined ${T(t).currentWorld}`, {
                                option: "world",
                                world: T(t).currentWorld
                            }));
                        });
                    });
                }
                break;

              case "logout":
                n = !1, t = null, E(e, "Logged out successfully!");
                break;

              case "say":
                O(`{${T(t).currentWorld}} [${t}]: ${i.join(" ")} | ${A()}`, {
                    option: "world",
                    world: T(t).currentWorld
                }), U(`Message Sent: {${T(t).currentWorld}} [${t}]: ${i.join(" ")} | ${A()}`);
                break;

              case "announce":
                O(`Announcement > [${t}]: ${i.join(" ")} | ${A()}`), U(`Message Announced: [${t}]: ${i.join(" ")} | ${A()}`);
                break;

              case "mine":
                Date.now() - T(t).lastMined >= 5e3 ? (v.execute(t, e), T(t).lastMined = Date.now()) : E(e, "You can't mine right now, please wait " + Math.floor((5e3 - (Date.now() - T(t).lastMined)) / 1e3) + " seconds");
                break;

              case "stats":
                let r = m.Story("Stats");
                r.editBody(function(e, t, r) {
                    let s = [], n = [];
                    return Object.keys(e).forEach(e => {
                        s.push(e);
                    }), s.forEach(s => {
                        r ? n.push(`${e[s][r]} | ${t}: ${e[s][t]}`) : n.push(`${s} | ${t}: ${e[s][t]}`);
                    }), n;
                }(T(t).ores, "count", "name")), E(e, r.create());
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
                let l = T(t).pos;
                l.x + s >= 0 && l.x + s < 10 && (l.y += s), l.y + a >= 0 && l.y + a < 10 && (l.y += a), 
                W();
                break;

              case "online":
                if (i) {
                    let r;
                    switch (i[0]) {
                      case "server":
                        r = m.Story("Online users in Server"), r.editBody([ `Total Users: ${C.length}` ].concat(C.map(e => e.username))), 
                        E(e, r.create());
                        break;

                      case "world":
                        r = m.Story("Online users in World");
                        let s = [];
                        C.forEach(e => {
                            e.world == T(t).currentWorld && s.push(e.username);
                        }), r.editBody([ `Total Users: ${s.length}` ].concat(s)), E(e, r.create());
                    }
                } else {
                    let t = o.Story("Online users in Server");
                    t.editBody([ `Total Users: ${C.length}` ].concat(C)), E(e, t.create());
                }
            }
            s = "";
        } else "\b" == a ? s = s.substr(0, s.length - 1) : s += a;
    });
}).listen(4922), setInterval(() => {
    r.writeFile("./database.json", JSON.stringify(y, null, 4), () => {}), r.writeFile("./worlds.json", JSON.stringify(g, null, 4), () => {}), 
    O("Game has been saved!");
}, 3e5), setInterval(() => {
    for (let e of Object.keys(g)) {
        let t = g[e];
        t.map.forEach(e => {
            e.forEach(e => {
                Object.values(e.resources).forEach(e => {
                    e.count += Math.floor(10 * Math.random());
                });
            });
        }), O(`${e} has been regenerated! Start finding ore!`, {
            option: "world",
            world: t
        });
    }
    W();
}, 149400);
