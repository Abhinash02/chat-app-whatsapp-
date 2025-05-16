// module.exports = (io) => {
//   const users = {}; // { userId: socketId }

//   io.on("connection", (socket) => {
//     console.log("Connected:", socket.id);

//     socket.on("join", ({ userId }) => {
//       users[userId] = socket.id;
//       console.log(`${userId} joined with socket ${socket.id}`);
//     });

//     socket.on("private_message", ({ to, from, message }) => {
//       const targetSocket = users[to];
//       if (targetSocket) {
//         io.to(targetSocket).emit("private_message", { from, message });
//       }
//     });

//     socket.on("join_room", (room) => {
//       socket.join(room);
//       console.log(`Socket ${socket.id} joined room ${room}`);
//     });

//     socket.on("group_message", ({ room, from, message }) => {
//       io.to(room).emit("group_message", { from, message });
//     });

//     socket.on("disconnect", () => {
//       console.log("Disconnected:", socket.id);
//       for (const user in users) {
//         if (users[user] === socket.id) {
//           delete users[user];
//           break;
//         }
//       }
//     });
//   });
// };

// const User = require("./models/User");
// const Group = require("./models/Group");
// const Message = require("./models/Message");

// module.exports = (io) => {
//   io.on("connection", (socket) => {
//     console.log("✅ User connected:", socket.id);

//     // Join with a username
//     socket.on("join", async (username) => {
//       try {
//         // Update or create user
//         await User.findOneAndUpdate(
//           { username },
//           { socketId: socket.id, online: true, username },
//           { upsert: true, new: true }
//         );

//         // Get all users
//         const users = await User.find().select("username");
//         io.emit("userList", users.map((u) => u.username));

//         // Send user's groups
//         const groups = await Group.find({ members: username }).select("name members");
//         socket.emit("groupList", groups.map((g) => ({ name: g.name, members: g.members })));

//         console.log(`👤 ${username} joined`);
//       } catch (error) {
//         console.error("Error in join:", error);
//       }
//     });

//     // Private messaging
//     socket.on("privateMessage", async ({ toUsername, text }) => {
//       try {
//         const sender = (await User.findOne({ socketId: socket.id }))?.username;
//         const target = await User.findOne({ username: toUsername });

//         if (sender && target) {
//           // Save message
//           await Message.create({
//             type: "private",
//             sender,
//             receiver: toUsername,
//             text,
//           });

//           // Emit to receiver and sender
//           io.to(target.socketId).emit("privateMessage", { sender, text });
//           io.to(socket.id).emit("privateMessage", { sender: "You", text });
//         }
//       } catch (error) {
//         console.error("Error in privateMessage:", error);
//       }
//     });

//     // Create a group
//     socket.on("createGroup", async ({ groupName, members }) => {
//       try {
//         if (await Group.findOne({ name: groupName })) {
//           console.log(`❗ Group "${groupName}" already exists.`);
//           return;
//         }

//         // Create group
//         await Group.create({ name: groupName, members });

//         // Notify all members
//         for (const username of members) {
//           const user = await User.findOne({ username });
//           if (user?.socketId) {
//             io.to(user.socketId).emit("groupCreated", { groupName, members });
//             // Send updated group list
//             const groups = await Group.find({ members: username }).select("name members");
//             io.to(user.socketId).emit("groupList", groups.map((g) => ({ name: g.name, members: g.members })));
//           }
//         }

//         console.log(`👥 Group "${groupName}" created with members:`, members);
//       } catch (error) {
//         console.error("Error in createGroup:", error);
//       }
//     });

//     // Send group message
//     socket.on("groupMessage", async ({ groupName, sender, text }) => {
//       try {
//         const group = await Group.findOne({ name: groupName });
//         if (group?.members.includes(sender)) {
//           // Save message
//           await Message.create({
//             type: "group",
//             sender,
//             receiver: groupName,
//             text,
//           });

//           // Emit to all group members
//           for (const member of group.members) {
//             const user = await User.findOne({ username: member });
//             if (user?.socketId) {
//               io.to(user.socketId).emit("groupMessage", { groupName, sender, text });
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error in groupMessage:", error);
//       }
//     });

//     // Fetch message history
//     socket.on("fetchMessages", async ({ type, target }) => {
//       try {
//         const user = await User.findOne({ socketId: socket.id });
//         if (!user) return;

//         let messages;
//         if (type === "private") {
//           messages = await Message.find({
//             type: "private",
//             $or: [
//               { sender: user.username, receiver: target },
//               { sender: target, receiver: user.username },
//             ],
//           }).sort({ timestamp: 1 });
//         } else {
//           messages = await Message.find({
//             type: "group",
//             receiver: target,
//           }).sort({ timestamp: 1 });
//         }

//         socket.emit("messageHistory", messages.map((m) => ({
//           sender: m.sender === user.username ? "You" : m.sender,
//           text: m.text,
//           groupName: m.type === "group" ? m.receiver : undefined,
//         })));
//       } catch (error) {
//         console.error("Error in fetchMessages:", error);
//       }
//     });

//     // Disconnect
//     socket.on("disconnect", async () => {
//       try {
//         const user = await User.findOneAndUpdate(
//           { socketId: socket.id },
//           { socketId: null, online: false }
//         );
//         if (user) {
//           console.log(`❌ ${user.username} disconnected`);
//           const users = await User.find().select("username");
//           io.emit("userList", users.map((u) => u.username));
//         }
//       } catch (error) {
//         console.error("Error in disconnect:", error);
//       }
//     });
//   });
// };


// const User = require("./models/User");
// const Group = require("./models/Group");
// const Message = require("./models/Message");

// module.exports = (io) => {
//   io.on("connection", (socket) => {
//     console.log("✅ User connected:", socket.id);

//     // Join with a username
//     socket.on("join", async (username) => {
//       try {
//         // Update or create user
//         await User.findOneAndUpdate(
//           { username },
//           { socketId: socket.id, online: true, username },
//           { upsert: true, new: true }
//         );

//         // Get all users
//         const users = await User.find().select("username");
//         io.emit("userList", users.map((u) => u.username));

//         // Emit user status to all clients
//         io.emit("userStatus", { username, online: true });

//         // Send user's groups
//         const groups = await Group.find({ members: username }).select("name members");
//         socket.emit("groupList", groups.map((g) => ({ name: g.name, members: g.members })));

//         console.log(`👤 ${username} joined`);
//       } catch (error) {
//         console.error("Error in join:", error);
//       }
//     });

//     // Private messaging
//     socket.on("privateMessage", async ({ toUsername, text }) => {
//       try {
//         const sender = (await User.findOne({ socketId: socket.id }))?.username;
//         const target = await User.findOne({ username: toUsername });

//         if (sender && target) {
//           // Save message
//           await Message.create({
//             type: "private",
//             sender,
//             receiver: toUsername,
//             text,
//           });

//           // Emit to receiver and sender
//           io.to(target.socketId).emit("privateMessage", { sender, text });
//           io.to(socket.id).emit("privateMessage", { sender: "You", text });
//         }
//       } catch (error) {
//         console.error("Error in privateMessage:", error);
//       }
//     });

//     // Create a group
//     socket.on("createGroup", async ({ groupName, members }) => {
//       try {
//         if (await Group.findOne({ name: groupName })) {
//           console.log(`❗ Group "${groupName}" already exists.`);
//           return;
//         }

//         // Create group
//         await Group.create({ name: groupName, members });

//         // Notify all members
//         for (const username of members) {
//           const user = await User.findOne({ username });
//           if (user?.socketId) {
//             io.to(user.socketId).emit("groupCreated", { groupName, members });
//             // Send updated group list
//             const groups = await Group.find({ members: username }).select("name members");
//             io.to(user.socketId).emit("groupList", groups.map((g) => ({ name: g.name, members: g.members })));
//           }
//         }

//         console.log(`👥 Group "${groupName}" created with members:`, members);
//       } catch (error) {
//         console.error("Error in createGroup:", error);
//       }
//     });

//     // Send group message
//     socket.on("groupMessage", async ({ groupName, sender, text }) => {
//       try {
//         const group = await Group.findOne({ name: groupName });
//         if (group?.members.includes(sender)) {
//           // Save message
//           await Message.create({
//             type: "group",
//             sender,
//             receiver: groupName,
//             text,
//           });

//           // Emit to all group members
//           for (const member of group.members) {
//             const user = await User.findOne({ username: member });
//             if (user?.socketId) {
//               io.to(user.socketId).emit("groupMessage", { groupName, sender, text });
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error in groupMessage:", error);
//       }
//     });

//     // Fetch message history
//     socket.on("fetchMessages", async ({ type, target }) => {
//       try {
//         const user = await User.findOne({ socketId: socket.id });
//         if (!user) return;

//         let messages;
//         if (type === "private") {
//           messages = await Message.find({
//             type: "private",
//             $or: [
//               { sender: user.username, receiver: target },
//               { sender: target, receiver: user.username },
//             ],
//           }).sort({ timestamp: 1 });
//         } else {
//           messages = await Message.find({
//             type: "group",
//             receiver: target,
//           }).sort({ timestamp: 1 });
//         }

//         socket.emit("messageHistory", messages.map((m) => ({
//           sender: m.sender === user.username ? "You" : m.sender,
//           text: m.text,
//           groupName: m.type === "group" ? m.receiver : undefined,
//         })));
//       } catch (error) {
//         console.error("Error in fetchMessages:", error);
//       }
//     });

//     // Disconnect
//     socket.on("disconnect", async () => {
//       try {
//         const user = await User.findOneAndUpdate(
//           { socketId: socket.id },
//           { socketId: null, online: false }
//         );
//         if (user) {
//           console.log(`❌ ${user.username} disconnected`);
//           io.emit("userStatus", { username: user.username, online: false });
//           const users = await User.find().select("username");
//           io.emit("userList", users.map((u) => u.username));
//         }
//       } catch (error) {
//         console.error("Error in disconnect:", error);
//       }
//     });
//   });
// };


// const User = require("./models/User");
// const Group = require("./models/Group");
// const Message = require("./models/Message");

// module.exports = (io) => {
//   io.on("connection", (socket) => {
//     console.log("✅ User connected:", socket.id);

//     socket.on("join", async (username) => {
//       try {
//         await User.findOneAndUpdate(
//           { username },
//           { socketId: socket.id, online: true, username },
//           { upsert: true, new: true }
//         );

//         const users = await User.find().select("username online");
//         io.emit("userList", users.map((u) => ({ username: u.username, online: u.online })));
//         io.emit("userStatus", { username, online: true });

//         const groups = await Group.find({ members: username }).select("name members admins");
//         socket.emit("groupList", groups.map((g) => ({ name: g.name, members: g.members, admins: g.admins })));

//         console.log(`👤 ${username} joined`);
//       } catch (error) {
//         console.error("Error in join:", error);
//       }
//     });

//     socket.on("privateMessage", async ({ toUsername, text }) => {
//       try {
//         const sender = (await User.findOne({ socketId: socket.id }))?.username;
//         const target = await User.findOne({ username: toUsername });

//         if (sender && target) {
//           await Message.create({
//             type: "private",
//             sender,
//             receiver: toUsername,
//             text,
//           });

//           io.to(target.socketId).emit("privateMessage", { sender, text });
//           io.to(socket.id).emit("privateMessage", { sender: "You", text });
//         }
//       } catch (error) {
//         console.error("Error in privateMessage:", error);
//       }
//     });

//     socket.on("createGroup", async ({ groupName, members }) => {
//       try {
//         if (await Group.findOne({ name: groupName })) {
//           socket.emit("error", { message: `Group "${groupName}" already exists.` });
//           return;
//         }

//         const creator = (await User.findOne({ socketId: socket.id }))?.username;
//         await Group.create({ name: groupName, members, admins: [creator] });

//         for (const username of members) {
//           const user = await User.findOne({ username });
//           if (user?.socketId) {
//             io.to(user.socketId).emit("groupCreated", { groupName, members, admins: [creator] });
//             const groups = await Group.find({ members: username }).select("name members admins");
//             io.to(user.socketId).emit("groupList", groups.map((g) => ({ name: g.name, members: g.members, admins: g.admins })));
//           }
//         }

//         console.log(`👥 Group "${groupName}" created with admin: ${creator}`);
//       } catch (error) {
//         console.error("Error in createGroup:", error);
//         socket.emit("error", { message: "Failed to create group." });
//       }
//     });

//     socket.on("groupMessage", async ({ groupName, sender, text }) => {
//       try {
//         const group = await Group.findOne({ name: groupName });
//         if (group?.members.includes(sender)) {
//           await Message.create({
//             type: "group",
//             sender,
//             receiver: groupName,
//             text,
//           });

//           for (const member of group.members) {
//             const user = await User.findOne({ username: member });
//             if (user?.socketId) {
//               io.to(user.socketId).emit("groupMessage", { groupName, sender, text });
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error in groupMessage:", error);
//       }
//     });

//     socket.on("addAdmin", async ({ groupName, username }) => {
//       try {
//         const requester = (await User.findOne({ socketId: socket.id }))?.username;
//         const group = await Group.findOne({ name: groupName });
//         if (!group) {
//           socket.emit("error", { message: `Group "${groupName}" not found.` });
//           return;
//         }
//         if (!group.admins.includes(requester)) {
//           socket.emit("error", { message: "Only admins can add new admins." });
//           return;
//         }
//         if (!group.members.includes(username)) {
//           socket.emit("error", { message: `${username} is not a group member.` });
//           return;
//         }
//         if (group.admins.includes(username)) {
//           socket.emit("error", { message: `${username} is already an admin.` });
//           return;
//         }

//         group.admins.push(username);
//         await group.save();

//         for (const member of group.members) {
//           const user = await User.findOne({ username: member });
//           if (user?.socketId) {
//             io.to(user.socketId).emit("groupUpdated", {
//               groupName,
//               members: group.members,
//               admins: group.admins,
//             });
//           }
//         }
//         console.log(`👤 ${username} added as admin to ${groupName}`);
//       } catch (error) {
//         console.error("Error in addAdmin:", error);
//         socket.emit("error", { message: "Failed to add admin." });
//       }
//     });

//     socket.on("removeAdmin", async ({ groupName, username }) => {
//       try {
//         const requester = (await User.findOne({ socketId: socket.id }))?.username;
//         const group = await Group.findOne({ name: groupName });
//         if (!group) {
//           socket.emit("error", { message: `Group "${groupName}" not found.` });
//           return;
//         }
//         if (!group.admins.includes(requester)) {
//           socket.emit("error", { message: "Only admins can remove admins." });
//           return;
//         }
//         if (!group.admins.includes(username)) {
//           socket.emit("error", { message: `${username} is not an admin.` });
//           return;
//         }
//         if (group.admins.length <= 1) {
//           socket.emit("error", { message: "Group must have at least one admin." });
//           return;
//         }

//         group.admins = group.admins.filter((admin) => admin !== username);
//         await group.save();

//         for (const member of group.members) {
//           const user = await User.findOne({ username: member });
//           if (user?.socketId) {
//             io.to(user.socketId).emit("groupUpdated", {
//               groupName,
//               members: group.members,
//               admins: group.admins,
//             });
//           }
//         }
//         console.log(`👤 ${username} removed as admin from ${groupName}`);
//       } catch (error) {
//         console.error("Error in removeAdmin:", error);
//         socket.emit("error", { message: "Failed to remove admin." });
//       }
//     });

//     socket.on("removeMember", async ({ groupName, username }) => {
//       try {
//         const requester = (await User.findOne({ socketId: socket.id }))?.username;
//         const group = await Group.findOne({ name: groupName });
//         if (!group) {
//           socket.emit("error", { message: `Group "${groupName}" not found.` });
//           return;
//         }
//         if (!group.admins.includes(requester)) {
//           socket.emit("error", { message: "Only admins can remove members." });
//           return;
//         }
//         if (!group.members.includes(username)) {
//           socket.emit("error", { message: `${username} is not a group member.` });
//           return;
//         }

//         group.members = group.members.filter((m) => m !== username);
//         group.admins = group.admins.filter((a) => a !== username);
//         await group.save();

//         for (const member of group.members) {
//           const user = await User.findOne({ username: member });
//           if (user?.socketId) {
//             io.to(user.socketId).emit("groupUpdated", {
//               groupName,
//               members: group.members,
//               admins: group.admins,
//             });
//           }
//         }

//         const removedUser = await User.findOne({ username });
//         if (removedUser?.socketId) {
//           io.to(removedUser.socketId).emit("removedFromGroup", { groupName });
//         }
//         console.log(`👤 ${username} removed from ${groupName}`);
//       } catch (error) {
//         console.error("Error in removeMember:", error);
//         socket.emit("error", { message: "Failed to remove member." });
//       }
//     });

//     socket.on("exitGroup", async ({ groupName }) => {
//       try {
//         const username = (await User.findOne({ socketId: socket.id }))?.username;
//         const group = await Group.findOne({ name: groupName });
//         if (!group) {
//           socket.emit("error", { message: `Group "${groupName}" not found.` });
//           return;
//         }
//         if (!group.members.includes(username)) {
//           socket.emit("error", { message: "You are not a member of this group." });
//           return;
//         }
//         if (group.admins.includes(username) && group.admins.length === 1 && group.members.length > 1) {
//           socket.emit("error", { message: "Assign another admin before leaving." });
//           return;
//         }

//         group.members = group.members.filter((m) => m !== username);
//         group.admins = group.admins.filter((a) => a !== username);
//         await group.save();

//         for (const member of group.members) {
//           const user = await User.findOne({ username: member });
//           if (user?.socketId) {
//             io.to(user.socketId).emit("groupUpdated", {
//               groupName,
//               members: group.members,
//               admins: group.admins,
//             });
//           }
//         }

//         socket.emit("removedFromGroup", { groupName });
//         console.log(`👤 ${username} exited ${groupName}`);
//       } catch (error) {
//         console.error("Error in exitGroup:", error);
//         socket.emit("error", { message: "Failed to exit group." });
//       }
//     });

//     socket.on("fetchMessages", async ({ type, target }) => {
//       try {
//         const user = await User.findOne({ socketId: socket.id });
//         if (!user) return;

//         let messages;
//         if (type === "private") {
//           messages = await Message.find({
//             type: "private",
//             $or: [
//               { sender: user.username, receiver: target },
//               { sender: target, receiver: user.username },
//             ],
//           }).sort({ timestamp: 1 });
//         } else {
//           messages = await Message.find({
//             type: "group",
//             receiver: target,
//           }).sort({ timestamp: 1 });
//         }

//         socket.emit("messageHistory", messages.map((m) => ({
//           sender: m.sender === user.username ? "You" : m.sender,
//           text: m.text,
//           groupName: m.type === "group" ? m.receiver : undefined,
//         })));
//       } catch (error) {
//         console.error("Error in fetchMessages:", error);
//       }
//     });

//     socket.on("disconnect", async () => {
//       try {
//         const user = await User.findOneAndUpdate(
//           { socketId: socket.id },
//           { socketId: null, online: false }
//         );
//         if (user) {
//           console.log(`❌ ${user.username} disconnected`);
//           io.emit("userStatus", { username: user.username, online: false });
//           const users = await User.find().select("username online");
//           io.emit("userList", users.map((u) => ({ username: u.username, online: u.online })));
//         }
//       } catch (error) {
//         console.error("Error in disconnect:", error);
//       }
//     });
//   });
// };

// const User = require("./models/User");
// const Group = require("./models/Group");
// const Message = require("./models/Message");

// module.exports = (io) => {
//   io.on("connection", (socket) => {
//     console.log("✅ User connected:", socket.id);

//     socket.on("join", async (username) => {
//       try {
//         await User.findOneAndUpdate(
//           { username },
//           { socketId: socket.id, online: true, username },
//           { upsert: true, new: true }
//         );

//         const users = await User.find().select("username online");
//         io.emit("userList", users.map((u) => ({ username: u.username, online: u.online })));
//         io.emit("userStatus", { username, online: true });

//         const groups = await Group.find({ members: username }).select("name members admins");
//         socket.emit("groupList", groups.map((g) => ({ name: g.name, members: g.members, admins: g.admins })));

//         console.log(`👤 ${username} joined`);
//       } catch (error) {
//         console.error("Error in join:", error);
//       }
//     });

//     socket.on("privateMessage", async ({ toUsername, text }) => {
//       try {
//         const sender = (await User.findOne({ socketId: socket.id }))?.username;
//         const target = await User.findOne({ username: toUsername });

//         if (sender && target) {
//           await Message.create({
//             type: "private",
//             sender,
//             receiver: toUsername,
//             text,
//           });

//           io.to(target.socketId).emit("privateMessage", { sender, text });
//           io.to(socket.id).emit("privateMessage", { sender: "You", text });
//         }
//       } catch (error) {
//         console.error("Error in privateMessage:", error);
//       }
//     });

//     socket.on("createGroup", async ({ groupName, members }) => {
//       try {
//         if (await Group.findOne({ name: groupName })) {
//           socket.emit("error", { message: `Group "${groupName}" already exists.` });
//           return;
//         }

//         const creator = (await User.findOne({ socketId: socket.id }))?.username;
//         await Group.create({ name: groupName, members, admins: [creator] });

//         for (const username of members) {
//           const user = await User.findOne({ username });
//           if (user?.socketId) {
//             io.to(user.socketId).emit("groupCreated", { groupName, members, admins: [creator] });
//             const groups = await Group.find({ members: username }).select("name members admins");
//             io.to(user.socketId).emit("groupList", groups.map((g) => ({ name: g.name, members: g.members, admins: g.admins })));
//           }
//         }

//         console.log(`👥 Group "${groupName}" created with admin: ${creator}`);
//       } catch (error) {
//         console.error("Error in createGroup:", error);
//         socket.emit("error", { message: "Failed to create group." });
//       }
//     });

//     socket.on("groupMessage", async ({ groupName, sender, text }) => {
//       try {
//         const group = await Group.findOne({ name: groupName });
//         if (group?.members.includes(sender)) {
//           await Message.create({
//             type: "group",
//             sender,
//             receiver: groupName,
//             text,
//           });

//           for (const member of group.members) {
//             const user = await User.findOne({ username: member });
//             if (user?.socketId) {
//               io.to(user.socketId).emit("groupMessage", { groupName, sender, text });
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error in groupMessage:", error);
//       }
//     });

//     socket.on("addAdmin", async ({ groupName, username }) => {
//       try {
//         const requester = (await User.findOne({ socketId: socket.id }))?.username;
//         const group = await Group.findOne({ name: groupName });
//         if (!group) {
//           socket.emit("error", { message: `Group "${groupName}" not found.` });
//           return;
//         }
//         if (!group.admins.includes(requester)) {
//           socket.emit("error", { message: "Only admins can add new admins." });
//           return;
//         }
//         if (!group.members.includes(username)) {
//           socket.emit("error", { message: `${username} is not a group member.` });
//           return;
//         }
//         if (group.admins.includes(username)) {
//           socket.emit("error", { message: `${username} is already an admin.` });
//           return;
//         }

//         group.admins.push(username);
//         await group.save();

//         for (const member of group.members) {
//           const user = await User.findOne({ username: member });
//           if (user?.socketId) {
//             io.to(user.socketId).emit("groupUpdated", {
//               groupName,
//               members: group.members,
//               admins: group.admins,
//             });
//           }
//         }
//         console.log(`👤 ${username} added as admin to ${groupName}`);
//       } catch (error) {
//         console.error("Error in addAdmin:", error);
//         socket.emit("error", { message: "Failed to add admin." });
//       }
//     });

//     socket.on("removeAdmin", async ({ groupName, username }) => {
//       try {
//         const requester = (await User.findOne({ socketId: socket.id }))?.username;
//         const group = await Group.findOne({ name: groupName });
//         if (!group) {
//           socket.emit("error", { message: `Group "${groupName}" not found.` });
//           return;
//         }
//         if (!group.admins.includes(requester)) {
//           socket.emit("error", { message: "Only admins can remove admins." });
//           return;
//         }
//         if (!group.admins.includes(username)) {
//           socket.emit("error", { message: `${username} is not an admin.` });
//           return;
//         }
//         if (group.admins.length <= 1) {
//           socket.emit("error", { message: "Group must have at least one admin." });
//           return;
//         }

//         group.admins = group.admins.filter((admin) => admin !== username);
//         await group.save();

//         for (const member of group.members) {
//           const user = await User.findOne({ username: member });
//           if (user?.socketId) {
//             io.to(user.socketId).emit("groupUpdated", {
//               groupName,
//               members: group.members,
//               admins: group.admins,
//             });
//           }
//         }
//         console.log(`👤 ${username} removed as admin from ${groupName}`);
//       } catch (error) {
//         console.error("Error in removeAdmin:", error);
//         socket.emit("error", { message: "Failed to remove admin." });
//       }
//     });

//     socket.on("removeMember", async ({ groupName, username }) => {
//       try {
//         const requester = (await User.findOne({ socketId: socket.id }))?.username;
//         const group = await Group.findOne({ name: groupName });
//         if (!group) {
//           socket.emit("error", { message: `Group "${groupName}" not found.` });
//           return;
//         }
//         if (!group.admins.includes(requester)) {
//           socket.emit("error", { message: "Only admins can remove members." });
//           return;
//         }
//         if (!group.members.includes(username)) {
//           socket.emit("error", { message: `${username} is not a group member.` });
//           return;
//         }

//         group.members = group.members.filter((m) => m !== username);
//         group.admins = group.admins.filter((a) => a !== username);
//         await group.save();

//         for (const member of group.members) {
//           const user = await User.findOne({ username: member });
//           if (user?.socketId) {
//             io.to(user.socketId).emit("groupUpdated", {
//               groupName,
//               members: group.members,
//               admins: group.admins,
//             });
//           }
//         }

//         const removedUser = await User.findOne({ username });
//         if (removedUser?.socketId) {
//           io.to(removedUser.socketId).emit("removedFromGroup", { groupName });
//         }
//         console.log(`👤 ${username} removed from ${groupName}`);
//       } catch (error) {
//         console.error("Error in removeMember:", error);
//         socket.emit("error", { message: "Failed to remove member." });
//       }
//     });

//     socket.on("exitGroup", async ({ groupName }) => {
//       try {
//         const username = (await User.findOne({ socketId: socket.id }))?.username;
//         const group = await Group.findOne({ name: groupName });
//         if (!group) {
//           socket.emit("error", { message: `Group "${groupName}" not found.` });
//           return;
//         }
//         if (!group.members.includes(username)) {
//           socket.emit("error", { message: "You are not a member of this group." });
//           return;
//         }
//         if (group.admins.includes(username) && group.admins.length === 1 && group.members.length > 1) {
//           socket.emit("error", { message: "Assign another admin before leaving." });
//           return;
//         }

//         group.members = group.members.filter((m) => m !== username);
//         group.admins = group.admins.filter((a) => a !== username);
//         await group.save();

//         for (const member of group.members) {
//           const user = await User.findOne({ username: member });
//           if (user?.socketId) {
//             io.to(user.socketId).emit("groupUpdated", {
//               groupName,
//               members: group.members,
//               admins: group.admins,
//             });
//           }
//         }

//         socket.emit("removedFromGroup", { groupName });
//         console.log(`👤 ${username} exited ${groupName}`);
//       } catch (error) {
//         console.error("Error in exitGroup:", error);
//         socket.emit("error", { message: "Failed to exit group." });
//       }
//     });

//     socket.on("fetchMessages", async ({ type, target }) => {
//       try {
//         const user = await User.findOne({ socketId: socket.id });
//         if (!user) return;

//         let messages;
//         if (type === "private") {
//           messages = await Message.find({
//             type: "private",
//             $or: [
//               { sender: user.username, receiver: target },
//               { sender: target, receiver: user.username },
//             ],
//           }).sort({ timestamp: 1 });
//         } else {
//           messages = await Message.find({
//             type: "group",
//             receiver: target,
//           }).sort({ timestamp: 1 });
//         }

//         socket.emit("messageHistory", messages.map((m) => ({
//           sender: m.sender === user.username ? "You" : m.sender,
//           text: m.text,
//           groupName: m.type === "group" ? m.receiver : undefined,
//         })));
//       } catch (error) {
//         console.error("Error in fetchMessages:", error);
//       }
//     });

//     socket.on("disconnect", async () => {
//       try {
//         const user = await User.findOneAndUpdate(
//           { socketId: socket.id },
//           { socketId: null, online: false }
//         );
//         if (user) {
//           console.log(`❌ ${user.username} disconnected`);
//           io.emit("userStatus", { username: user.username, online: false });
//           const users = await User.find().select("username online");
//           io.emit("userList", users.map((u) => ({ username: u.username, online: u.online })));
//         }
//       } catch (error) {
//         console.error("Error in disconnect:", error);
//       }
//     });
//   });
// };

const User = require("./models/User");
const Group = require("./models/Group");
const Message = require("./models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    socket.on("join", async (username) => {
      try {
        await User.findOneAndUpdate(
          { username },
          { socketId: socket.id, online: true, username },
          { upsert: true, new: true }
        );

        const users = await User.find().select("username online");
        io.emit("userList", users.map((u) => ({ username: u.username, online: u.online })));
        io.emit("userStatus", { username, online: true });

        const groups = await Group.find({ members: username }).select("name members admins");
        socket.emit("groupList", groups.map((g) => ({ name: g.name, members: g.members, admins: g.admins })));

        console.log(`👤 ${username} joined`);
      } catch (error) {
        console.error("Error in join:", error);
      }
    });

    socket.on("privateMessage", async ({ toUsername, text }) => {
      try {
        const sender = (await User.findOne({ socketId: socket.id }))?.username;
        const target = await User.findOne({ username: toUsername });

        if (sender && target) {
          await Message.create({
            type: "private",
            sender,
            receiver: toUsername,
            text,
          });

          io.to(target.socketId).emit("privateMessage", { sender, text });
          io.to(socket.id).emit("privateMessage", { sender: "You", text });
        }
      } catch (error) {
        console.error("Error in privateMessage:", error);
      }
    });

    socket.on("createGroup", async ({ groupName, members }) => {
      try {
        if (await Group.findOne({ name: groupName })) {
          socket.emit("error", { message: `Group "${groupName}" already exists.` });
          return;
        }

        const creator = (await User.findOne({ socketId: socket.id }))?.username;
        await Group.create({ name: groupName, members, admins: [creator] });

        for (const username of members) {
          const user = await User.findOne({ username });
          if (user?.socketId) {
            io.to(user.socketId).emit("groupCreated", { groupName, members, admins: [creator] });
            const groups = await Group.find({ members: username }).select("name members admins");
            io.to(user.socketId).emit("groupList", groups.map((g) => ({ name: g.name, members: g.members, admins: g.admins })));
          }
        }

        console.log(`👥 Group "${groupName}" created with admin: ${creator}`);
      } catch (error) {
        console.error("Error in createGroup:", error);
        socket.emit("error", { message: "Failed to create group." });
      }
    });

    socket.on("groupMessage", async ({ groupName, sender, text }) => {
      try {
        const group = await Group.findOne({ name: groupName });
        if (group?.members.includes(sender)) {
          await Message.create({
            type: "group",
            sender,
            receiver: groupName,
            text,
          });

          for (const member of group.members) {
            const user = await User.findOne({ username: member });
            if (user?.socketId) {
              io.to(user.socketId).emit("groupMessage", { groupName, sender, text });
            }
          }
        }
      } catch (error) {
        console.error("Error in groupMessage:", error);
      }
    });

    socket.on("addAdmin", async ({ groupName, username }) => {
      try {
        const requester = (await User.findOne({ socketId: socket.id }))?.username;
        const group = await Group.findOne({ name: groupName });
        if (!group) {
          socket.emit("error", { message: `Group "${groupName}" not found.` });
          return;
        }
        if (!group.admins.includes(requester)) {
          socket.emit("error", { message: "Only admins can add new admins." });
          return;
        }
        if (!group.members.includes(username)) {
          socket.emit("error", { message: `${username} is not a group member.` });
          return;
        }
        if (group.admins.includes(username)) {
          socket.emit("error", { message: `${username} is already an admin.` });
          return;
        }

        group.admins.push(username);
        await group.save();

        for (const member of group.members) {
          const user = await User.findOne({ username: member });
          if (user?.socketId) {
            io.to(user.socketId).emit("groupUpdated", {
              groupName,
              members: group.members,
              admins: group.admins,
            });
          }
        }
        console.log(`👤 ${username} added as admin to ${groupName}`);
      } catch (error) {
        console.error("Error in addAdmin:", error);
        socket.emit("error", { message: "Failed to add admin." });
      }
    });

    socket.on("removeAdmin", async ({ groupName, username }) => {
      try {
        const requester = (await User.findOne({ socketId: socket.id }))?.username;
        const group = await Group.findOne({ name: groupName });
        if (!group) {
          socket.emit("error", { message: `Group "${groupName}" not found.` });
          return;
        }
        if (!group.admins.includes(requester)) {
          socket.emit("error", { message: "Only admins can remove admins." });
          return;
        }
        if (!group.admins.includes(username)) {
          socket.emit("error", { message: `${username} is not an admin.` });
          return;
        }
        if (group.admins.length <= 1) {
          socket.emit("error", { message: "Group must have at least one admin." });
          return;
        }

        group.admins = group.admins.filter((admin) => admin !== username);
        await group.save();

        for (const member of group.members) {
          const user = await User.findOne({ username: member });
          if (user?.socketId) {
            io.to(user.socketId).emit("groupUpdated", {
              groupName,
              members: group.members,
              admins: group.admins,
            });
          }
        }
        console.log(`👤 ${username} removed as admin from ${groupName}`);
      } catch (error) {
        console.error("Error in removeAdmin:", error);
        socket.emit("error", { message: "Failed to remove admin." });
      }
    });

    socket.on("removeMember", async ({ groupName, username }) => {
      try {
        const requester = (await User.findOne({ socketId: socket.id }))?.username;
        const group = await Group.findOne({ name: groupName });
        if (!group) {
          socket.emit("error", { message: `Group "${groupName}" not found.` });
          return;
        }
        if (!group.admins.includes(requester)) {
          socket.emit("error", { message: "Only admins can remove members." });
          return;
        }
        if (!group.members.includes(username)) {
          socket.emit("error", { message: `${username} is not a group member.` });
          return;
        }

        group.members = group.members.filter((m) => m !== username);
        group.admins = group.admins.filter((a) => a !== username);
        await group.save();

        for (const member of group.members) {
          const user = await User.findOne({ username: member });
          if (user?.socketId) {
            io.to(user.socketId).emit("groupUpdated", {
              groupName,
              members: group.members,
              admins: group.admins,
            });
          }
        }

        const removedUser = await User.findOne({ username });
        if (removedUser?.socketId) {
          io.to(removedUser.socketId).emit("removedFromGroup", { groupName });
        }
        console.log(`👤 ${username} removed from ${groupName}`);
      } catch (error) {
        console.error("Error in removeMember:", error);
        socket.emit("error", { message: "Failed to remove member." });
      }
    });

    socket.on("exitGroup", async ({ groupName }) => {
      try {
        const username = (await User.findOne({ socketId: socket.id }))?.username;
        const group = await Group.findOne({ name: groupName });
        if (!group) {
          socket.emit("error", { message: `Group "${groupName}" not found.` });
          return;
        }
        if (!group.members.includes(username)) {
          socket.emit("error", { message: "You are not a member of this group." });
          return;
        }
        if (group.admins.includes(username) && group.admins.length === 1 && group.members.length > 1) {
          socket.emit("error", { message: "Assign another admin before leaving." });
          return;
        }

        group.members = group.members.filter((m) => m !== username);
        group.admins = group.admins.filter((a) => a !== username);
        await group.save();

        for (const member of group.members) {
          const user = await User.findOne({ username: member });
          if (user?.socketId) {
            io.to(user.socketId).emit("groupUpdated", {
              groupName,
              members: group.members,
              admins: group.admins,
            });
          }
        }

        socket.emit("removedFromGroup", { groupName });
        console.log(`👤 ${username} exited ${groupName}`);
      } catch (error) {
        console.error("Error in exitGroup:", error);
        socket.emit("error", { message: "Failed to exit group." });
      }
    });

    socket.on("fetchMessages", async ({ type, target }) => {
      try {
        const user = await User.findOne({ socketId: socket.id });
        if (!user) return;

        let messages;
        if (type === "private") {
          messages = await Message.find({
            type: "private",
            $or: [
              { sender: user.username, receiver: target },
              { sender: target, receiver: user.username },
            ],
          }).sort({ timestamp: 1 });
        } else {
          messages = await Message.find({
            type: "group",
            receiver: target,
          }).sort({ timestamp: 1 });
        }

        socket.emit("messageHistory", messages.map((m) => ({
          sender: m.sender === user.username ? "You" : m.sender,
          text: m.text,
          groupName: m.type === "group" ? m.receiver : undefined,
        })));
      } catch (error) {
        console.error("Error in fetchMessages:", error);
      }
    });

    socket.on("disconnect", async () => {
      try {
        const user = await User.findOneAndUpdate(
          { socketId: socket.id },
          { socketId: null, online: false }
        );
        if (user) {
          console.log(`❌ ${user.username} disconnected`);
          io.emit("userStatus", { username: user.username, online: false });
          const users = await User.find().select("username online");
          io.emit("userList", users.map((u) => ({ username: u.username, online: u.online })));
        }
      } catch (error) {
        console.error("Error in disconnect:", error);
      }
    });
  });
};