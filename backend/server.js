// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const { Server } = require("socket.io");

// const app = express();
// app.use(cors());
// app.use(express.json());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*", // allow all origins for dev
//   },
// });

// require("./socket")(io); // Connect socket handlers

// server.listen(5000, () => console.log("Server running on http://localhost:5000"));
// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const { Server } = require("socket.io");

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", // or your frontend URL
//     methods: ["GET", "POST"]
//   }
// });

// const users = {}; // { socket.id: username }

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("join", (username) => {
//     users[socket.id] = username;
//     console.log(`${username} joined`);

//     io.emit("userList", Object.values(users));
//   });

//   socket.on("message", (msg) => {
//     const sender = users[socket.id] || "Anonymous";
//     const messageData = { sender, text: msg };
//     io.emit("message", messageData);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//     delete users[socket.id];
//     io.emit("userList", Object.values(users));
//   });
// });

// server.listen(5000, () => {
//   console.log("Server listening on http://localhost:5000");
// });


// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const { Server } = require("socket.io");

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", // your frontend URL
//     methods: ["GET", "POST"],
//   },
// });

// const users = {}; // { socket.id: username }

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("join", (username) => {
//     users[socket.id] = username;
//     console.log(`${username} joined`);
//     io.emit("userList", Object.values(users));
//   });

//   socket.on("message", (msg) => {
//     const sender = users[socket.id] || "Anonymous";
//     const messageData = { sender, text: msg };
//     io.emit("message", messageData); // broadcast to all (group chat)
//   });

//   // Private message handler
//   socket.on("privateMessage", ({ toUsername, text }) => {
//     const sender = users[socket.id];
//     const targetSocketId = Object.keys(users).find(
//       (key) => users[key] === toUsername
//     );
//     if (targetSocketId) {
//       io.to(targetSocketId).emit("privateMessage", {
//         sender,
//         text,
//       });
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//     delete users[socket.id];
//     io.emit("userList", Object.values(users));
//   });
// });

// server.listen(5000, () => {
//   console.log("Server listening on http://localhost:5000");
// });
// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const { Server } = require("socket.io");

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"]
//   }
// });

// const users = {}; // { socket.id: { username, room } }

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("joinRoom", ({ username, room }) => {
//     users[socket.id] = { username, room };
//     socket.join(room);
//     console.log(`${username} joined room: ${room}`);

//     // Notify room about new user
//     io.to(room).emit("message", {
//       sender: "System",
//       text: `${username} joined the room.`,
//     });

//     // Send updated user list in room
//     const roomUsers = Object.values(users)
//       .filter(u => u.room === room)
//       .map(u => u.username);
//     io.to(room).emit("userList", roomUsers);
//   });

//   socket.on("message", (msg) => {
//     const user = users[socket.id];
//     if (user) {
//       io.to(user.room).emit("message", {
//         sender: user.username,
//         text: msg,
//       });
//     }
//   });

//   socket.on("disconnect", () => {
//     const user = users[socket.id];
//     if (user) {
//       const room = user.room;
//       const username = user.username;
//       delete users[socket.id];

//       io.to(room).emit("message", {
//         sender: "System",
//         text: `${username} left the room.`,
//       });

//       const roomUsers = Object.values(users)
//         .filter(u => u.room === room)
//         .map(u => u.username);
//       io.to(room).emit("userList", roomUsers);
//     }
//   });
// });

// server.listen(5000, () => {
//   console.log("Server listening on http://localhost:5000");
// });


// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const { Server } = require("socket.io");

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", // update if your frontend is hosted elsewhere
//     methods: ["GET", "POST"]
//   }
// });

// // Store user info
// const users = {};        // socket.id => username
// const usernames = {};    // username => socket.id
// const groups = {};       // groupName => { members: [], messages: [] }

// // Utility to get socket.id from username
// const getSocketIdByUsername = (username) => {
//   return usernames[username];
// };

// // Socket connection
// io.on("connection", (socket) => {
//   console.log("✅ User connected:", socket.id);

//   // Join with a username
//   socket.on("join", (username) => {
//     users[socket.id] = username;
//     usernames[username] = socket.id;

//     console.log(`👤 ${username} joined`);
//     io.emit("userList", Object.values(users));
//   });

//   // Private messaging
//   socket.on("privateMessage", ({ toUsername, text }) => {
//     const sender = users[socket.id];
//     const targetSocketId = usernames[toUsername];

//     if (targetSocketId) {
//       io.to(targetSocketId).emit("privateMessage", { sender, text });
//     }
//   });

//   // Create a group
//   socket.on("createGroup", ({ groupName, members }) => {
//     if (!groups[groupName]) {
//       groups[groupName] = { members, messages: [] };

//       members.forEach((username) => {
//         const socketId = getSocketIdByUsername(username);
//         if (socketId) {
//           io.to(socketId).emit("groupCreated", { groupName });
//         }
//       });

//       console.log(`👥 Group "${groupName}" created with members:`, members);
//     } else {
//       console.log(`❗ Group "${groupName}" already exists.`);
//     }
//   });

//   // Send group message
//   socket.on("groupMessage", ({ groupName, sender, text }) => {
//     if (groups[groupName]?.members.includes(sender)) {
//       const msg = { sender, text };
//       groups[groupName].messages.push(msg);

//       groups[groupName].members.forEach((member) => {
//         const socketId = getSocketIdByUsername(member);
//         if (socketId) {
//           io.to(socketId).emit("groupMessage", { groupName, ...msg });
//         }
//       });
//     }
//   });

//   // Disconnect
//   socket.on("disconnect", () => {
//     const username = users[socket.id];
//     console.log(`❌ ${username} disconnected`);

//     delete usernames[username];
//     delete users[socket.id];
//     io.emit("userList", Object.values(users));
//   });
// });

// // Start server
// server.listen(5000, () => {
//   console.log("🚀 Server listening on http://localhost:5000");
// });



// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*", // For dev purposes, update in production
//   },
// });

// let users = {}; // socket.id -> username
// let userSockets = {}; // username -> socket.id
// let groups = {}; // groupName -> [members]

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("join", (username) => {
//     users[socket.id] = username;
//     userSockets[username] = socket.id;

//     // Notify everyone about new user list
//     io.emit("userList", Object.values(userSockets));

//     // Send back the groups this user is part of
//     const joinedGroups = Object.entries(groups)
//       .filter(([_, members]) => members.includes(username))
//       .map(([groupName, members]) => ({ groupName, members }));

//     joinedGroups.forEach(({ groupName, members }) => {
//       socket.emit("groupCreated", { groupName, members });
//     });
//   });

//   socket.on("privateMessage", ({ toUsername, text }) => {
//     const fromUsername = users[socket.id];
//     const toSocketId = userSockets[toUsername];
//     if (toSocketId) {
//       io.to(toSocketId).emit("privateMessage", {
//         sender: fromUsername,
//         text,
//       });
//     }
//   });

//   socket.on("createGroup", ({ groupName, members }) => {
//     if (!groups[groupName]) {
//       groups[groupName] = members;
//     }

//     // Notify each member (if online) about the group
//     members.forEach((member) => {
//       const memberSocket = userSockets[member];
//       if (memberSocket) {
//         io.to(memberSocket).emit("groupCreated", {
//           groupName,
//           members,
//         });
//       }
//     });
//   });

//   socket.on("groupMessage", ({ groupName, sender, text }) => {
//     if (!groups[groupName]) return;

//     const members = groups[groupName];
//     if (!members.includes(sender)) return; // sender must be in group

//     members.forEach((member) => {
//       const memberSocket = userSockets[member];
//       if (memberSocket) {
//         io.to(memberSocket).emit("groupMessage", {
//           groupName,
//           sender,
//           text,
//         });
//       }
//     });
//   });

//   socket.on("disconnect", () => {
//     const username = users[socket.id];
//     delete users[socket.id];
//     delete userSockets[username];
//     io.emit("userList", Object.values(userSockets));
//     console.log("User disconnected:", socket.id);
//   });
// });

// server.listen(3001, () => {
//   console.log("Socket.IO server running on http://localhost:3001");
// });

// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const { Server } = require("socket.io");

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"]
//   }
// });

// // Store user info
// const users = {};        // socket.id => username
// const usernames = {};    // username => socket.id
// const groups = {};       // groupName => { members: [], messages: [] }

// // Utility to get socket.id from username
// const getSocketIdByUsername = (username) => {
//   return usernames[username];
// };

// // Socket connection
// io.on("connection", (socket) => {
//   console.log("✅ User connected:", socket.id);

//   // Join with a username
//   socket.on("join", (username) => {
//     users[socket.id] = username;
//     usernames[username] = socket.id;

//     console.log(`👤 ${username} joined`);
//     io.emit("userList", Object.values(users));
//   });

//   // Private messaging
//   socket.on("privateMessage", ({ toUsername, text }) => {
//     const sender = users[socket.id];
//     const targetSocketId = usernames[toUsername];

//     if (targetSocketId) {
//       io.to(targetSocketId).emit("privateMessage", { sender, text });
//       io.to(socket.id).emit("privateMessage", { sender: "You", text });
//     }
//   });

//   // Create a group
//   socket.on("createGroup", ({ groupName, members }) => {
//     if (!groups[groupName]) {
//       groups[groupName] = { members, messages: [] };

//       members.forEach((username) => {
//         const socketId = getSocketIdByUsername(username);
//         if (socketId) {
//           io.to(socketId).emit("groupCreated", { groupName, members });
//         }
//       });

//       console.log(`👥 Group "${groupName}" created with members:`, members);
//     } else {
//       console.log(`❗ Group "${groupName}" already exists.`);
//     }
//   });

//   // Send group message
//   socket.on("groupMessage", ({ groupName, sender, text }) => {
//     if (groups[groupName]?.members.includes(sender)) {
//       const msg = { sender, text };
//       groups[groupName].messages.push(msg);

//       groups[groupName].members.forEach((member) => {
//         const socketId = getSocketIdByUsername(member);
//         if (socketId) {
//           io.to(socketId).emit("groupMessage", { groupName, sender, text });
//         }
//       });
//     }
//   });

//   // Disconnect
//   socket.on("disconnect", () => {
//     const username = users[socket.id];
//     console.log(`❌ ${username} disconnected`);

//     delete usernames[username];
//     delete users[socket.id];
//     io.emit("userList", Object.values(users));
//   });
// });

// // Start server
// server.listen(5000, () => {
//   console.log("🚀 Server listening on http://localhost:5000");
// });

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const socketHandler = require("./socket");

const app = express();
app.use(cors());

// Connect to MongoDB
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Initialize Socket.IO handlers
socketHandler(io);

// Start server
server.listen(5000, () => {
  console.log("🚀 Server listening on http://localhost:5000");
});