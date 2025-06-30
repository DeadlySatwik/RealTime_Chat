const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express"); // Add this line

const app = express(); // Add this line
const httpServer = createServer(app); // Modify this line to use app
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:1234",
    methods: ["GET", "POST"],
  },
});

const users = {};
const recentMessages = []; // Add this line to store messages

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("username", (username) => {
    const user = {
      name: username,
      id: socket.id,
    };
    users[socket.id] = user;
    io.emit("connected", user);
    io.emit("users", Object.values(users));
  });

  socket.on("send", (message) => {
    const messageData = {
      text: message,
      date: new Date().toISOString(),
      user: users[socket.id],
    };
    
    // Store message for admin view - Add these lines
    recentMessages.push(messageData);
    if (recentMessages.length > 100) {
      recentMessages.shift(); // Keep only last 100 messages
    }
    
    // Log the message to server console
    console.log(`[${new Date().toLocaleTimeString()}] ${messageData.user?.name || 'Unknown'}: ${message}`);
    
    io.emit("message", messageData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    const user = users[socket.id];
    delete users[socket.id];
    io.emit("disconnected", socket.id);
    io.emit("users", Object.values(users));
  });
});

// Add all the admin routes here, BEFORE httpServer.listen()
app.get('/admin', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Chat Admin Dashboard</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .message { padding: 10px; border-bottom: 1px solid #eee; }
        .user { font-weight: bold; color: #007bff; }
        .date { color: #666; font-size: 0.9em; }
        .text { margin: 5px 0; }
        .refresh-btn { background: #007bff; color: white; padding: 10px 20px; border: none; cursor: pointer; margin-bottom: 20px; }
        .stats { background: #f8f9fa; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h1>Chat Room Admin Dashboard</h1>
      <div class="stats">
        <h3>Live Stats</h3>
        <p><strong>Active Users:</strong> <span id="userCount">${Object.keys(users).length}</span></p>
        <p><strong>Total Messages:</strong> <span id="messageCount">${recentMessages.length}</span></p>
      </div>
      <button class="refresh-btn" onclick="location.reload()">Refresh</button>
      <button class="refresh-btn" onclick="window.open('/admin/messages', '_blank')">View JSON</button>
      
      <h3>Recent Messages (Last 100)</h3>
      <div id="messages">
        ${recentMessages.map(msg => `
          <div class="message">
            <div class="date">${new Date(msg.date).toLocaleString()}</div>
            <div class="user">${msg.user?.name || 'Unknown User'}</div>
            <div class="text">${msg.text}</div>
          </div>
        `).join('')}
      </div>
      
      <script>
        // Auto-refresh every 30 seconds
        setTimeout(() => location.reload(), 30000);
      </script>
    </body>
    </html>
  `);
});

app.get('/admin/messages', (req, res) => {
  res.json({
    messages: recentMessages,
    activeUsers: Object.values(users),
    stats: {
      totalMessages: recentMessages.length,
      activeUserCount: Object.keys(users).length
    }
  });
});

app.get('/admin/users', (req, res) => {
  res.json(Object.values(users));
});

httpServer.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  console.log("Admin Dashboard: http://localhost:3000/admin"); // Add this line
});