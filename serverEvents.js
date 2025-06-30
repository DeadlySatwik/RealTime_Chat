const http = require("http");

const port = 3000;

http
    .createServer((req, res) => {
        if (req.url === "/events") {
            res.writeHead(200, {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            });

            // send initial event
            res.write(`data: Hello at ${new Date().toISOString()}\n\n`);

            // send events at intervals
            const interval = setInterval(() => {
                res.write(`data: Update at ${new Date().toISOString()}\n\n`);
            }, 3000);

            req.on("close", () => clearInterval(interval));
        } else {
            res.writeHead(200);
            res.end("server is up");
        }
    })
    .listen(port, () => {
        console.log(`SSE server running on port ${port}`);
    });