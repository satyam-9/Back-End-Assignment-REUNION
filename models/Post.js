// src/models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    description: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
        {
            text: String,
            author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
    ],
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
