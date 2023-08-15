
const express = require("express");
const {User} = require('../models/User')
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get("/user", async (req, res) => {
    try {
        const userId = req.user.id; //extract user id from the token
        const user = await User.findById(userId).populate(
            "followers following"
        );

        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }

        const profile = {
            username: user.username,
            followersCount: user.followers.length,
            followingCount: user.following.length,
        };

        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: "an error occurred" });
    }
});

router.post('/post', async(req, res)=>{
    let user = new User({
        email: req.body.email,
        password: req.body.password       
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})


router.post("/follow/:id", async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from the decoded token
        const targetUserId = req.params.id;

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!user || !targetUser) {
            return res.status(404).json({ error: "User not found." });
        }

        if (user.following.includes(targetUserId) || targetUserId === userId) {
            return res.status(400).json({ error: "Cannot follow this user." });
        }

        user.following.push(targetUserId);
        targetUser.followers.push(userId);

        await user.save();
        await targetUser.save();

        res.json({ message: "User followed successfully." });
    } catch (error) {
        res.status(500).json({ error: "An error occurred." });
    }
});

router.post("/unfollow/:id", async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from the decoded token
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
});

router.post("api/authenticate", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const passwordMatch = (password === user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const token = jwt.sign(
            {
                id:user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {expiresIn: '1d'}

        )
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "An error occurred." });
    }
});

module.exports = router;
