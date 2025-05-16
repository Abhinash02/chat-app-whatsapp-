"use client";
import { useEffect, useState } from "react";
import socket from "@/src/utils/socket";

export default function ChatPage() {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("user2");

  const userId = "user1"; // Hardcoded for demo
  const room = "group1";

  useEffect(() => {
    socket.emit("join", { userId });
    socket.emit("join_room", room);

    socket.on("private_message", (data) => {
      setChat((prev) => [...prev, { ...data, type: "private" }]);
    });

    socket.on("group_message", (data) => {
      setChat((prev) => [...prev, { ...data, type: "group" }]);
    });

    return () => {
      socket.off("private_message");
      socket.off("group_message");
    };
  }, []);

  const sendPrivate = () => {
    if (message.trim())
      socket.emit("private_message", { to: recipient, from: userId, message });
    setMessage("");
  };

  const sendGroup = () => {
    if (message.trim())
      socket.emit("group_message", { room, from: userId, message });
    setMessage("");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Realtime Chat (No DB)</h1>
      <div className="my-4">
        {chat.map((msg, i) => (
          <div key={i} className="mb-2">
            [{msg.type}] <strong>{msg.from}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <input
        placeholder="Recipient for private msg (user2)"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="border px-2 py-1 mr-2"
      />
      <input
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border px-2 py-1 mr-2"
      />
      <button onClick={sendPrivate} className="bg-blue-500 text-white px-3 py-1 mr-2">Send Private</button>
      <button onClick={sendGroup} className="bg-green-500 text-white px-3 py-1">Send Group</button>
    </div>
  );
}
