
'use client';

import { useState, useEffect, useRef } from "react";
import socket from "@/app/utils/socket";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [mode, setMode] = useState("private");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [groupMap, setGroupMap] = useState({});
  const [showGroupCreation, setShowGroupCreation] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Map());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const messagesEndRef = useRef(null);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");
    const savedPhoneNumber = localStorage.getItem("phoneNumber");
    if (token && savedUsername) {
      setIsAuthenticated(true);
      setUsername(savedUsername);
      setPhoneNumber(savedPhoneNumber || "");
      connectSocket(token);
      socket.emit("fetchGroups");
    }
  }, []);

  const connectSocket = (token) => {
    socket.auth = { token };
    socket.connect();
  };

  // Socket event listeners
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("fetchMessages", { type: "private", target: receiver });
      socket.emit("fetchGroups");
    });

    socket.on("userList", (data) => {
      setUsers(data.map((u) => u.username));
      setOnlineUsers(new Map(data.map((u) => [u.username, u.online])));
    });

    socket.on("userStatus", ({ username, online }) => {
      setOnlineUsers((prev) => new Map(prev).set(username, online));
    });

    socket.on("groupList", (groups) => {
      setJoinedGroups(groups.map((g) => g.name));
      setGroupMap(
        Object.fromEntries(groups.map((g) => [g.name, { members: g.members, admins: g.admins || [] }]))
      );
    });

    socket.on("privateMessage", ({ _id, sender, text, seenBy = [], isDeleted }) => {
      setMessages((prev) => [...prev, { _id, sender, text, seenBy: seenBy || [], isDeleted }]);
    });

    socket.on("groupMessage", ({ _id, groupName, sender, text, seenBy = [], isDeleted }) => {
      setMessages((prev) => [
        ...prev,
        { _id, sender: `[${groupName}] ${sender}`, text, seenBy: seenBy || [], isDeleted },
      ]);
    });

    socket.on("groupCreated", ({ groupName, members, admins }) => {
      setJoinedGroups((prev) => {
        if (!prev.includes(groupName)) return [...prev, groupName];
        return prev;
      });
      setGroupMap((prev) => ({
        ...prev,
        [groupName]: { members, admins },
      }));
      setNotification(`You were added to group: ${groupName}`);
      setTimeout(() => setNotification(""), 3000);
    });

    socket.on("groupUpdated", ({ groupName, members, admins }) => {
      setGroupMap((prev) => ({
        ...prev,
        [groupName]: { members, admins },
      }));
      setJoinedGroups((prev) => {
        if (members.includes(username)) return prev;
        return prev.filter((g) => g !== groupName);
      });
    });

    socket.on("removedFromGroup", ({ groupName: removedGroup }) => {
      setJoinedGroups((prev) => prev.filter((g) => g !== removedGroup));
      setGroupMap((prev) => {
        const newMap = { ...prev };
        delete newMap[removedGroup];
        return newMap;
      });
      if (groupName === removedGroup) {
        setGroupName("");
        setMessages([]);
        setNotification(`You were removed from group: ${removedGroup}`);
        setTimeout(() => setNotification(""), 3000);
      }
    });

    socket.on("messageHistory", (history) => {
      setMessages(history.map((msg) => ({ ...msg, seenBy: msg.seenBy || [] })));
    });

    socket.on("messageSeen", ({ messageId, seenBy }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, seenBy: seenBy || [] } : msg
        )
      );
    });

    socket.on("messageUnsent", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, isDeleted: true, text: "This message was deleted" }
            : msg
        )
      );
    });

    socket.on("usernameUpdated", (newUsername) => {
      setUsername(newUsername);
      localStorage.setItem("username", newUsername);
      setNotification("Username updated successfully");
      setTimeout(() => setNotification(""), 3000);
    });

    socket.on("error", ({ message }) => {
      setError(message);
      setTimeout(() => setError(""), 3000);
      if (message === "Selected group is invalid or you were removed" && groupName) {
        setJoinedGroups((prev) => prev.filter((g) => g !== groupName));
        setGroupMap((prev) => {
          const newMap = { ...prev };
          delete newMap[groupName];
          return newMap;
        });
        setGroupName("");
        setMessages([]);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("userList");
      socket.off("userStatus");
      socket.off("groupList");
      socket.off("privateMessage");
      socket.off("groupMessage");
      socket.off("groupCreated");
      socket.off("groupUpdated");
      socket.off("removedFromGroup");
      socket.off("messageHistory");
      socket.off("messageSeen");
      socket.off("messageUnsent");
      socket.off("usernameUpdated");
      socket.off("error");
    };
  }, [username, groupName, receiver]);

  // Mark messages as seen
  useEffect(() => {
    if ((mode === "private" && receiver) || (mode === "group" && groupName)) {
      messages.forEach((msg) => {
        if (
          !msg.isDeleted &&
          Array.isArray(msg.seenBy) &&
          !msg.seenBy.includes(username) &&
          msg.sender !== "You"
        ) {
          socket.emit("markMessageSeen", { messageId: msg._id });
        }
      });
    }
  }, [messages, mode, receiver, groupName, username]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAuth = async () => {
    try {
      const endpoint = isSignup ? "/signup" : "/login";
      const payload = isSignup ? { username, phoneNumber, password } : { phoneNumber, password };
      if (isSignup && (!phoneNumber || !/^\d{10}$/.test(phoneNumber))) {
        setError("Phone number must be exactly 10 digits");
        setTimeout(() => setError(""), 3000);
        return;
      }
      const { data } = await axios.post(`http://localhost:5000/api/auth${endpoint}`, payload);
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("phoneNumber", data.phoneNumber || "");
      setIsAuthenticated(true);
      setUsername(data.username);
      setPhoneNumber(data.phoneNumber || "");
      connectSocket(data.token);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const payload = {};
      if (newUsername && newUsername !== username) payload.username = newUsername;
      if (newPhoneNumber && newPhoneNumber !== phoneNumber) {
        if (!/^\d{10}$/.test(newPhoneNumber)) {
          setError("Phone number must be exactly 10 digits");
          setTimeout(() => setError(""), 3000);
          return;
        }
        payload.phoneNumber = newPhoneNumber;
      }
      if (newPassword) {
        payload.password = newPassword;
        payload.currentPassword = currentPassword;
      }
      if (Object.keys(payload).length === 0) {
        setError("No changes provided");
        setTimeout(() => setError(""), 3000);
        return;
      }

      const { data } = await axios.put(
        "http://localhost:5000/api/auth/profile",
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("phoneNumber", data.phoneNumber);
      setUsername(data.username);
      setPhoneNumber(data.phoneNumber);
      setNewUsername("");
      setNewPhoneNumber("");
      setNewPassword("");
      setCurrentPassword("");
      setShowProfile(false);
      setNotification("Profile updated successfully");
      setTimeout(() => setNotification(""), 3000);

      // Notify Socket.IO of username change
      if (payload.username) {
        socket.emit("updateUsername", data.username);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      setTimeout(() => setError(""), 3000);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("phoneNumber");
    socket.disconnect();
    setIsAuthenticated(false);
    setUsername("");
    setPhoneNumber("");
    setMode("private");
    setMessages([]);
    setGroupName("");
    setGroupMembers([]);
    setReceiver("");
    setGroupMap({});
    setJoinedGroups([]);
    setOnlineUsers(new Map());
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    if (mode === "private" && receiver) {
      socket.emit("privateMessage", { toUsername: receiver, text: message });
    } else if (mode === "group" && groupName) {
      socket.emit("groupMessage", { groupName, text: message });
    }
    setMessage("");
  };

  const unsendMessage = (messageId) => {
    socket.emit("unsendMessage", { messageId });
  };

  const createGroup = () => {
    if (!groupName.trim() || groupMembers.length < 2) {
      setError("Group name and at least 2 members required.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    const members = [...new Set([...groupMembers, username])];
    socket.emit("createGroup", { groupName, members });
    setShowGroupCreation(false);
    setGroupMembers([]);
    setGroupName("");
    setSearchQuery("");
  };

  const selectChat = (type, name) => {
    setMessages([]);
    if (type === "private") {
      setMode("private");
      setReceiver(name);
      setGroupName("");
      socket.emit("fetchMessages", { type: "private", target: name });
    } else {
      setMode("group");
      setGroupName(name);
      setReceiver("");
      socket.emit("fetchMessages", { type: "group", target: name });
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const addAdmin = (targetUsername) => {
    socket.emit("addAdmin", { groupName, targetUsername });
  };

  const removeAdmin = (targetUsername) => {
    socket.emit("removeAdmin", { groupName, targetUsername });
  };

  const removeMember = (targetUsername) => {
    socket.emit("removeMember", { groupName, targetUsername });
  };

  const addMembers = (newMember) => {
    socket.emit("addMembers", { groupName, newMembers: [newMember] });
  };

  const exitGroup = () => {
    socket.emit("exitGroup", { groupName });
  };

  const getAvatar = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  const getMessageStatus = (msg) => {
    if (msg.isDeleted || msg.sender !== "You") return null;
    if (mode === "private") {
      return msg.seenBy.includes(receiver) ? (
        <span className="text-blue-500">✔✔</span>
      ) : (
        <span className="text-gray-500">✔✔</span>
      );
    } else {
      const groupMembers = Array.isArray(groupMap[groupName]?.members)
        ? groupMap[groupName].members.filter((m) => m !== username)
        : [];
      const seenCount = Array.isArray(msg.seenBy)
        ? msg.seenBy.filter((u) => groupMembers.includes(u)).length
        : 0;
      return (
        <span className={seenCount === groupMembers.length ? "text-blue-500" : "text-gray-500"}>
          Seen by {seenCount}/{groupMembers.length}
        </span>
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all hover:scale-105">
          <h1 className="text-3xl font-bold text-center text-green-600 mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
            </svg>
            Chat App
          </h1>
          <input
            type="tel"
            className="w-full border-2 border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            placeholder="Phone Number (10 digits)"
            value={phoneNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              setPhoneNumber(value);
            }}
            maxLength={10}
            data-testid="phone-number-input"
          />
          {isSignup && (
            <input
              className="w-full border-2 border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-testid="username-input"
            />
          )}
          <input
            type="password"
            className="w-full border-2 border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="password-input"
          />
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <button
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105"
            onClick={handleAuth}
            data-testid={isSignup ? "signup-button" : "login-button"}
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
          <button
            className="w-full text-green-600 mt-2 hover:underline"
            onClick={() => setIsSignup(!isSignup)}
            data-testid="toggle-auth-button"
          >
            {isSignup ? "Already have an account? Login" : "Need an account? Sign Up"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col shadow-lg">
        <div className="bg-gradient-to-r from-green-600 to-teal-500 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 font-bold">
              {getAvatar(username)}
            </div>
            <h2 className="text-white font-semibold text-lg ml-3">{username}</h2>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setShowProfile(true)}
              className="text-white hover:text-gray-200 transition mr-2"
              data-testid="profile-button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <button
              onClick={logout}
              className="text-white hover:text-gray-200 transition"
              data-testid="logout-button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setMode("private")}
            className={`flex-1 p-3 ${mode === "private" ? "bg-green-100 text-green-600" : "text-gray-600"} font-semibold`}
            data-testid="private-tab"
          >
            Chats
          </button>
          <button
            onClick={() => setMode("group")}
            className={`flex-1 p-3 ${mode === "group" ? "bg-green-100 text-green-600" : "text-gray-600"} font-semibold`}
            data-testid="group-tab"
          >
            Groups
          </button>
        </div>
        {mode === "group" && (
          <button
            onClick={() => setShowGroupCreation(true)}
            className="bg-green-600 text-white p-3 mx-4 my-2 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105"
            data-testid="new-group-button"
          >
            New Group
          </button>
        )}
        <div className="flex-1 overflow-y-auto">
          {mode === "private"
            ? users
                .filter((u) => u !== username)
                .map((user, i) => (
                  <div
                    key={i}
                    onClick={() => selectChat("private", user)}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-all ${
                      receiver === user ? "bg-gray-100" : ""
                    }`}
                    data-testid={`user-${user}`}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-600 font-semibold">
                        {getAvatar(user)}
                      </div>
                      <p className="font-medium ml-3 flex-1">{user}</p>
                      <span
                        className={`w-3 h-3 rounded-full ${onlineUsers.get(user) ? "bg-green-500" : "bg-gray-400"}`}
                        data-testid={`status-${user}`}
                      ></span>
                    </div>
                  </div>
                ))
            : joinedGroups.map((group, i) => (
                <div
                  key={i}
                  onClick={() => selectChat("group", group)}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-all ${
                    groupName === group ? "bg-gray-100" : ""
                  }`}
                  data-testid={`group-${group}`}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-teal-200 rounded-full flex items-center justify-center text-teal-600 font-semibold">
                      {getAvatar(group)}
                    </div>
                    <p className="font-medium ml-3">{group}</p>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {notification && (
          <div className="fixed top-4 right-4 bg-green-600 text-white p-3 rounded-lg shadow-lg animate-slide-in">
            {notification}
          </div>
        )}
        {(receiver || groupName) && (
          <>
            <div className="bg-gradient-to-r from-green-600 to-teal-500 p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 font-bold">
                  {getAvatar(mode === "private" ? receiver : groupName)}
                </div>
                <h2 className="text-white font-semibold text-lg ml-3">
                  {mode === "private" ? receiver : groupName}
                </h2>
              </div>
              {mode === "group" && groupName && (
                <div className="text-white text-sm">
                  Members: {(groupMap[groupName]?.members || []).map((m) => (
                    <span key={m}>
                      {m}
                      {groupMap[groupName]?.admins.includes(m) ? " (Admin)" : ""}
                      {", "}
                    </span>
                  ))}
                  {groupMap[groupName]?.admins.includes(username) && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <select
                        onChange={(e) => {
                          const target = e.target.value;
                          if (target) addAdmin(target);
                          e.target.value = "";
                        }}
                        className="bg-white text-black p-1 rounded shadow-sm"
                        data-testid="add-admin-select"
                      >
                        <option value="">Add Admin</option>
                        {groupMap[groupName]?.members
                          .filter((m) => !groupMap[groupName]?.admins.includes(m))
                          .map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                      </select>
                      <select
                        onChange={(e) => {
                          const target = e.target.value;
                          if (target) removeAdmin(target);
                          e.target.value = "";
                        }}
                        className="bg-white text-black p-1 rounded shadow-sm"
                        data-testid="remove-admin-select"
                      >
                        <option value="">Remove Admin</option>
                        {groupMap[groupName]?.admins
                          .filter((m) => m !== username)
                          .map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                      </select>
                      <select
                        onChange={(e) => {
                          const target = e.target.value;
                          if (target) removeMember(target);
                          e.target.value = "";
                        }}
                        className="bg-white text-black p-1 rounded shadow-sm"
                        data-testid="remove-member-select"
                      >
                        <option value="">Remove Member</option>
                        {groupMap[groupName]?.members
                          .filter((m) => m !== username)
                          .map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                      </select>
                      <select
                        onChange={(e) => {
                          const target = e.target.value;
                          if (target) addMembers(target);
                          e.target.value = "";
                        }}
                        className="bg-white text-black p-1 rounded shadow-sm"
                        data-testid="add-members-select"
                      >
                        <option value="">Add Members</option>
                        {users
                          .filter((u) => !groupMap[groupName]?.members.includes(u) && u !== username)
                          .map((u) => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                      </select>
                    </div>
                  )}
                  <button
                    onClick={exitGroup}
                    className="bg-red-600 text-white p-1 rounded mt-2 shadow-sm hover:bg-red-700 transition"
                    data-testid="exit-group-button"
                  >
                    Exit Group
                  </button>
                </div>
              )}
            </div>
            {error && (
              <div className="bg-red-500 text-white p-2 text-center shadow-md">
                {error}
              </div>
            )}
            <div
              className="flex-1 p-4 overflow-y-auto bg-[url('/images/im.jpeg')] bg-repeat"
            >
              {messages.map((msg, i) => (
                <div
                  key={msg._id || i}
                  className={`mb-4 flex ${
                    msg.sender === "You" ? "justify-end" : "justify-start"
                  } group animate-slide-in relative`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-2xl shadow-md relative ${
                      msg.sender === "You"
                        ? "bg-green-500 text-white before:content-[''] before:absolute before:-right-1 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-3 before:bg-green-500 before:rounded-full before:transform before:-rotate-45"
                        : "bg-white text-gray-800 before:content-[''] before:absolute before:-left-1 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-3 before:bg-white before:rounded-full before:transform before:rotate-45"
                    } ${msg.isDeleted ? "italic opacity-75" : ""}`}
                  >
                    <p className="text-xs font-medium mb-1">
                      {msg.sender.startsWith("[") ? msg.sender : msg.sender}
                    </p>
                    <p>{msg.text}</p>
                    {msg.sender === "You" && !msg.isDeleted && (
                      <button
                        onClick={() => unsendMessage(msg._id)}
                        className="absolute top-2 right-2 text-xs text-red-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                        data-testid={`unsend-${msg._id}`}
                      >
                        Unsend
                      </button>
                    )}
                    {msg.sender === "You" && (
                      <div className="text-xs mt-1 flex justify-end">
                        {getMessageStatus(msg)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="bg-white p-4 border-t border-gray-200 flex items-center relative shadow-inner">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="mr-2 text-2xl hover:scale-110 transition"
                data-testid="emoji-button"
              >
                😊
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-16 left-4 z-10">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                data-testid="message-input"
              />
              <button
                onClick={sendMessage}
                className="ml-2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105"
                data-testid="send-button"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Profile Settings Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl transform transition-all">
            <h2 className="text-2xl font-semibold text-green-600 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Edit Profile
            </h2>
            <input
              type="text"
              placeholder="New Username"
              className="w-full border-2 border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              data-testid="new-username-input"
            />
            <input
              type="tel"
              placeholder="New Phone Number (10 digits)"
              className="w-full border-2 border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              value={newPhoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setNewPhoneNumber(value);
              }}
              maxLength={10}
              data-testid="new-phone-number-input"
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full border-2 border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              data-testid="new-password-input"
            />
            {newPassword && (
              <input
                type="password"
                placeholder="Current Password"
                className="w-full border-2 border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                data-testid="current-password-input"
              />
            )}
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowProfile(false);
                  setNewUsername("");
                  setNewPhoneNumber("");
                  setNewPassword("");
                  setCurrentPassword("");
                  setError("");
                }}
                className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105"
                data-testid="cancel-profile-button"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105"
                data-testid="save-profile-button"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Creation Modal */}
      {showGroupCreation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl transform transition-all">
            <h2 className="text-2xl font-semibold text-green-600 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              New Group
            </h2>
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center mr-3 shadow-sm">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Group name"
                className="flex-1 border-0 border-b-2 border-gray-300 p-2 focus:outline-none focus:border-green-500 transition"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                data-testid="group-name-input"
              />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="w-full border-2 border-gray-300 p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="search-users-input"
            />
            <div className="border p-3 rounded-lg h-32 overflow-y-auto mb-4 shadow-inner">
              <p className="font-medium mb-2">Select Members:</p>
              {users
                .filter((u) => u !== username && u.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((user, i) => (
                  <label key={i} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      value={user}
                      checked={groupMembers.includes(user)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setGroupMembers([...groupMembers, user]);
                        } else {
                          setGroupMembers(groupMembers.filter((u) => u !== user));
                        }
                      }}
                      className="mr-2 accent-green-500"
                      data-testid={`member-checkbox-${user}`}
                    />
                    <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-green-600 font-semibold mr-2">
                      {getAvatar(user)}
                    </div>
                    {user}
                  </label>
                ))}
            </div>
            {error && (
              <div className="text-red-500 text-sm mb-2">{error}</div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowGroupCreation(false);
                  setGroupMembers([]);
                  setGroupName("");
                  setSearchQuery("");
                  setError("");
                }}
                className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105"
                data-testid="cancel-group-button"
              >
                Cancel
              </button>
              <button
                onClick={createGroup}
                className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105"
                data-testid="create-group-button"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}