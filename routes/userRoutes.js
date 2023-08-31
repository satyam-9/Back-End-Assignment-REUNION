// src/routes/userRoutes.js
const express = require('express');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const bcrypt = require('bcrypt')

const router = express.Router();

router.post('/authenticate',UserController.authenticate)

router.get('/user', authMiddleware.authenticateMiddleware, UserController.getUserProfile);

router.post("/register", async (req, res) => {  
    const { email, password, name } = req.body;

    try {
        // Check if the email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Email already registered" });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
        });

        await newUser.save();

        res.json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/follow/:id', authMiddleware.authenticateMiddleware, UserController.followUser);
router.post('/unfollow/:id', authMiddleware.authenticateMiddleware, UserController.unfollowUser);

module.exports = router;
