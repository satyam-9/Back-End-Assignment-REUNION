// src/index.js
const express = require("express");
const mongoose = require("mongoose");
// const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

// Load environment variables
require("dotenv").config();  

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "socialMedia",
});

app.use(express.json());

// API routes
// app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
