import { TelnetClient } from "../../telnet";

let client = new TelnetClient();

client.on("data", (data) => {
    data = Buffer.from(data, "utf-8").toString();
    console.log(data);
});

client.on("close", () => {});

client.on("error", (err) => {
    if (err) throw err;
});

let protocol = client.connect("localhost", 23);

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    protocol.write(d.toString().trim() + "\r\n");
});