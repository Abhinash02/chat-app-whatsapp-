const User = require("./models/User");
const Message = require("./models/Message");
const Group = require("./models/Group");

module.exports = (io) => {
  io.on("connection", (socket) => {
    const { username } = socket.user;
    console.log(`New client connected: ${username}`);

    // Update user status
    User.findOneAndUpdate(
      { username },
      { online: true },
      { new: true }
    ).then(async () => {
      socket.join(username); // Join personal room

      // Send user list
      const users = await User.find();
      io.emit("userList", users);

      // Send group list
      const groups = await Group.find({ members: username });
      socket.emit("groupList", groups);
    });

    socket.on("fetchGroups", async () => {
      try {
        const groups = await Group.find({ members: username });
        socket.emit("groupList", groups);
      } catch (err) {
        console.error(err);
        socket.emit("error", { message: "Failed to fetch groups" });
      }
    });

    socket.on("privateMessage", async ({ toUsername, text }) => {
      try {
        const message = await Message.create({
          type: "private",
          sender: username,
          receiver: toUsername,
          text,
          seenBy: [],
        });

        io.to(toUsername).emit("privateMessage", message);
        socket.emit("privateMessage", { ...message.toObject(), sender: "You" });
      } catch (err) {
        console.error(err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("groupMessage", async ({ groupName, text }) => {
      try {
        const group = await Group.findOne({ name: groupName });
        if (!group || !group.members.includes(username)) {
          return socket.emit("error", { message: "Selected group is invalid or you were removed" });
        }

        const message = await Message.create({
          type: "group",
          sender: username,
          groupName,
          text,
          seenBy: [],
        });

        group.members.forEach((member) => {
          io.to(member).emit("groupMessage", message);
        });
      } catch (err) {
        console.error(err);
        socket.emit("error", { message: "Failed to send group message" });
      }
    });

    socket.on("createGroup", async ({ groupName, members }) => {
      try {
        if (!members.includes(username)) members.push(username);
        const group = await Group.create({
          name: groupName,
          members,
          admins: [username],
        });

        members.forEach((member) => {
          io.to(member).emit("groupCreated", {
            groupName,
            members,
            admins: [username],
          });
        });
      } catch (err) {
        console.error(err);
        socket.emit("error", { message: "Failed to create group" });
      }
    });

    socket.on("addMembers", async ({ groupName, newMembers }) => {
      try {
        const group = await Group.findOne({ name: groupName });
        if (!group || !group.admins.includes(username)) {
          return socket.emit("error", { message: "Only admins can add members" });
        }

        const updatedMembers = [...new Set([...group.members, ...newMembers])];
        group.members = updatedMembers;
        await group.save();

        updatedMembers.forEach((member) => {
          io.to(member).emit("groupUpdated", {
            groupName,
            members: updatedMembers,
            admins: group.admins,
          });
        });

        newMembers.forEach((member) => {
          io.to(member).emit("groupCreated", {
            groupName,
            members: updatedMembers,
            admins: group.admins,
          });
        });
      } catch (err) {
        console.error(err);
        socket.emit("error", { message: "Failed to add members" });
      }
    });

    socket.on("addAdmin", async ({ groupName, targetUsername }) => {
      try {
        const group = await Group.findOne({ name: groupName });
        if (!group || !group.admins.includes(username)) {
          return socket.emit("error", { message: "Only admins can add admins" });
        }
        if (!group.members.includes(targetUsername)) {
          return socket.emit("error", { message: "User is not a member" });
        }

        group.admins = [...new Set([...group.admins, targetUsername])];
        await group.save();

        group.members.forEach((member) => {
          io.to(member).emit("groupUpdated", {
            groupName,
            members: group.members,
            admins: group.admins,
          });
        });
      } catch (err) {
        console.error(err);
        socket.emit("error", { message: "Failed to add admin" });
      }
    });

    socket.on("removeAdmin", async ({ groupName, targetUsername }) => {
      try {
        const group = await Group.findOne({ name: groupName });
        if (!group || !group.admins.includes(username)) {
          return socket.emit("error", { message: "Only admins can remove admins" });
        }
        if (username === targetUsername) {
          return socket.emit("error", { message: "Cannot remove yourself as admin" });
        }

        group.admins = group.admins.filter((admin) => admin !== targetUsername);
        await group.save();

        group.members.forEach((member) => {
          io.to(member).emit("groupUpdated", {
            groupName,
            members: group.members,
            admins: group.admins,
          });
        });
      } catch (err) {
        console.error(err);
        socket.emit("error", { message: "Failed to remove admin" });
      }
    });

    socket.on("removeMember", async ({ groupName, targetUsername }) => {
      try {
        const group = await Group.findOne({ name: groupName });
        if (!group || !group.admins.includes(username)) {
          return socket.emit("error", { message: "Only admins can remove members" });
        }
        if (username === targetUsername) {
          return socket.emit("error", { message: "Use exitGroup to leave" });
        }

        group.members = group.members.filter((member) => member !== targetUsername);
        group.admins = group.admins.filter((admin) => admin !== targetUsername);
        await group.save();

        io.to(targetUsername).emit("removedFromGroup", { groupName });
        group.members.forEach((member) => {
          io.to(member).emit("groupUpdated", {
            groupName,
            members: group.members,
            admins: group.admins,
          });
        });
      } catch (err) {
        console.error(err);
        socket.emit("error", { message: "Failed to remove member" });
      }
    });

    socket.on("exitGroup", async ({ groupName }) => {
      try {
        const group = await Group.findOne({ name: groupName });
        if (!group || !group.members.includes(username)) {
          return socket.emit("error", { message: "Not a member of this group" });
        }

        group.members = group.members.filter((member) => member !== username);
        group.admins = group.admins.filter((admin) => admin !== username);
        await group.save();

        socket.emit("removedFromGroup", { groupName });
        group.members.forEach((member) => {
          io.to(member).emit("groupUpdated", {
            groupName,
            members: group.members,
            admins: group.admins,
          });
        });
      } catch (err) {
        console.error(err);
        socket.emit("error", { message: "Failed to exit group" });
      }
    });

    socket.on("fetchMessages", async ({ type, target }) => {
      try {
        let messages;
        if (type === "private") {
          messages = await Message.find({
            type: "private",
            $or: [
              { sender: username, receiver: target },
              { sender: target, receiver: username },
            ],
          });
        } else {
          const group = await Group.findOne({ name: target });
          if (!group || !group.members.includes(username)) {
            return socket.emit("error", { message: "Selected group is invalid or you were removed" });
          }
          messages = await Message.find({ type: "group", groupName: target });
        }
        socket.emit("messageHistory", messages);
      } catch (err) {
        console.error(err);
        socket.emit("error", { message: "Failed to fetch messages" });
      }
    });

    socket.on("markMessageSeen", async ({ messageId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message || message.isDeleted) return;

        if (!message.seenBy.includes(username)) {
          message.seenBy.push(username);
          await message.save();

          if (message.type === "private") {
            io.to(message.sender).to(message.receiver).emit("messageSeen", {
              messageId,
              seenBy: message.seenBy,
            });
          } else {
            const group = await Group.findOne({ name: message.groupName });
            if (group) {
              group.members.forEach((member) => {
                io.to(member).emit("messageSeen", {
                  messageId,
                  seenBy: message.seenBy,
                });
              });
            }
          }
        }
      } catch (err) {
        console.error(err);
        socket.emit("error", { message: "Failed to mark message as seen" });
      }
    });

    socket.on("unsendMessage", async ({ messageId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message || message.sender !== username) {
          return socket.emit("error", { message: "Cannot unsend this message" });
        }

        message.isDeleted = true;
        message.text = "This message was deleted";
        await message.save();

        if (message.type === "private") {
          io.to(message.sender).to(message.receiver).emit("messageUnsent", { messageId });
        } else {
          const group = await Group.findOne({ name: message.groupName });
          if (group) {
            group.members.forEach((member) => {
              io.to(member).emit("messageUnsent", { messageId });
            });
          }
        }
      } catch (err) {
        console.error(err);
        socket.emit("error", { message: "Failed to unsend message" });
      }
    });

    socket.on("disconnect", async () => {
      try {
        await User.findOneAndUpdate({ username }, { online: false });
        io.emit("userStatus", { username, online: false });
        console.log(`Client disconnected: ${username}`);
      } catch (err) {
        console.error(err);
      }
    });
  });
};