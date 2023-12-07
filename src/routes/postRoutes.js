// routes/post.js

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require("../utils/multerConfig")

router.post('/:type', upload.single("file"), postController.addPost);

router.get('/pic/:post_id', postController.getPostPic);

router.get('/', postController.getAllPosts);

router.get('/:id', postController.getPostById);

router.put('/:id', postController.updatePost);

router.delete('/:id', postController.deletePost);

module.exports = router;