// // // 'use client';

// // // import { useEffect, useState } from "react";
// // // import socket from "@/app/utils/socket"; // ✅ correct


// // // export default function HomePage() {
// // //   const [username, setUsername] = useState("");
// // //   const [joined, setJoined] = useState(false);
// // //   const [message, setMessage] = useState("");
// // //   const [messages, setMessages] = useState([]);
// // //   const [users, setUsers] = useState([]);

// // //   useEffect(() => {
// // //     socket.on("message", (data) => {
// // //       setMessages((prev) => [...prev, data]);
// // //     });

// // //     socket.on("userList", (data) => {
// // //       setUsers(data);
// // //     });

// // //     return () => {
// // //       socket.off("message");
// // //       socket.off("userList");
// // //     };
// // //   }, []);

// // //   const sendMessage = () => {
// // //     if (message.trim()) {
// // //       socket.emit("message", message);
// // //       setMessage("");
// // //     }
// // //   };

// // //   const joinChat = () => {
// // //     if (username.trim()) {
// // //       socket.emit("join", username);
// // //       setJoined(true);
// // //     }
// // //   };

// // //   return (
// // //     <main className="p-4">
// // //       {!joined ? (
// // //         <div className="space-y-2">
// // //           <input
// // //             type="text"
// // //             placeholder="Enter your name"
// // //             value={username}
// // //             onChange={(e) => setUsername(e.target.value)}
// // //             className="border p-2"
// // //           />
// // //           <button onClick={joinChat} className="bg-blue-500 text-white px-4 py-2">
// // //             Join Chat
// // //           </button>
// // //         </div>
// // //       ) : (
// // //         <div className="space-y-4">
// // //           <div className="border p-2 h-64 overflow-y-scroll bg-gray-50">
// // //             {messages.map((msg, i) => (
// // //               <div key={i}><b>{msg.sender}:</b> {msg.text}</div>
// // //             ))}
// // //           </div>

// // //           <input
// // //             type="text"
// // //             placeholder="Type a message"
// // //             value={message}
// // //             onChange={(e) => setMessage(e.target.value)}
// // //             className="border p-2 w-full"
// // //           />
// // //           <button onClick={sendMessage} className="bg-green-500 text-white px-4 py-2">
// // //             Send
// // //           </button>

// // //           <h3>Online Users:</h3>
// // //           <ul>
// // //             {users.map((user, idx) => (
// // //               <li key={idx}>{user}</li>
// // //             ))}
// // //           </ul>
// // //         </div>
// // //       )}
// // //     </main>
// // //   );
// // // }


// // 'use client';

// // import { useEffect, useState, useRef } from "react";
// // import socket from "@/app/utils/socket";

// // export default function HomePage() {
// //   const [username, setUsername] = useState("");
// //   const [joined, setJoined] = useState(false);
// //   const [message, setMessage] = useState("");
// //   const [messages, setMessages] = useState([]);
// //   const [users, setUsers] = useState([]);
// //   const messagesEndRef = useRef(null);

// //   // Scroll to bottom when messages update
// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);

// //   useEffect(() => {
// //     socket.on("message", (data) => {
// //       setMessages((prev) => [...prev, data]);
// //     });

// //     socket.on("userList", (data) => {
// //       setUsers(data);
// //     });

// //     return () => {
// //       socket.off("message");
// //       socket.off("userList");
// //     };
// //   }, []);

// //   const sendMessage = () => {
// //     if (message.trim()) {
// //       socket.emit("message", message);
// //       setMessage("");
// //     }
// //   };

// //   const joinChat = () => {
// //     if (username.trim()) {
// //       socket.emit("join", username);
// //       setJoined(true);
// //     }
// //   };

// //   return (
// //     <main className="h-screen flex flex-col bg-gray-100">
// //       {!joined ? (
// //         <div className="flex flex-col items-center justify-center flex-grow p-6 bg-white max-w-md mx-auto rounded-lg shadow-lg">
// //           <h1 className="text-3xl font-bold mb-6 text-blue-600">Join the Chat</h1>
// //           <input
// //             type="text"
// //             placeholder="Enter your name"
// //             value={username}
// //             onChange={(e) => setUsername(e.target.value)}
// //             className="w-full border border-gray-300 rounded px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
// //           />
// //           <button
// //             onClick={joinChat}
// //             className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition"
// //           >
// //             Join Chat
// //           </button>
// //         </div>
// //       ) : (
// //         <div className="flex flex-grow max-w-7xl mx-auto bg-white rounded-lg shadow overflow-hidden m-4">
// //           {/* Sidebar with users */}
// //           <aside className="w-64 bg-blue-50 border-r border-blue-200 flex flex-col">
// //             <div className="p-4 border-b border-blue-200">
// //               <h2 className="text-xl font-semibold text-blue-700">Online Users</h2>
// //               <p className="text-sm text-blue-600 mt-1">{users.length} user{users.length !== 1 ? 's' : ''}</p>
// //             </div>
// //             <ul className="flex-grow overflow-y-auto p-4 space-y-2">
// //               {users.map((user, idx) => (
// //                 <li
// //                   key={idx}
// //                   className={`px-3 py-2 rounded cursor-default truncate
// //                     ${user === username ? "bg-blue-600 text-white font-bold" : "text-blue-900 bg-blue-100"}
// //                   `}
// //                   title={user}
// //                 >
// //                   {user}
// //                 </li>
// //               ))}
// //             </ul>
// //           </aside>

// //           {/* Chat Area */}
// //           <section className="flex flex-col flex-grow">
// //             {/* Messages */}
// //             <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-gray-50">
// //               {messages.length === 0 && (
// //                 <p className="text-gray-400 text-center mt-20">No messages yet. Start the conversation!</p>
// //               )}

// //               {messages.map((msg, i) => {
// //                 const isMe = msg.sender === username;
// //                 return (
// //                   <div
// //                     key={i}
// //                     className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg break-words
// //                       ${isMe ? "bg-blue-600 text-white self-end" : "bg-white border border-gray-300 text-gray-800"}
// //                     `}
// //                     style={{ alignSelf: isMe ? "flex-end" : "flex-start" }}
// //                   >
// //                     {!isMe && <div className="font-semibold mb-1">{msg.sender}</div>}
// //                     <div>{msg.text}</div>
// //                   </div>
// //                 );
// //               })}
// //               <div ref={messagesEndRef} />
// //             </div>

// //             {/* Message input */}
// //             <form
// //               onSubmit={(e) => {
// //                 e.preventDefault();
// //                 sendMessage();
// //               }}
// //               className="flex p-4 border-t border-gray-300 bg-white"
// //             >
// //               <input
// //                 type="text"
// //                 placeholder="Type your message..."
// //                 value={message}
// //                 onChange={(e) => setMessage(e.target.value)}
// //                 className="flex-grow border border-gray-300 rounded-l px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
// //                 autoComplete="off"
// //               />
// //               <button
// //                 type="submit"
// //                 className="bg-blue-600 text-white px-6 py-3 rounded-r hover:bg-blue-700 transition"
// //               >
// //                 Send
// //               </button>
// //             </form>
// //           </section>
// //         </div>
// //       )}
// //     </main>
// //   );
// // }

// 'use client';

// import { useEffect, useState, useRef } from "react";
// import socket from "@/app/utils/socket";

// export default function HomePage() {
//   const [username, setUsername] = useState("");
//   const [room, setRoom] = useState("");
//   const [joined, setJoined] = useState(false);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [users, setUsers] = useState([]);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     socket.on("message", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     socket.on("userList", (data) => {
//       setUsers(data);
//     });

//     return () => {
//       socket.off("message");
//       socket.off("userList");
//     };
//   }, []);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const joinChat = () => {
//     if (username.trim() && room.trim()) {
//       socket.emit("joinRoom", { username, room });
//       setJoined(true);
//     }
//   };

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (message.trim()) {
//       socket.emit("message", message);
//       setMessage("");
//     }
//   };

//   return (
//     <main className="h-screen flex flex-col bg-gray-100">
//       {!joined ? (
//         <div className="flex flex-col items-center justify-center flex-grow p-6 bg-white max-w-md mx-auto rounded-lg shadow-lg space-y-4">
//           <h1 className="text-3xl font-bold text-blue-600">Join Group Chat</h1>
//           <input
//             type="text"
//             placeholder="Enter your name"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="w-full border px-4 py-2 rounded"
//           />
//           <input
//             type="text"
//             placeholder="Enter group name"
//             value={room}
//             onChange={(e) => setRoom(e.target.value)}
//             className="w-full border px-4 py-2 rounded"
//           />
//           <button
//             onClick={joinChat}
//             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//           >
//             Join Chat
//           </button>
//         </div>
//       ) : (
//         <div className="flex flex-grow max-w-7xl mx-auto bg-white rounded-lg shadow overflow-hidden m-4">
//           {/* Users */}
//           <aside className="w-64 bg-blue-50 border-r border-blue-200">
//             <div className="p-4 border-b">
//               <h2 className="text-xl font-semibold text-blue-700">Room: {room}</h2>
//               <p className="text-sm text-blue-600 mt-1">{users.length} online</p>
//             </div>
//             <ul className="p-4 space-y-2 overflow-y-auto">
//               {users.map((user, idx) => (
//                 <li
//                   key={idx}
//                   className={`px-3 py-2 rounded truncate ${
//                     user === username ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-900"
//                   }`}
//                 >
//                   {user}
//                 </li>
//               ))}
//             </ul>
//           </aside>

//           {/* Chat */}
//           <section className="flex flex-col flex-grow">
//             <div className="flex-grow p-6 space-y-4 overflow-y-auto bg-gray-50">
//               {messages.map((msg, i) => {
//                 const isMe = msg.sender === username;
//                 return (
//                   <div
//                     key={i}
//                     className={`max-w-xs px-4 py-2 rounded-lg break-words ${
//                       msg.sender === "System"
//                         ? "bg-yellow-100 text-gray-800 text-sm italic mx-auto text-center"
//                         : isMe
//                         ? "bg-blue-600 text-white self-end"
//                         : "bg-white border border-gray-300"
//                     }`}
//                     style={{ alignSelf: isMe ? "flex-end" : "flex-start" }}
//                   >
//                     {msg.sender !== "System" && !isMe && (
//                       <div className="font-semibold mb-1">{msg.sender}</div>
//                     )}
//                     {msg.text}
//                   </div>
//                 );
//               })}
//               <div ref={messagesEndRef} />
//             </div>

//             <form
//               onSubmit={sendMessage}
//               className="flex p-4 border-t bg-white"
//             >
//               <input
//                 type="text"
//                 placeholder="Type a message..."
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 className="flex-grow border px-4 py-2 rounded-l focus:outline-none"
//               />
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-6 py-2 rounded-r hover:bg-blue-700"
//               >
//                 Send
//               </button>
//             </form>
//           </section>
//         </div>
//       )}
//     </main>
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import socket from '@/app/utils/socket';

// export default function HomePage() {
//   const [username, setUsername] = useState('');
//   const [joined, setJoined] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [chatType, setChatType] = useState(null);
//   const [recipient, setRecipient] = useState('');
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [groupName, setGroupName] = useState('');
//   const [groupMembers, setGroupMembers] = useState([]);
//   const [groups, setGroups] = useState([]);
//   const [selectedGroup, setSelectedGroup] = useState('');

//   useEffect(() => {
//     socket.on('userList', (data) => setUsers(data));
//     socket.on('privateMessage', (msg) => setMessages((prev) => [...prev, msg]));
//     socket.on('groupMessage', (msg) => setMessages((prev) => [...prev, msg]));
//     socket.on('groupCreated', ({ groupName }) => setGroups((prev) => [...prev, groupName]));

//     return () => {
//       socket.off('userList');
//       socket.off('privateMessage');
//       socket.off('groupMessage');
//       socket.off('groupCreated');
//     };
//   }, []);

//   const handleJoin = () => {
//     if (username.trim()) {
//       socket.emit('join', username);
//       setJoined(true);
//     }
//   };

//   const sendMessage = () => {
//     if (chatType === 'private' && recipient && message.trim()) {
//       socket.emit('privateMessage', { toUsername: recipient, text: message });
//       setMessages((prev) => [...prev, { sender: username, text: message }]);
//     } else if (chatType === 'group' && selectedGroup && message.trim()) {
//       socket.emit('groupMessage', { groupName: selectedGroup, sender: username, text: message });
//     }
//     setMessage('');
//   };

//   const createGroup = () => {
//     if (groupName && groupMembers.length > 0) {
//       socket.emit('createGroup', { groupName, members: [username, ...groupMembers] });
//       setGroups((prev) => [...prev, groupName]);
//       setGroupMembers([]);
//       setGroupName('');
//     }
//   };

//   const endChat = () => {
//     setChatType(null);
//     setRecipient('');
//     setSelectedGroup('');
//     setMessages([]);
//   };

//   if (!joined) {
//     return (
//       <main className="p-4 flex flex-col items-center justify-center min-h-screen bg-gray-100">
//         <input
//           type="text"
//           placeholder="Enter your name"
//           className="border p-2 mb-4 rounded w-64"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         <button onClick={handleJoin} className="bg-blue-600 text-white px-4 py-2 rounded">
//           Join Chat
//         </button>
//       </main>
//     );
//   }

//   if (!chatType) {
//     return (
//       <main className="p-4 space-y-4">
//         <h1 className="text-xl font-bold">Choose Chat Type</h1>
//         <button onClick={() => setChatType('private')} className="bg-green-600 text-white px-4 py-2 rounded">
//           One-to-One Chat
//         </button>
//         <button onClick={() => setChatType('group')} className="bg-purple-600 text-white px-4 py-2 rounded">
//           Group Chat
//         </button>
//       </main>
//     );
//   }

//   return (
//     <main className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl font-bold">{chatType === 'private' ? 'Private Chat' : 'Group Chat'}</h1>
//         <button onClick={endChat} className="text-red-500 border px-3 py-1 rounded border-red-500 hover:bg-red-100">
//           End Chat
//         </button>
//       </div>

//       {chatType === 'private' && (
//         <div className="mb-4">
//           <select
//             className="border p-2 w-full"
//             value={recipient}
//             onChange={(e) => setRecipient(e.target.value)}
//           >
//             <option value="">Select a user</option>
//             {users.filter((u) => u !== username).map((user) => (
//               <option key={user}>{user}</option>
//             ))}
//           </select>
//         </div>
//       )}

//       {chatType === 'group' && (
//         <div className="space-y-2 mb-4">
//           <h2 className="font-semibold">Create a Group</h2>
//           <input
//             type="text"
//             placeholder="Group Name"
//             className="border p-2 w-full"
//             value={groupName}
//             onChange={(e) => setGroupName(e.target.value)}
//           />
//           <select
//             multiple
//             className="border p-2 w-full h-32"
//             value={groupMembers}
//             onChange={(e) => setGroupMembers([...e.target.selectedOptions].map((opt) => opt.value))}
//           >
//             {users.filter((u) => u !== username).map((user) => (
//               <option key={user}>{user}</option>
//             ))}
//           </select>
//           <button onClick={createGroup} className="bg-blue-500 text-white px-4 py-2 rounded">
//             Create Group
//           </button>

//           <select
//             className="border p-2 w-full mt-4"
//             value={selectedGroup}
//             onChange={(e) => setSelectedGroup(e.target.value)}
//           >
//             <option value="">Select Group</option>
//             {groups.map((group) => (
//               <option key={group}>{group}</option>
//             ))}
//           </select>
//         </div>
//       )}

//       <div className="h-64 overflow-y-scroll border p-3 mb-4 bg-gray-100 rounded">
//         {messages.map((msg, idx) => (
//           <div key={idx} className="mb-1">
//             <strong>{msg.sender}:</strong> {msg.text}
//           </div>
//         ))}
//       </div>

//       <div className="flex gap-2">
//         <input
//           type="text"
//           placeholder="Type your message..."
//           className="border p-2 flex-1 rounded"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-green-500 text-white px-4 py-2 rounded"
//           disabled={!message.trim()}
//         >
//           Send
//         </button>
//       </div>
//     </main>
//   );
// }


// 'use client';

// import { useState, useEffect } from "react";
// import socket from "@/app/utils/socket";

// export default function HomePage() {
//   const [username, setUsername] = useState("");
//   const [joined, setJoined] = useState(false);
//   const [mode, setMode] = useState(""); // "private" or "group"
//   const [users, setUsers] = useState([]);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [receiver, setReceiver] = useState(""); // for private chat
//   const [groupName, setGroupName] = useState("");
//   const [groupMembers, setGroupMembers] = useState([]);
//   const [joinedGroups, setJoinedGroups] = useState([]);
//   const [groupMap, setGroupMap] = useState({}); // groupName => [members]

//   useEffect(() => {
//     socket.on("userList", (data) => setUsers(data));

//     socket.on("privateMessage", (msg) =>
//       setMessages((prev) => [...prev, msg])
//     );

//     socket.on("groupMessage", ({ groupName, sender, text }) => {
//       setMessages((prev) => [
//         ...prev,
//         { sender: `[${groupName}] ${sender}`, text },
//       ]);
//     });

//     socket.on("groupCreated", ({ groupName, members }) => {
//       if (!joinedGroups.includes(groupName)) {
//         setJoinedGroups((prev) => [...prev, groupName]);
//         setGroupMap((prev) => ({ ...prev, [groupName]: members }));
//         alert(`You were added to group: ${groupName}`);
//       }
//     });

//     return () => {
//       socket.off("userList");
//       socket.off("privateMessage");
//       socket.off("groupMessage");
//       socket.off("groupCreated");
//     };
//   }, [joinedGroups]);

//   const handleJoin = () => {
//     if (username.trim()) {
//       socket.emit("join", username);
//       setJoined(true);
//     }
//   };

//   const sendMessage = () => {
//     if (!message.trim()) return;
//     if (mode === "private" && receiver) {
//       socket.emit("privateMessage", { toUsername: receiver, text: message });
//     } else if (mode === "group" && groupName) {
//       socket.emit("groupMessage", { groupName, sender: username, text: message });
//     }
//     setMessages((prev) => [...prev, { sender: "You", text: message }]);
//     setMessage("");
//   };

//   const createGroup = () => {
//     if (!groupName || groupMembers.length < 2) {
//       return alert("At least 2 members needed.");
//     }
//     const members = [...new Set([...groupMembers, username])];
//     socket.emit("createGroup", { groupName, members });
//     setJoinedGroups((prev) => [...prev, groupName]);
//     setGroupMap((prev) => ({ ...prev, [groupName]: members }));
//     setMessages([]);
//   };

//   const resetChat = () => {
//     setJoined(false);
//     setUsername("");
//     setMode("");
//     setMessages([]);
//     setGroupName("");
//     setGroupMembers([]);
//     setReceiver("");
//     setGroupMap({});
//     setJoinedGroups([]);
//   };

//   if (!joined) {
//     return (
//       <main className="p-8 flex flex-col items-center space-y-4">
//         <h1 className="text-2xl font-bold">Welcome to Chat App</h1>
//         <input
//           className="border p-2 rounded w-64"
//           placeholder="Enter your name"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           onClick={handleJoin}
//         >
//           Join
//         </button>
//       </main>
//     );
//   }

//   if (!mode) {
//     return (
//       <main className="p-8 flex flex-col items-center space-y-4">
//         <h2 className="text-xl font-semibold">Choose Chat Type</h2>
//         <button
//           onClick={() => setMode("private")}
//           className="bg-green-500 text-white px-4 py-2 rounded w-48"
//         >
//           One-to-One Chat
//         </button>
//         <button
//           onClick={() => setMode("group")}
//           className="bg-purple-600 text-white px-4 py-2 rounded w-48"
//         >
//           Group Chat
//         </button>
//       </main>
//     );
//   }

//   return (
//     <main className="p-6 max-w-2xl mx-auto space-y-4">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-semibold">
//           {mode === "private" ? "Private Chat" : "Group Chat"}
//         </h2>
//         <button onClick={resetChat} className="text-red-500 hover:underline">
//           End Chat
//         </button>
//       </div>

//       {mode === "private" ? (
//         <>
//           <select
//             className="w-full border p-2 rounded"
//             onChange={(e) => setReceiver(e.target.value)}
//             value={receiver}
//           >
//             <option value="">Select user to chat</option>
//             {users.filter((u) => u !== username).map((user, i) => (
//               <option key={i} value={user}>
//                 {user}
//               </option>
//             ))}
//           </select>
//         </>
//       ) : (
//         <>
//           <input
//             type="text"
//             placeholder="Group name"
//             className="border p-2 w-full rounded"
//             value={groupName}
//             onChange={(e) => setGroupName(e.target.value)}
//           />
//           <div className="border p-2 rounded h-32 overflow-y-auto">
//             <p className="font-medium">Select Members:</p>
//             {users.map((user, i) => (
//               <label key={i} className="block">
//                 <input
//                   type="checkbox"
//                   value={user}
//                   checked={groupMembers.includes(user)}
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       setGroupMembers([...groupMembers, user]);
//                     } else {
//                       setGroupMembers(groupMembers.filter((u) => u !== user));
//                     }
//                   }}
//                 />{" "}
//                 {user}
//               </label>
//             ))}
//           </div>
//           <button
//             onClick={createGroup}
//             className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
//           >
//             Create Group
//           </button>

//           <select
//             className="border p-2 w-full rounded mt-2"
//             onChange={(e) => {
//               setGroupName(e.target.value);
//               setMessages([]);
//             }}
//             value={groupName}
//           >
//             <option value="">Select group</option>
//             {joinedGroups.map((grp, i) => (
//               <option key={i} value={grp}>
//                 {grp}
//               </option>
//             ))}
//           </select>

//           {groupName && (
//             <div className="border p-2 rounded bg-white mt-2">
//               <p className="font-medium mb-1">Group Members:</p>
//               <ul className="list-disc pl-5 text-sm">
//                 {(groupMap[groupName] || []).map((member, i) => (
//                   <li key={i}>{member}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </>
//       )}

//       <div className="border h-64 overflow-y-scroll p-2 bg-gray-100 rounded">
//         {messages.map((msg, i) => (
//           <div key={i}>
//             <strong>{msg.sender}:</strong> {msg.text}
//           </div>
//         ))}
//       </div>

//       <div className="flex gap-2">
//         <input
//           type="text"
//           placeholder="Type a message..."
//           className="flex-1 border p-2 rounded"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-green-600 text-white px-4 py-2 rounded"
//         >
//           Send
//         </button>
//       </div>
//     </main>
//   );
// }


// 'use client';

// import { useState, useEffect, useRef } from "react";
// import socket from "@/app/utils/socket";

// export default function HomePage() {
//   const [username, setUsername] = useState("");
//   const [joined, setJoined] = useState(false);
//   const [mode, setMode] = useState(""); // "private" or "group"
//   const [users, setUsers] = useState([]);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [receiver, setReceiver] = useState(""); // for private chat
//   const [groupName, setGroupName] = useState("");
//   const [groupMembers, setGroupMembers] = useState([]);
//   const [joinedGroups, setJoinedGroups] = useState([]);
//   const [groupMap, setGroupMap] = useState({}); // groupName => [members]
//   const [showGroupCreation, setShowGroupCreation] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     socket.on("userList", (data) => setUsers(data));

//     socket.on("privateMessage", (msg) =>
//       setMessages((prev) => [...prev, msg])
//     );

//     socket.on("groupMessage", ({ groupName, sender, text }) => {
//       setMessages((prev) => [
//         ...prev,
//         { sender: `[${groupName}] ${sender}`, text },
//       ]);
//     });

//     socket.on("groupCreated", ({ groupName, members }) => {
//       setJoinedGroups((prev) => {
//         if (!prev.includes(groupName)) {
//           return [...prev, groupName];
//         }
//         return prev;
//       });
//       setGroupMap((prev) => ({ ...prev, [groupName]: members }));
//       alert(`You were added to group: ${groupName}`);
//     });

//     return () => {
//       socket.off("userList");
//       socket.off("privateMessage");
//       socket.off("groupMessage");
//       socket.off("groupCreated");
//     };
//   }, []);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleJoin = () => {
//     if (username.trim()) {
//       socket.emit("join", username);
//       setJoined(true);
//     }
//   };

//   const sendMessage = () => {
//     if (!message.trim()) return;
//     if (mode === "private" && receiver) {
//       socket.emit("privateMessage", { toUsername: receiver, text: message });
//     } else if (mode === "group" && groupName) {
//       socket.emit("groupMessage", { groupName, sender: username, text: message });
//     }
//     setMessages((prev) => [...prev, { sender: "You", text: message }]);
//     setMessage("");
//   };

//   const createGroup = () => {
//     if (!groupName || groupMembers.length < 2) {
//       return alert("At least 2 members needed.");
//     }
//     const members = [...new Set([...groupMembers, username])];
//     socket.emit("createGroup", { groupName, members });
//     setJoinedGroups((prev) => {
//       if (!prev.includes(groupName)) {
//         return [...prev, groupName];
//       }
//       return prev;
//     });
//     setGroupMap((prev) => ({ ...prev, [groupName]: members }));
//     setMessages([]);
//     setShowGroupCreation(false);
//     setGroupMembers([]);
//     setGroupName("");
//   };

//   const resetChat = () => {
//     setJoined(false);
//     setUsername("");
//     setMode("");
//     setMessages([]);
//     setGroupName("");
//     setGroupMembers([]);
//     setReceiver("");
//     setGroupMap({});
//     setJoinedGroups([]);
//   };

//   const selectChat = (type, name) => {
//     setMessages([]);
//     if (type === "private") {
//       setMode("private");
//       setReceiver(name);
//       setGroupName("");
//     } else {
//       setMode("group");
//       setGroupName(name);
//       setReceiver("");
//     }
//   };

//   if (!joined) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//           <h1 className="text-2xl font-bold text-center text-green-600 mb-6">Welcome to Chat App</h1>
//           <input
//             className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
//             placeholder="Enter your name"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <button
//             className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
//             onClick={handleJoin}
//           >
//             Join
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!mode) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//           <h2 className="text-xl font-semibold text-center text-green-600 mb-6">Choose Chat Type</h2>
//           <button
//             onClick={() => setMode("private")}
//             className="w-full bg-green-600 text-white p-3 rounded-lg mb-4 hover:bg-green-700 transition"
//           >
//             One-to-One Chat
//           </button>
//           <button
//             onClick={() => setMode("group")}
//             className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
//           >
//             Group Chat
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
//         <div className="bg-green-600 p-4 flex items-center justify-between">
//           <h2 className="text-white font-semibold text-lg">{username}</h2>
//           <button
//             onClick={resetChat}
//             className="text-white hover:text-gray-200 transition"
//           >
//             Logout
//           </button>
//         </div>
//         {mode === "group" && (
//           <button
//             onClick={() => setShowGroupCreation(true)}
//             className="bg-green-600 text-white p-3 mx-4 my-2 rounded-lg hover:bg-green-700 transition"
//           >
//             New Group
//           </button>
//         )}
//         <div className="flex-1 overflow-y-auto">
//           {mode === "private"
//             ? users
//                 .filter((u) => u !== username)
//                 .map((user, i) => (
//                   <div
//                     key={i}
//                     onClick={() => selectChat("private", user)}
//                     className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${
//                       receiver === user ? "bg-gray-100" : ""
//                     }`}
//                   >
//                     <p className="font-medium">{user}</p>
//                   </div>
//                 ))
//             : joinedGroups.map((group, i) => (
//                 <div
//                   key={i}
//                   onClick={() => selectChat("group", group)}
//                   className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${
//                     groupName === group ? "bg-gray-100" : ""
//                   }`}
//                 >
//                   <p className="font-medium">{group}</p>
//                 </div>
//               ))}
//         </div>
//       </div>

//       {/* Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {(receiver || groupName) && (
//           <>
//             <div className="bg-green-600 p-4 flex items-center justify-between">
//               <h2 className="text-white font-semibold text-lg">
//                 {mode === "private" ? receiver : groupName}
//               </h2>
//               {mode === "group" && groupName && (
//                 <div className="text-white text-sm">
//                   Members: {(groupMap[groupName] || []).join(", ")}
//                 </div>
//               )}
//             </div>
//             <div
//               className="flex-1 p-4 overflow-y-auto bg-[url('https://i.imgur.com/8zK9f3J.png')] bg-repeat"
//             >
//               {messages.map((msg, i) => (
//                 <div
//                   key={i}
//                   className={`mb-2 flex ${
//                     msg.sender === "You" ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-xs p-3 rounded-lg ${
//                       msg.sender === "You"
//                         ? "bg-green-500 text-white"
//                         : "bg-white text-gray-800"
//                     }`}
//                   >
//                     <p className="text-sm font-medium">{msg.sender}</p>
//                     <p>{msg.text}</p>
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>
//             <div className="bg-white p-4 border-t border-gray-200 flex items-center">
//               <input
//                 type="text"
//                 placeholder="Type a message..."
//                 className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//               />
//               <button
//                 onClick={sendMessage}
//                 className="ml-2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
//               >
//                 Send
//               </button>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Group Creation Modal */}
//       {showGroupCreation && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-full max-w-md">
//             <h2 className="text-xl font-semibold text-green-600 mb-4">
//               Create New Group
//             </h2>
//             <input
//               type="text"
//               placeholder="Group name"
//               className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
//               value={groupName}
//               onChange={(e) => setGroupName(e.target.value)}
//             />
//             <div className="border p-3 rounded-lg h-32 overflow-y-auto mb-4">
//               <p className="font-medium mb-2">Select Members:</p>
//               {users.map((user, i) => (
//                 <label key={i} className="block">
//                   <input
//                     type="checkbox"
//                     value={user}
//                     checked={groupMembers.includes(user)}
//                     onChange={(e) => {
//                       if (e.target.checked) {
//                         setGroupMembers([...groupMembers, user]);
//                       } else {
//                         setGroupMembers(groupMembers.filter((u) => u !== user));
//                       }
//                     }}
//                   />{" "}
//                   {user}
//                 </label>
//               ))}
//             </div>
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setShowGroupCreation(false)}
//                 className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={createGroup}
//                 className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
//               >
//                 Create
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect, useRef } from "react";
// import socket from "@/app/utils/socket";

// export default function HomePage() {
//   const [username, setUsername] = useState("");
//   const [joined, setJoined] = useState(false);
//   const [mode, setMode] = useState(""); // "private" or "group"
//   const [users, setUsers] = useState([]);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [receiver, setReceiver] = useState(""); // for private chat
//   const [groupName, setGroupName] = useState("");
//   const [groupMembers, setGroupMembers] = useState([]);
//   const [joinedGroups, setJoinedGroups] = useState([]);
//   const [groupMap, setGroupMap] = useState({}); // groupName => [members]
//   const [showGroupCreation, setShowGroupCreation] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     socket.on("userList", (data) => setUsers(data));

//     socket.on("groupList", (groups) => {
//       setJoinedGroups(groups.map((g) => g.name));
//       setGroupMap(Object.fromEntries(groups.map((g) => [g.name, g.members])));
//     });

//     socket.on("privateMessage", (msg) =>
//       setMessages((prev) => [...prev, msg])
//     );

//     socket.on("groupMessage", ({ groupName, sender, text。） => {
//       setMessages((prev) => [
//         ...prev,
//         { sender: `[${groupName}] ${sender}`, text },
//       ]);
//     });

//     socket.on("groupCreated", ({ groupName, members }) => {
//       setJoinedGroups((prev) => {
//         if (!prev.includes(groupName)) {
//           return [...prev, groupName];
//         }
//         return prev;
//       });
//       setGroupMap((prev) => ({ ...prev, [groupName]: members }));
//       alert(`You were added to group: ${groupName}`);
//     });

//     socket.on("messageHistory", (history) => {
//       setMessages(history);
//     });

//     return () => {
//       socket.off("userList");
//       socket.off("groupList");
//       socket.off("privateMessage");
//       socket.off("groupMessage");
//       socket.off("groupCreated");
//       socket.off("messageHistory");
//     };
//   }, []);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleJoin = () => {
//     if (username.trim()) {
//       socket.emit("join", username);
//       setJoined(true);
//     }
//   };

//   const sendMessage = () => {
//     if (!message.trim()) return;
//     if (mode === "private" && receiver) {
//       socket.emit("privateMessage", { toUsername: receiver, text: message });
//     } else if (mode === "group" && groupName) {
//       socket.emit("groupMessage", { groupName, sender: username, text: message });
//     }
//     setMessage("");
//   };

//   const createGroup = () => {
//     if (!groupName || groupMembers.length < 2) {
//       return alert("At least 2 members needed.");
//     }
//     const members = [...new Set([...groupMembers, username])];
//     socket.emit("createGroup", { groupName, members });
//     setShowGroupCreation(false);
//     setGroupMembers([]);
//     setGroupName("");
//   };

//   const resetChat = () => {
//     setJoined(false);
//     setUsername("");
//     setMode("");
//     setMessages([]);
//     setGroupName("");
//     setGroupMembers([]);
//     setReceiver("");
//     setGroupMap({});
//     setJoinedGroups([]);
//   };

//   const selectChat = (type, name) => {
//     setMessages([]);
//     if (type === "private") {
//       setMode("private");
//       setReceiver(name);
//       setGroupName("");
//       socket.emit("fetchMessages", { type: "private", target: name });
//     } else {
//       setMode("group");
//       setGroupName(name);
//       setReceiver("");
//       socket.emit("fetchMessages", { type: "group", target: name });
//     }
//   };

//   if (!joined) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//           <h1 className="text-2xl font-bold text-center text-green-600 mb-6">Welcome to Chat App</h1>
//           <input
//             className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
//             placeholder="Enter your name"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <button
//             className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
//             onClick={handleJoin}
//           >
//             Join
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!mode) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//           <h2 className="text-xl font-semibold text-center text-green-600 mb-6">Choose Chat Type</h2>
//           <button
//             onClick={() => setMode("private")}
//             className="w-full bg-green-600 text-white p-3 rounded-lg mb-4 hover:bg-green-700 transition"
//           >
//             One-to-One Chat
//           </button>
//           <button
//             onClick={() => setMode("group")}
//             className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
//           >
//             Group Chat
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
//         <div className="bg-green-600 p-4 flex items-center justify-between">
//           <h2 className="text-white font-semibold text-lg">{username}</h2>
//           <button
//             onClick={resetChat}
//             className="text-white hover:text-gray-200 transition"
//           >
//             Logout
//           </button>
//         </div>
//         {mode === "group" && (
//           <button
//             onClick={() => setShowGroupCreation(true)}
//             className="bg-green-600 text-white p-3 mx-4 my-2 rounded-lg hover:bg-green-700 transition"
//           >
//             New Group
//           </button>
//         )}
//         <div className="flex-1 overflow-y-auto">
//           {mode === "private"
//             ? users
//                 .filter((u) => u !== username)
//                 .map((user, i) => (
//                   <div
//                     key={i}
//                     onClick={() => selectChat("private", user)}
//                     className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${
//                       receiver === user ? "bg-gray-100" : ""
//                     }`}
//                   >
//                     <p className="font-medium">{user}</p>
//                   </div>
//                 ))
//             : joinedGroups.map((group, i) => (
//                 <div
//                   key={i}
//                   onClick={() => selectChat("group", group)}
//                   className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${
//                     groupName === group ? "bg-gray-100" : ""
//                   }`}
//                 >
//                   <p className="font-medium">{group}</p>
//                 </div>
//               ))}
//         </div>
//       </div>

//       {/* Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {(receiver || groupName) && (
//           <>
//             <div className="bg-green-600 p-4 flex items-center justify-between">
//               <h2 className="text-white font-semibold text-lg">
//                 {mode === "private" ? receiver : groupName}
//               </h2>
//               {mode === "group" && groupName && (
//                 <div className="text-white text-sm">
//                   Members: {(groupMap[groupName] || []).join(", ")}
//                 </div>
//               )}
//             </div>
//             <div
//               className="flex-1 p-4 overflow-y-auto bg-[url('https://i.imgur.com/8zK9f3J.png')] bg-repeat"
//             >
//               {messages.map((msg, i) => (
//                 <div
//                   key={i}
//                   className={`mb-2 flex ${
//                     msg.sender === "You" ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-xs p-3 rounded-lg ${
//                       msg.sender === "You"
//                         ? "bg-green-500 text-white"
//                         : "bg-white text-gray-800"
//                     }`}
//                   >
//                     <p className="text-sm font-medium">{msg.sender}</p>
//                     <p>{msg.text}</p>
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>
//             <div className="bg-white p-4 border-t border-gray-200 flex items-center">
//               <input
//                 type="text"
//                 placeholder="Type a message..."
//                 className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//               />
//               <button
//                 onClick={sendMessage}
//                 className="ml-2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
//               >
//                 Send
//               </button>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Group Creation Modal */}
//       {showGroupCreation && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-full max-w-md">
//             <h2 className="text-xl font-semibold text-green-600 mb-4">
//               Create New Group
//             </h2>
//             <input
//               type="text"
//               placeholder="Group name"
//               className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
//               value={groupName}
//               onChange={(e) => setGroupName(e.target.value)}
//             />
//             <div className="border p-3 rounded-lg h-32 overflow-y-auto mb-4">
//               <p className="font-medium mb-2">Select Members:</p>
//               {users.map((user, i) => (
//                 <label key={i} className="block">
//                   <input
//                     type="checkbox"
//                     value={user}
//                     checked={groupMembers.includes(user)}
//                     onChange={(e) => {
//                       if (e.target.checked) {
//                         setGroupMembers([...groupMembers, user]);
//                       } else {
//                         setGroupMembers(groupMembers.filter((u) => u !== user));
//                       }
//                     }}
//                   />{" "}
//                   {user}
//                 </label>
//               ))}
//             </div>
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setShowGroupCreation(false)}
//                 className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={createGroup}
//                 className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
//               >
//                 Create
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect, useRef } from "react";
// import socket from "@/app/utils/socket";
// import EmojiPicker from "emoji-picker-react";

// export default function HomePage() {
//   const [username, setUsername] = useState("");
//   const [joined, setJoined] = useState(false);
//   const [mode, setMode] = useState("");
//   const [users, setUsers] = useState([]);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [receiver, setReceiver] = useState("");
//   const [groupName, setGroupName] = useState("");
//   const [groupMembers, setGroupMembers] = useState([]);
//   const [joinedGroups, setJoinedGroups] = useState([]);
//   const [groupMap, setGroupMap] = useState({});
//   const [showGroupCreation, setShowGroupCreation] = useState(false);
//   const [onlineUsers, setOnlineUsers] = useState(new Map());
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     socket.on("userList", (data) => {
//       setUsers(data.map((u) => u.username));
//       setOnlineUsers(new Map(data.map((u) => [u.username, u.online])));
//     });

//     socket.on("userStatus", ({ username, online }) => {
//       setOnlineUsers((prev) => new Map(prev).set(username, online));
//     });

//     socket.on("groupList", (groups) => {
//       setJoinedGroups(groups.map((g) => g.name));
//       setGroupMap(Object.fromEntries(groups.map((g) => [g.name, { members: g.members, admins: g.admins || [] }])));
//     });

//     socket.on("privateMessage", ({ sender, text }) => {
//       setMessages((prev) => [...prev, { sender, text }]);
//     });

//     socket.on("groupMessage", ({ groupName, sender, text }) => {
//       setMessages((prev) => [
//         ...prev,
//         { sender: `[${groupName}] ${sender}`, text },
//       ]);
//     });

//     socket.on("groupCreated", ({ groupName, members, admins }) => {
//       setJoinedGroups((prev) => {
//         if (!prev.includes(groupName)) return [...prev, groupName];
//         return prev;
//       });
//       setGroupMap((prev) => ({
//         ...prev,
//         [groupName]: { members, admins },
//       }));
//       alert(`You were added to group: ${groupName}`);
//     });

//     socket.on("groupUpdated", ({ groupName, members, admins }) => {
//       setGroupMap((prev) => ({
//         ...prev,
//         [groupName]: { members, admins },
//       }));
//       setJoinedGroups((prev) => {
//         if (members.includes(username)) return prev;
//         return prev.filter((g) => g !== groupName);
//       });
//     });

//     socket.on("removedFromGroup", ({ groupName }) => {
//       setJoinedGroups((prev) => prev.filter((g) => g !== groupName));
//       setGroupMap((prev) => {
//         const newMap = { ...prev };
//         delete newMap[groupName];
//         return newMap;
//       });
//       if (groupName === groupName) {
//         setGroupName("");
//         setMessages([]);
//       }
//       alert(`You were removed from group: ${groupName}`);
//     });

//     socket.on("messageHistory", (history) => {
//       setMessages(history);
//     });

//     return () => {
//       socket.off("userList");
//       socket.off("userStatus");
//       socket.off("groupList");
//       socket.off("privateMessage");
//       socket.off("groupMessage");
//       socket.off("groupCreated");
//       socket.off("groupUpdated");
//       socket.off("removedFromGroup");
//       socket.off("messageHistory");
//     };
//   }, [username]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleJoin = () => {
//     if (username.trim()) {
//       socket.emit("join", username);
//       setJoined(true);
//     }
//   };

//   const sendMessage = () => {
//     if (!message.trim()) return;
//     if (mode === "private" && receiver) {
//       socket.emit("privateMessage", { toUsername: receiver, text: message });
//     } else if (mode === "group" && groupName) {
//       socket.emit("groupMessage", { groupName, sender: username, text: message });
//     }
//     setMessage("");
//   };

//   const createGroup = () => {
//     if (!groupName || groupMembers.length < 2) {
//       return alert("At least 2 members needed.");
//     }
//     const members = [...new Set([...groupMembers, username])];
//     socket.emit("createGroup", { groupName, members });
//     setShowGroupCreation(false);
//     setGroupMembers([]);
//     setGroupName("");
//   };

//   const resetChat = () => {
//     setJoined(false);
//     setUsername("");
//     setMode("");
//     setMessages([]);
//     setGroupName("");
//     setGroupMembers([]);
//     setReceiver("");
//     setGroupMap({});
//     setJoinedGroups([]);
//   };

//   const selectChat = (type, name) => {
//     setMessages([]);
//     if (type === "private") {
//       setMode("private");
//       setReceiver(name);
//       setGroupName("");
//       socket.emit("fetchMessages", { type: "private", target: name });
//     } else {
//       setMode("group");
//       setGroupName(name);
//       setReceiver("");
//       socket.emit("fetchMessages", { type: "group", target: name });
//     }
//   };

//   const handleEmojiClick = (emojiObject) => {
//     setMessage((prev) => prev + emojiObject.emoji);
//     setShowEmojiPicker(false);
//   };

//   const addAdmin = (targetUsername) => {
//     socket.emit("addAdmin", { groupName, username: targetUsername });
//   };

//   const removeAdmin = (targetUsername) => {
//     socket.emit("removeAdmin", { groupName, username: targetUsername });
//   };

//   const removeMember = (targetUsername) => {
//     socket.emit("removeMember", { groupName, username: targetUsername });
//   };

//   const exitGroup = () => {
//     socket.emit("exitGroup", { groupName });
//   };

//   if (!joined) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//           <h1 className="text-2xl font-bold text-center text-green-600 mb-6">Welcome to Chat App</h1>
//           <input
//             className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
//             placeholder="Enter your name"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <button
//             className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
//             onClick={handleJoin}
//           >
//             Join
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!mode) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//           <h2 className="text-xl font-semibold text-center text-green-600 mb-6">Choose Chat Type</h2>
//           <button
//             onClick={() => setMode("private")}
//             className="w-full bg-green-600 text-white p-3 rounded-lg mb-4 hover:bg-green-700 transition"
//           >
//             One-to-One Chat
//           </button>
//           <button
//             onClick={() => setMode("group")}
//             className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
//           >
//             Group Chat
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
//         <div className="bg-green-600 p-4 flex items-center justify-between">
//           <h2 className="text-white font-semibold text-lg">{username}</h2>
//           <button
//             onClick={resetChat}
//             className="text-white hover:text-gray-200 transition"
//           >
//             Logout
//           </button>
//         </div>
//         {mode === "group" && (
//           <button
//             onClick={() => setShowGroupCreation(true)}
//             className="bg-green-600 text-white p-3 mx-4 my-2 rounded-lg hover:bg-green-700 transition"
//           >
//             New Group
//           </button>
//         )}
//         <div className="flex-1 overflow-y-auto">
//           {mode === "private"
//             ? users
//                 .filter((u) => u !== username)
//                 .map((user, i) => (
//                   <div
//                     key={i}
//                     onClick={() => selectChat("private", user)}
//                     className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${
//                       receiver === user ? "bg-gray-100" : ""
//                     }`}
//                   >
//                     <p className="font-medium flex items-center">
//                       {user}
//                       <span
//                         className={`ml-2 w-2 h-2 rounded-full ${
//                           onlineUsers.get(user) ? "bg-green-500" : "bg-gray-400"
//                         }`}
//                       ></span>
//                     </p>
//                   </div>
//                 ))
//             : joinedGroups.map((group, i) => (
//                 <div
//                   key={i}
//                   onClick={() => selectChat("group", group)}
//                   className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${
//                     groupName === group ? "bg-gray-100" : ""
//                   }`}
//                 >
//                   <p className="font-medium">{group}</p>
//                 </div>
//               ))}
//         </div>
//       </div>

//       {/* Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {(receiver || groupName) && (
//           <>
//             <div className="bg-green-600 p-4 flex items-center justify-between">
//               <h2 className="text-white font-semibold text-lg">
//                 {mode === "private" ? receiver : groupName}
//               </h2>
//               {mode === "group" && groupName && (
//                 <div className="text-white text-sm">
//                   Members: {(groupMap[groupName]?.members || []).map((m) => (
//                     <span key={m}>
//                       {m}
//                       {groupMap[groupName]?.admins.includes(m) ? " (Admin)" : ""}
//                       {", "}
//                     </span>
//                   ))}
//                   {groupMap[groupName]?.admins.includes(username) && (
//                     <div className="mt-2">
//                       <select
//                         onChange={(e) => {
//                           const target = e.target.value;
//                           if (target) addAdmin(target);
//                           e.target.value = "";
//                         }}
//                         className="bg-white text-black p-1 rounded"
//                       >
//                         <option value="">Add Admin</option>
//                         {groupMap[groupName]?.members
//                           .filter((m) => !groupMap[groupName]?.admins.includes(m))
//                           .map((m) => (
//                             <option key={m} value={m}>{m}</option>
//                           ))}
//                       </select>
//                       <select
//                         onChange={(e) => {
//                           const target = e.target.value;
//                           if (target) removeAdmin(target);
//                           e.target.value = "";
//                         }}
//                         className="bg-white text-black p-1 rounded ml-2"
//                       >
//                         <option value="">Remove Admin</option>
//                         {groupMap[groupName]?.admins
//                           .filter((m) => m !== username)
//                           .map((m) => (
//                             <option key={m} value={m}>{m}</option>
//                           ))}
//                       </select>
//                       <select
//                         onChange={(e) => {
//                           const target = e.target.value;
//                           if (target) removeMember(target);
//                           e.target.value = "";
//                         }}
//                         className="bg-white text-black p-1 rounded ml-2"
//                       >
//                         <option value="">Remove Member</option>
//                         {groupMap[groupName]?.members
//                           .filter((m) => m !== username)
//                           .map((m) => (
//                             <option key={m} value={m}>{m}</option>
//                           ))}
//                       </select>
//                     </div>
//                   )}
//                   <button
//                     onClick={exitGroup}
//                     className="bg-red-600 text-white p-1 rounded ml-2"
//                   >
//                     Exit Group
//                   </button>
//                 </div>
//               )}
//             </div>
//             <div
//               className="flex-1 p-4 overflow-y-auto bg-[url('https://i.imgur.com/8zK9f3J.png')] bg-repeat"
//             >
//               {messages.map((msg, i) => (
//                 <div
//                   key={i}
//                   className={`mb-2 flex ${
//                     msg.sender === "You" ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-xs p-3 rounded-lg ${
//                       msg.sender === "You"
//                         ? "bg-green-500 text-white"
//                         : "bg-white text-gray-800"
//                     }`}
//                   >
//                     <p className="text-sm font-medium">{msg.sender}</p>
//                     <p>{msg.text}</p>
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>
//             <div className="bg-white p-4 border-t border-gray-200 flex items-center relative">
//               <button
//                 onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                 className="mr-2 text-2xl"
//               >
//                 😊
//               </button>
//               {showEmojiPicker && (
//                 <div className="absolute bottom-16 left-4 z-10">
//                   <EmojiPicker onEmojiClick={handleEmojiClick} />
//                 </div>
//               )}
//               <input
//                 type="text"
//                 placeholder="Type a message..."
//                 className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//               />
//               <button
//                 onClick={sendMessage}
//                 className="ml-2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
//               >
//                 Send
//               </button>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Group Creation Modal */}
//       {showGroupCreation && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-full max-w-md">
//             <h2 className="text-xl font-semibold text-green-600 mb-4">
//               Create New Group
//             </h2>
//             <input
//               type="text"
//               placeholder="Group name"
//               className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
//               value={groupName}
//               onChange={(e) => setGroupName(e.target.value)}
//             />
//             <div className="border p-3 rounded-lg h-32 overflow-y-auto mb-4">
//               <p className="font-medium mb-2">Select Members:</p>
//               {users.map((user, i) => (
//                 <label key={i} className="block">
//                   <input
//                     type="checkbox"
//                     value={user}
//                     checked={groupMembers.includes(user)}
//                     onChange={(e) => {
//                       if (e.target.checked) {
//                         setGroupMembers([...groupMembers, user]);
//                       } else {
//                         setGroupMembers(groupMembers.filter((u) => u !== user));
//                       }
//                     }}
//                   />{" "}
//                   {user}
//                 </label>
//               ))}
//             </div>
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setShowGroupCreation(false)}
//                 className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={createGroup}
//                 className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
//               >
//                 Create
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useRef } from "react";
import socket from "@/app/utils/socket";
import EmojiPicker from "emoji-picker-react";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [mode, setMode] = useState("");
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

  // Session persistence
  useEffect(() => {
    const savedUsername = localStorage.getItem("chatUsername");
    const savedJoined = localStorage.getItem("chatJoined");
    const savedMode = localStorage.getItem("chatMode");

    if (savedUsername && savedJoined === "true" && savedMode) {
      setUsername(savedUsername);
      setJoined(true);
      setMode(savedMode);
      socket.emit("join", savedUsername);
    }
  }, []);

  useEffect(() => {
    if (username && joined) {
      localStorage.setItem("chatUsername", username);
      localStorage.setItem("chatJoined", joined);
      localStorage.setItem("chatMode", mode);
    }
  }, [username, joined, mode]);

  // Socket event listeners
  useEffect(() => {
    socket.on("userList", (data) => {
      setUsers(data.map((u) => u.username));
      setOnlineUsers(new Map(data.map((u) => [u.username, u.online])));
    });

    socket.on("userStatus", ({ username, online }) => {
      setOnlineUsers((prev) => new Map(prev).set(username, online));
    });

    socket.on("groupList", (groups) => {
      setJoinedGroups(groups.map((g) => g.name));
      setGroupMap(Object.fromEntries(groups.map((g) => [g.name, { members: g.members, admins: g.admins || [] }])));
    });

    socket.on("privateMessage", ({ sender, text }) => {
      setMessages((prev) => [...prev, { sender, text }]);
    });

    socket.on("groupMessage", ({ groupName, sender, text }) => {
      setMessages((prev) => [
        ...prev,
        { sender: `[${groupName}] ${sender}`, text },
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

    socket.on("removedFromGroup", ({ groupName }) => {
      setJoinedGroups((prev) => prev.filter((g) => g !== groupName));
      setGroupMap((prev) => {
        const newMap = { ...prev };
        delete newMap[groupName];
        return newMap;
      });
      if (groupName === groupName) {
        setGroupName("");
        setMessages([]);
      }
      setNotification(`You were removed from group: ${groupName}`);
      setTimeout(() => setNotification(""), 3000);
    });

    socket.on("messageHistory", (history) => {
      setMessages(history);
    });

    socket.on("error", ({ message }) => {
      setError(message);
      setTimeout(() => setError(""), 3000);
    });

    return () => {
      socket.off("userList");
      socket.off("userStatus");
      socket.off("groupList");
      socket.off("privateMessage");
      socket.off("groupMessage");
      socket.off("groupCreated");
      socket.off("groupUpdated");
      socket.off("removedFromGroup");
      socket.off("messageHistory");
      socket.off("error");
    };
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleJoin = () => {
    if (username.trim()) {
      socket.emit("join", username);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    if (mode === "private" && receiver) {
      socket.emit("privateMessage", { toUsername: receiver, text: message });
    } else if (mode === "group" && groupName) {
      socket.emit("groupMessage", { groupName, sender: username, text: message });
    }
    setMessage("");
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

  const resetChat = () => {
    localStorage.removeItem("chatUsername");
    localStorage.removeItem("chatJoined");
    localStorage.removeItem("chatMode");
    setJoined(false);
    setUsername("");
    setMode("");
    setMessages([]);
    setGroupName("");
    setGroupMembers([]);
    setReceiver("");
    setGroupMap({});
    setJoinedGroups([]);
    setOnlineUsers(new Map());
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
    socket.emit("addAdmin", { groupName, username: targetUsername });
  };

  const removeAdmin = (targetUsername) => {
    socket.emit("removeAdmin", { groupName, username: targetUsername });
  };

  const removeMember = (targetUsername) => {
    socket.emit("removeMember", { groupName, username: targetUsername });
  };

  const exitGroup = () => {
    socket.emit("exitGroup", { groupName });
  };

  const getAvatar = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  if (!joined) {
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
            className="w-full border-2 border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            data-testid="username-input"
          />
          <button
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105"
            onClick={handleJoin}
            data-testid="join-button"
          >
            Join Chat
          </button>
        </div>
      </div>
    );
  }

  if (!mode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all hover:scale-105">
          <h2 className="text-2xl font-semibold text-center text-green-600 mb-6">Choose Chat Type</h2>
          <button
            onClick={() => setMode("private")}
            className="w-full bg-green-600 text-white p-3 rounded-lg mb-4 hover:bg-green-700 transition-all transform hover:scale-105"
            data-testid="private-chat-button"
          >
            One-to-One Chat
          </button>
          <button
            onClick={() => setMode("group")}
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105"
            data-testid="group-chat-button"
          >
            Group Chat
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
          <button
            onClick={resetChat}
            className="text-white hover:text-gray-200 transition"
            data-testid="logout-button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
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
              className="flex-1 p-4 overflow-y-auto bg-[url('https://i.imgur.com/8zK9f3J.png')] bg-repeat"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-4 flex ${
                    msg.sender === "You" ? "justify-end" : "justify-start"
                  } animate-slide-in`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-2xl shadow-md ${
                      msg.sender === "You"
                        ? "bg-green-500 text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    <p className="text-xs font-medium">{msg.sender}</p>
                    <p>{msg.text}</p>
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

      {/* Group Creation Modal (WhatsApp-Like) */}
      {showGroupCreation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl transform transition-all">
            <h2 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
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