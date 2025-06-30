const http = require("http");

const port = 3000;

http
  .createServer((req, res) => {
    if (req.url === "/long-poll") {
      // Simulate delay for long polling
      setTimeout(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: `Hello at ${new Date().toISOString()}`,
          })
        );
      }, 3000);
    } else {
      res.writeHead(200);
      res.end("server is up");
    }
  })
  .listen(port, () => {
    console.log(`Long polling server running on port ${port}`);
  });
