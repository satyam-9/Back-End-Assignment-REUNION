// src/controllers/postController.js
const Post = require("../models/Post");
const User = require("../models/User");

exports.addPost = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from the decoded token
        const { title, description } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const newPost = new Post({
            author: userId,
            title,
            description,
        });

        await newPost.save();
        res.json({
            postId: newPost._id,
            title: newPost.title,
            description: newPost.description,
            created_at: newPost.created_at,
        });
    } catch (error) {
        res.status(500).json({ error: "An error occurred." });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from the decoded token
        const postId = req.params.id;

        const post = await Post.findOneAndDelete({
            _id: postId,
            author: userId,
        });
        if (!post) {
            return res.status(404).json({ error: "Post not found." });
        }

        res.json({ message: "Post deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "An error occurred." });
    }
};

exports.likePost = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from the decoded token
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found." });
        }

        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
            await post.save();
        }

        res.json({ message: "Post liked successfully." });
    } catch (error) {
        res.status(500).json({ error: "An error occurred." });
    }
};

exports.unlikePost = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from the decoded token
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found." });
        }

        if (post.likes.includes(userId)) {
            post.likes.pull(userId);
            await post.save();
        }

        res.json({ message: "Post unliked successfully." });
    } catch (error) {
        res.status(500).json({ error: "An error occurred." });
    }
};

exports.addComment = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from the decoded token
        const postId = req.params.id;
        const { comment } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found." });
        }

        post.comments.push({ text: comment, author: userId });
        await post.save();

        const addedComment = post.comments[post.comments.length - 1];

        res.json({ commentId: addedComment._id });
    } catch (error) {
        res.status(500).json({ error: "An error occurred." });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId).populate(
            "likes comments.author",
            "username"
        );
        if (!post) {
            return res.status(404).json({ error: "Post not found." });
        }

        res.json({
            id: post._id,
            title: post.title,
            description: post.description,
            created_at: post.created_at,
            likes: post.likes.length,
            comments: post.comments.map((comment) => ({
                id: comment._id,
                text: comment.text,
                author: comment.author.username,
            })),
        });
    } catch (error) {
        res.status(500).json({ error: "An error occurred." });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from the decoded token

        const posts = await Post.find({ author: userId })
            .sort({ created_at: -1 })
            .populate("likes comments.author", "username")
            .exec();

        const formattedPosts = posts.map((post) => ({
            id: post._id,
            title: post.title,
            description: post.description,
            created_at: post.created_at,
            likes: post.likes.length,
            comments: post.comments.length,
        }));

        res.json(formattedPosts);
    } catch (error) {
        res.status(500).json({ error: "An error occurred." });
    }
};

// Other post controller functions...
