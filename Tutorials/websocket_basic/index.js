const http = require("http");
const WebSocketServer = require("websocket").server;
let connection = null;

const httpserver = http.createServer((req, res) => {
    console.log("Received request");
    res.end();
});

const websocket = new WebSocketServer({ httpServer: httpserver });

websocket.on("request", request => {
    connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("Opened"));
    connection.on("close", () => console.log("Closed"));
    connection.on("message", message => {
        console.log(`Received message: ${message.utf8Data}`);
    });
});

function sendEvery5sec() {
    if (connection && connection.connected) {
        connection.send(`Message: ${Math.random()}`);
    }
    setTimeout(sendEvery5sec, 5000);
}

sendEvery5sec();
httpserver.listen(8080, () => console.log("Server listening on port 8080"));
