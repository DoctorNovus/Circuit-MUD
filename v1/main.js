import { Engine } from "./CircuitString";
import telnet from "telnet";
import fs from "fs";
import bcrypt from "bcrypt";

class Load {
    file(path) {
        return fs.readFileSync(path);
    };

    json(path) {
        return (JSON.parse(fs.readFileSync(path)));
    };
}

class Password {
    encrypt(pass) {
        let saltRounds = 7;

        return bcrypt.hashSync(pass, saltRounds);
    }

    compare(pass, dbPass) {
        return bcrypt.compareSync(pass, dbPass);
    }
}

let load = new Load();
let passw = new Password();

let admins = load.json("./admins.json").admins;
let database = load.json("./database.json");
let worlds = load.json("./worlds.json");
let config = load.json("./config.json");
let ores = config.ores;


let Circuit = new Engine();

let main = Circuit.Story("Circuit MUD");
main.editBody(["Welcome to Circuit MUD", "Please login with command: login <username> <password> | or create using: create <username> <password>", "Type \"help\" for commands"])

let help = Circuit.Story("Help Menu");
help.editBody(["Command Categories are as follows: ", "Pathways", "Communication", "Hobbies"]);

let Pathways = Circuit.Category("Pathways");
let Communication = Circuit.Category("Communication");
let Hobbies = Circuit.Category("Hobbies");

/* Hobbies */
// Mining
let Mining = Circuit.Hobby("Mining");
let mine = Circuit.Action("mine", "mines things around you");
mine.addLife((...args) => {
    let usere = database.users.find(user => user.username == args[0][0]);
    let str = `Gained the following ore: `;
    let secto = findSector(usere.username);
    let keys = [];
    Object.keys(secto.resources).forEach(key => {
        keys.push(key);
    });

    keys.forEach(key => {
        if ((ores[key].hardness <= usere.tools.pickaxe) && (secto.resources.hasOwnProperty(key))) {
            if (secto.resources[key].count > 0) {
                let countingBlocks = Math.floor(Math.random() * 2);
                if (secto.resources[key].count - countingBlocks > 0) {
                    usere.ores[key] += countingBlocks;
                    secto.resources[key].count -= countingBlocks;

                    if (countingBlocks > 0) {
                        send(args[0][1], `You have obtained ${key}`);
                    }
                }
            }
        }
    });
});

Mining.addAction(mine);

// Crafting
let Crafting = Circuit.Hobby("Crafting");

// Fighting
let Fighting = Circuit.Hobby("Fighting");


Pathways.addParts(["exit - Exit's the connection", "logout - Logs out of the server"]);
Communication.addParts(["say - speaks to other players", "whisper - whispers to another player privately", "announce - speak to the whole server"]);
Hobbies.addParts(["Type help <hobby> for commands on hobby"]);
Hobbies.addHobbies([Mining, Crafting, Fighting]);


let clients = [];

telnet.createServer((client) => {
    let message = "";
    let loggedIn = false;
    let username;

    send(client, main.create());

    client.on("end", () => {
        if (username) {
            for (let i = 0; i < clients.length; i++) {
                let cl = clients[i];

                if (cl.username == username) {
                    clients.splice(i, 1);
                }
            }

            sendAll(`[${username}] has left the server. ${clients.length} users remaining`);
        }
    })

    client.on("error", (err) => {
        console.log(err);
    });

    client.on("data", (data) => {
        data = Buffer.from(data, "utf-8").toString();
        if (data == "\r\n" || data == "\n" || data == "\r") {
            message.trim();
            let command;
            let args = [];
            message.split(" ").forEach((part, index) => {
                if (index == 0) {
                    command = part;
                } else {
                    args.push(part.replace(/(\r\n|\n|\r)/, " "));
                };
            });

            if (loggedIn == true && isAdmin(username)) {
                switch (command) {
                    case "save":
                        saveGame();
                        sendAll("Game has been saved. ");
                        break;
                }
            };

            if (loggedIn == false) {
                switch (command) {
                    case "login":
                        if (database.users.find((user) => user.username == args[0])) {
                            let counte = 0;
                            for (let i = 0; i < database.users.length; i++) {
                                if (passw.compare(args[1], database.users[i].password)) {
                                    loggedIn = true;
                                    username = args[0];
                                    let loggedInStory = Circuit.Story("Logged in");
                                    loggedInStory.editBody(["Username: " + args[0]]);
                                    send(client, loggedInStory.create());
                                    if (!clients.find(cliente => cliente.username == username)) {
                                        clients.push({ "username": args[0], "client": client, "world": getUser(args[0]).currentWorld });
                                    }
                                    sendAll(`User [${username}] has connected to the server! \n${clients.length} users are online | ${getDate()}`);
                                } else {
                                    counte++;
                                }
                            }

                            if (counte > 0) {
                                send(client, "You have used the wrong credentials. Please try again. ");
                            }
                        } else {
                            send(client, "That user does not exist. Please create an account. ");
                        }
                        break;

                    case "create":
                        if (database.users.find((user) => user.username == args[0])) {
                            send(client, "That user exists");
                        } else {
                            let user = {
                                "username": args[0],
                                "password": passw.encrypt(args[1]),
                                "ores": {
                                    "coal": 0,
                                    "iron": 0,
                                    "gold": 0,
                                    "titanium": 0,
                                    "uranium": 0,
                                    "copper": 0,
                                    "aluminum": 0,
                                    "tin": 0,
                                    "silver": 0,
                                    "lead": 0,
                                    "zinc": 0,
                                    "platinum": 0,
                                    "palladium": 0,
                                    "nickel": 0
                                },
                                "lastMined": Date.now(),
                                "tools": {
                                    "pickaxe": 1,
                                    "axe": 1,
                                    "hoe": 1,
                                    "spade": 1
                                },
                                "currentWorld": "Cyber City",
                                "pos": {
                                    "x": 5,
                                    "y": 0
                                }
                            };

                            database.users.push(user);
                            fs.writeFile("./database.json", JSON.stringify(database, 4, null), () => {

                            });
                            let createdUser = Circuit.Story("Created User");
                            createdUser.editBody(["Username: " + user.username, "Password: " + user.password]);

                            send(client, createdUser.create());
                            loggedIn = true;
                            username = args[0];
                            if (!clients.find(client => client.username == username)) {
                                clients.push({ "username": args[0], "client": client, "world": "main" });
                            }
                            sendAll(`[${username}] has connected to the server for the first time! Please welcome them! \n${clients.length} users are online | ${getDate()}`);
                        };

                    case "exit":
                        client.end();
                        break;
                };
            } else {

                logNetwork(`${username} executed: ${command}:${args.join(" ")}`);

                switch (command) {
                    case "exit":
                        client.end();
                        break;

                    case "help":
                        if (args) send(client, help.create(Circuit, args));
                        else send(client, help.create());
                        break;

                    case "joinWorld":
                        for (let key of Object.keys(worlds)) {
                            if (key == args.join(" ")) {
                                let world = worlds[key];
                                world.map.forEach(part => {
                                    part.forEach(sector => {
                                        if ((sector.pos.x == getUser(username).pos.x) && (sector.pos.y == getUser(username).pos.y)) {
                                            sendAll(`${getUser(username).username} has left ${getUser(username).currentWorld}`, { "option": "world", "world": getUser(username).currentWorld });
                                            getUser(username).currentWorld = args.join(" ");
                                            clients.find(client => client.username == username).world = args.join(" ");
                                            sendAll(`${getUser(username).username} has joined ${getUser(username).currentWorld}`, { "option": "world", "world": getUser(username).currentWorld });
                                        }
                                    });
                                });
                            }
                        }
                        break;

                    case "logout":
                        loggedIn = false;
                        username = null;
                        send(client, "Logged out successfully!");
                        break;

                    case "say":
                        sendAll(`{${getUser(username).currentWorld}} [${username}]: ${args.join(" ")} | ${getDate()}`, { "option": "world", "world": getUser(username).currentWorld });
                        logNetwork(`Message Sent: {${getUser(username).currentWorld}} [${username}]: ${args.join(" ")} | ${getDate()}`);
                        break;

                    case "announce":
                        sendAll(`Announcement > [${username}]: ${args.join(" ")} | ${getDate()}`);
                        logNetwork(`Message Announced: [${username}]: ${args.join(" ")} | ${getDate()}`);
                        break;

                    case "mine":
                        if (Date.now() - getUser(username).lastMined >= 5000) {
                            mine.execute(username, client);
                            getUser(username).lastMined = Date.now();
                        } else {
                            send(client, "You can't mine right now, please wait " + Math.floor((5000 - (Date.now() - getUser(username).lastMined)) / 1000) + " seconds");
                        }
                        break;

                    case "stats":
                        let stats = Circuit.Story("Stats");
                        stats.editBody(getKeyValuePair(getUser(username).ores));
                        send(client, stats.create());
                        break;

                    case "go":
                        let direction = args[0];
                        let velX;
                        let velY;
                        switch (direction) {
                            case "north":
                                velY = -1;
                                break;

                            case "east":
                                velX = 1;
                                break;

                            case "south":
                                velY = 1;
                                break;

                            case "west":
                                velX = -1;
                                break;
                        }
                        let pos = getUser(username).pos;

                        if ((pos.x + velX >= 0) && (pos.x + velX < 10)) {
                            pos.y += velX;
                        }

                        if ((pos.y + velY >= 0) && (pos.y + velY < 10)) {
                            pos.y += velY;
                        }

                        saveGame();

                        break;

                    case "online":
                        if (args) {
                            let bod;
                            switch (args[0]) {
                                case "server":
                                    bod = Circuit.Story("Online users in Server");
                                    bod.editBody([`Total Users: ${clients.length}`].concat(clients.map(clien => clien.username)));
                                    send(client, bod.create());
                                    break;

                                case "world":
                                    bod = Circuit.Story("Online users in World");
                                    let arr = [];

                                    clients.forEach(clien => {
                                        if (clien.world == getUser(username).currentWorld) {
                                            arr.push(clien.username);
                                        }
                                    })
                                    bod.editBody([`Total Users: ${arr.length}`].concat(arr));
                                    send(client, bod.create());
                                    break;
                            }
                        } else {
                            let bod = Engine.Story("Online users in Server");
                            bod.editBody([`Total Users: ${clients.length}`].concat(clients));
                            send(client, bod.create());
                        }
                        break;
                }
            }

            message = "";
        } else {
            if (data == "\b") {
                message = message.substr(0, message.length - 1);
            } else {
                message += data;
            }
        }
    });

}).listen(4922)

function send(client, data) {
    try {
        client.write(data + "\r\n");
    } catch (err) {

    }
}

function sendAll(data, options) {
    if (!options) {
        clients.forEach((client) => {
            client = client.client;
            try {
                client.write(data + "\r\n");
            } catch (err) {

            }
        })

        logNetwork(data + "\n");
    } else {
        switch (options.option) {
            case "world":
                clients.forEach(client => {
                    if (client.world == options.world) {
                        try {
                            client.client.write(data + "\n");
                        } catch (err) {

                        }
                    }

                    logNetwork(data + "\n");
                });
        }
    }
}

function logNetwork(data) {
    fs.appendFile("./logs.txt", data + "\n", () => {
        console.log(`Logged data => ${data}`);
    });
}

function getDate() {
    var date = new Date();
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    return new Date(now_utc).toISOString();
}

function saveGame() {
    fs.writeFile("./database.json", JSON.stringify(database, null, 4), () => {

    });

    fs.writeFile("./worlds.json", JSON.stringify(worlds, null, 4), () => {

    });
}

// Autosave
setInterval(() => {
    fs.writeFile("./database.json", JSON.stringify(database, null, 4), () => {

    });

    fs.writeFile("./worlds.json", JSON.stringify(worlds, null, 4), () => {

    });

    sendAll("Game has been saved!");
}, 1000 * 60 * 5);

function getUser(username) {
    return database.users.find(user => user.username == username);
}

function isAdmin(username) {
    if (admins.find(admin => admin == username)) return true;

    return false;
}

function probability(n) {
    return Math.random() <= n;
}

setInterval(() => {
    for (let key of Object.keys(worlds)) {
        let world = worlds[key];
        world.map.forEach(part => {
            part.forEach(sector => {
                Object.values(sector.resources).forEach(ore => {
                    ore.count += Math.floor(Math.random() * 10);
                })
            });
        })

        sendAll(`${key} has been regenerated! Start finding ore!`, { "option": "world", "world": world });
    }

    saveGame();

}, 1000 * 60 * 2.49);

function findSector(username) {
    let currentWorld = worlds[getUser(username).currentWorld];

    let sect;

    currentWorld.map.forEach(part => {
        part.forEach(sector => {
            if ((sector.pos.x == getUser(username).pos.x) && (sector.pos.y == getUser(username).pos.y)) {
                sect = sector;
            }
        });
    });

    return sect;
}

function getKeyValuePair(obje, val, keyVal) {
    let keys = [];
    let arr = [];

    Object.keys(obje).forEach(key => {
        keys.push(key);
    });

    keys.forEach(key => {
        if (val) {
            if (keyVal) {
                arr.push(`${obje[key][keyVal]} | ${val}: ${obje[key][val]}`);
            } else {
                arr.push(`${key} | ${val}: ${obje[key][val]}`);
            }
        } else {
            if (keyVal) {
                arr.push(`${obje[key][keyVal]}: ${obje[key]}`);
            } else {
                arr.push(`${key}: ${obje[key]}`);
            }
        }
    })

    return arr;
}