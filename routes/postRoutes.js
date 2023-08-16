// src/routes/postRoutes.js
const express = require("express");
const PostController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/api/posts", authMiddleware.authenticateMiddleware, PostController.addPost);
router.delete(
    "/api/posts/:id",
    authMiddleware.authenticateMiddleware,
    PostController.deletePost
);
router.post(
    "/api/like/:id",
    authMiddleware.authenticateMiddleware,
    PostController.likePost
);
router.post(
    "/api/unlike/:id",
    authMiddleware.authenticateMiddleware,
    PostController.unlikePost
);
router.post(
    "/api/comment/:id",
    authMiddleware.authenticateMiddleware,
    PostController.addComment
);
router.get(
    "/api/posts/:id",
    authMiddleware.authenticateMiddleware,
    PostController.getPostById
);
router.get(
    "/api/all_posts",
    authMiddleware.authenticateMiddleware,
    PostController.getAllPosts
);

module.exports = router;
