const net = require('net')
const socket = new net.Socket();
const port = 4922;
const host = "ottegi.com";
socket.on('error', (err) => console.log(Buffer.from(err, "utf-8")))
socket.on('data', (data) => console.log(Buffer.from(data.toString(), "utf-8")));

socket.connect(port, host, () => {
  
})