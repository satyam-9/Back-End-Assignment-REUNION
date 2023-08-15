const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: String,
    email: {
        type: String,
        required: true,
    },
    password:{
        type: String,
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
});

module.exports = mongoose.model('User',userSchema);