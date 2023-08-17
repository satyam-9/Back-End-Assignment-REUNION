// src/controllers/userController.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require('bcrypt')
// const { generateUserToken } = require("../utils/token");

exports.followUser = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from the decoded token
        const targetUserId = req.params.id;

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!user || !targetUser) {
            return res.status(404).json({ error: "User not found." });
        }

        if (user.following.includes(targetUserId) || targetUserId === userId) {
            return res.status(400).json({ message: "Already following" });
        }

        user.following.push(targetUserId);
        targetUser.followers.push(userId);

        await user.save();
        await targetUser.save();

        res.json({ message: "User followed successfully." });
    } catch (error) {
        res.status(500).json({ error: "An error occurred." });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from the decoded token
        const targetUserId = req.params.id;

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!user || !targetUser) {
            return res.status(404).json({ error: "User not found." });
        }

        if (!user.following.includes(targetUserId) || targetUserId === userId) {
            return res
                .status(400)
                .json({ error: "Cannot unfollow this user." });
        }

        user.following.pull(targetUserId);
        targetUser.followers.pull(userId);

        await user.save();
        await targetUser.save();

        res.json({ message: "User unfollowed successfully." });
    } catch (error) {
        res.status(500).json({ error: "An error occurred." });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from the decoded token
        // console.log(`req.user.id: ${userId}`)
        // console.log('am i print')
        const user = await User.findById(userId)
        // .populate(
        //     "followers following"
        // );

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const profile = {
            username: user.name,
            followersCount: user.followers.length,
            followingCount: user.following.length,
        };
        // console.log(user.followers.length)
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: 'some error' });
    }
};

exports.authenticate = async (req, res) => {
    // Implement user authentication and return a JWT token
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Authentication failed" });
        }
        console.log(user.id)
        const token = jwt.sign({ userId: user._id }, "your-secret-key", {
            expiresIn: "1h",
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Other user controller functions...
