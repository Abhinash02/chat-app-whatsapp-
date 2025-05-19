// const mongoose = require("mongoose");

// const groupSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   members: [{ type: String }], // usernames
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Group", groupSchema);

// const mongoose = require("mongoose");

// const groupSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   members: [{ type: String }], // usernames
//   admins: [{ type: String }], // usernames of admins
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Group", groupSchema);

const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  members: [{ type: String }],
  admins: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Group", groupSchema);