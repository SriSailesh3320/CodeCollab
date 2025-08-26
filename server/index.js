const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const ACTIONS = require("./Actions");
const cors = require("cors");
const axios = require("axios");
const server = http.createServer(app);
require("dotenv").config();

const languageConfig = {
  python3: { versionIndex: "3" },   // Python 3
  java: { versionIndex: "4" },      // Java 11
  cpp17: { versionIndex: "0" },     // C++17
  cpp14: { versionIndex: "3" },     // C++14
  nodejs: { versionIndex: "3" },    // Node.js
  c: { versionIndex: "5" },         // GCC C
  csharp: { versionIndex: "3" },    // C#
  go: { versionIndex: "3" },        // Go
  rust: { versionIndex: "3" },      // Rust
  ruby: { versionIndex: "3" },      // Ruby
  php: { versionIndex: "3" },       // PHP
  swift: { versionIndex: "3" },     // Swift
  kotlin: { versionIndex: "2" },    // Kotlin
  typescript: { versionIndex: "3" },// TypeScript
  bash: { versionIndex: "3" },      // Bash
  sql: { versionIndex: "3" },       // SQL
  r: { versionIndex: "3" },         // R
};


// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => ({
      socketId,
      username: userSocketMap[socketId],
    })
  );
};

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);

    // Notify all clients in the room about the new user
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  // Sync the code across clients
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // Send full code sync to a new user
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // Handle user disconnecting
  socket.on("disconnecting", () => {
    console.log(`Socket disconnecting: ${socket.id}`);

    const rooms = [...socket.rooms];

    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

app.post("/compile", async (req, res) => {
  const { code, language } = req.body;

  if (!languageConfig[language]) {
    return res.status(400).json({ error: "Unsupported language" });
  }

  try {
    const response = await axios.post("https://api.jdoodle.com/v1/execute", {
      script: code,
      language,
      versionIndex: languageConfig[language].versionIndex,
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
    });

    res.json(response.data);
  } catch (error) {
    if (error.response) {
      console.error("JDoodle error:", error.response.data);
      return res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      console.error("No response from JDoodle:", error.request);
      return res.status(500).json({ error: "No response from JDoodle" });
    } else {
      console.error("Error setting up request:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
