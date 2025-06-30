import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { io } from "socket.io-client";
import moment from "moment";
import "./style.css";

const socket = io("http://localhost:3000");

function ChatRoom() {
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.on("connected", (user) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          text: `${user.name} joined the chat`,
          date: new Date().toISOString(),
        },
      ]);
    });

    socket.on("users", (userList) => {
      setUsers(userList);
    });

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, { ...msg, type: "message" }]);
    });

    socket.on("disconnected", (socketId) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          text: "A user left the chat",
          date: new Date().toISOString(),
        },
      ]);
    });

    return () => {
      socket.off("connected");
      socket.off("users");
      socket.off("message");
      socket.off("disconnected");
    };
  }, []);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit("username", username);
      setIsConnected(true);
    }
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("send", message);
      setMessage("");
    }
  };

  if (!isConnected) {
    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-12">
            <h2>Join Chat Room</h2>
            <form onSubmit={handleUsernameSubmit}>
              <div className="input-group mb-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <div className="input-group-btn">
                  <button className="btn btn-primary" type="submit">
                    Join
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <h6>Chat Messages</h6>
          <div id="messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.type === "system" ? "text-muted" : ""}
              >
                {msg.type === "system" ? (
                  <em>
                    {msg.text} - {moment(msg.date).format("HH:mm:ss")}
                  </em>
                ) : (
                  <div>
                    <strong>{msg.user?.name}:</strong> {msg.text}
                    <small className="text-muted">
                      {" "}
                      - {moment(msg.date).format("HH:mm:ss")}
                    </small>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleMessageSubmit}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="input-group-btn">
                <button className="btn btn-primary" type="submit">
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="col-md-4">
          <h6>Online Users ({users.length})</h6>
          <ul id="users">
            {users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<ChatRoom />);
