import { TelnetClient } from "../../telnet";

let telnet = new TelnetClient();

let client = telnet.connect("localhost", 23);

client.on("data", (data) => {
    data = Buffer.from(data, "utf-8").toString();
    console.log(data);
});

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    client.write(d.toString().trim());
});