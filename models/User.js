// src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: String,
    password: String, // For simplicity, store plain text passwords (not recommended in production)
    name: String, 
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("User", userSchema);
