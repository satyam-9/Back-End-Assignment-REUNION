// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

exports.authenticateMiddleware = (req, res, next) => {
    // Implement JWT authentication here
    // Set req.user to the authenticated user
    const token = req.header("Authorization").split(' ')[1];
    console.log(token)

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decodedToken = jwt.verify(token, "your-secret-key");
        req.user = { userId: decodedToken.userId };
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};
