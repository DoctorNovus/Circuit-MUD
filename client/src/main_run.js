import { TelnetClient } from "../../telnet";

let client = new TelnetClient();
let args = process.argv.splice(2, process.argv.length);

client.on("data", (data) => {
    data = Buffer.from(data, "utf-8").toString();
    console.log(data);
});

client.on("close", () => {});

client.on("error", (err) => {
    if (err) throw err;
});

let protocol = client.connect("ottegi.com", 4922);

protocol.write("joinGame");

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    protocol.write(d.toString().trim() + "\r\n");
});