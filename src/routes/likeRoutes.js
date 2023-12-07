
const express = require('express');
const {getLikesByPostId,likePost,unlikePost,getLikeByUserIdAndPostId} = require('../controllers/likeController');

const router = express.Router();

router.post('/', likePost);
router.delete('/', unlikePost);
router.get('/:post_id', getLikesByPostId);
router.get('/user/:user_id/:post_id',getLikeByUserIdAndPostId)

module.exports = router;

