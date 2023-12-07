
const express = require('express');
const commentController = require('../controllers/commentController.js');

const router = express.Router();

// Route untuk menambahkan comment
router.post('/', commentController.createComment);

// Route untuk menampilkan comment berdasarkan postingan yang di comment
router.get('/:post_id', commentController.getCommentsByPostId);

// Route untuk menghapus comment
router.delete('/:comment_id', commentController.deleteComment);

module.exports = router;
