const { Story } = require("./circuit-string");
const telnet = require("telnet");
let database = require("./database.json");
const fs = require("fs");

let main = new Story();
main.editTitle("Circuit MUD");
main.editBody(["Welcome to Circuit MUD", "Please login with command: login <username> <password> | or create using: create <username> <password>", "Type \"help\" for commands"])

let help = new Story();
help.editTitle("Help Menu");
help.editBody(["Commands are as follows: ", "exit - Exits the connection", "help - Displays the help menu", "logout - Logs out of the current user", "say - speaks to other players"]);

let clients = [];

telnet.createServer((client) => {
    let message = "";
    let loggedIn = false;
    let username;
    let currentWorld = "main";

    send(client, main.create());

    for (let i = 0; i < clients.length; i++) {
        let cl = clients[i];

        if (cl.username == username) {
            clients.splice(i, 1);
        }
    }

    client.on("error", (err) => {
        console.log(err);
    });

    client.on("data", (data) => {
        // make unicode characters work properly
        // client.do.transmit_binary();

        if (/[\n\r]$/.test(data)) {
            let command;
            let args = [];
            message.split(" ").forEach((part, index) => {
                if (index == 0) {
                    command = part;
                } else {
                    args.push(part.split(/[\n\r\b]$/).join(""));
                };
            });

            if (loggedIn == false) {
                switch (command) {
                    case "login":
                        if (database.users.find(user => user.username == args[0] && user.password == args[1])) {
                            loggedIn = true;
                            username = args[0];
                            let loggedInStory = new Story();
                            loggedInStory.editTitle("Logged In");
                            loggedInStory.editBody(["Username: " + args[0]]);
                            send(client, loggedInStory.create());
                            clients.push({ "username": args[0], "client": client, "world": "main" });
                            sendAll(`User [${username}] has connected to the server! \n${clients.length} users are online | ${getDate()}`);
                        } else {
                            send(client, "Sorry. Your credentials are incorrect. Please try again")
                        }
                        break;

                    case "create":
                        if (database.users.find((user) => user.username == args[0])) {
                            send(client, "That user exists");
                        } else {
                            database.users.push({ "username": args[0], "password": args[1] });
                            fs.writeFile("./database.json", JSON.stringify(database), () => {

                            });
                            let createdUser = new Story();
                            createdUser.editTitle("Created User");
                            createdUser.editBody(["Username: " + args[0], "Password: " + args[1]]);
                            send(client, createdUser.create());
                            loggedIn = true;
                            username = args[0];
                            clients.push({ "username": args[0], "client": client, "world": "main" });
                            sendAll(`[${username}] has connected to the server for the first time! Please welcome them! \n${clients.length} users are online | ${getDate()}`);
                        }

                    case "exit":
                        sendAll(`[${username}] has left the server. ${clients.length - 1} users remaining`);
                        client.end();
                        break;
                };
            } else {

                logNetwork(`${username} executed: ${command}:${args.join(" ")}`);

                switch (command) {
                    case "exit":
                        sendAll(`[${username}] has left the server. ${clients.length - 1} users remaining`);
                        client.end();
                        break;

                    case "help":
                        send(client, help.create());
                        break;

                    case "joinWorld":
                        for(let client of clients){
                            if(client.world == currentWorld){
                                send(client.client, `${username} has just left the world.`);
                            }
                        }
                        currentWorld = args[0];
                        for(let i = 0; i < clients.length; i++){
                            if(clients[i].username == username){
                                clients[i].world = currentWorld;
                            }
                        }
                        send(client, `Joining World: ${currentWorld}`);
                        for(let client of clients){
                            if(client.world == currentWorld){
                                send(client.client, `${username} has just joined the world.`);
                            }
                        }
                        break;

                    case "logout":
                        loggedIn = false;
                        username = null;
                        send(client, "Logged out successfully!");
                        break;

                    case "say":
                        sendAll(`{${currentWorld}} [${username}]: ${args.join(" ")} | ${getDate()}`, { "option": "world", "world": currentWorld });
                        logNetwork(`Message Sent: {${currentWorld}} [${username}]: ${args.join(" ")} | ${getDate()}`);
                        break;

                    case "announce":
                        sendAll(`Announcement > [${username}]: ${args.join(" ")} | ${getDate()}`);
                        logNetwork(`Message Announced: [${username}]: ${args.join(" ")} | ${getDate()}`);


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
    try{
        client.write(data + "\n");
    } catch(err) {

    }
}

function sendAll(data, options) {
    if (!options) {
        clients.forEach((client) => {
            client = client.client;
            try{
            client.write(data + "\n");
            } catch(err) {

            }
        })

        logNetwork(data + "\n");
    } else {
        switch (options.option) {
            case "world":
                clients.forEach(client => {
                    if (client.world == options.world) {
                        try{
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