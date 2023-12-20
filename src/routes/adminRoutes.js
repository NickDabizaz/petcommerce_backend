const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/users', adminController.viewAllUsers);
router.delete('/users/:user_id', adminController.deleteUser);

router.get('/posts', adminController.viewAllPosts)
router.get('/posts/:post_id/details', adminController.viewPostDetails);
router.delete('/posts/:post_id', adminController.deleteUserPost);

router.delete('/comment/:comment_id', adminController.deleteComment);

router.get('/store', adminController.viewAllStores);
router.get('/store/:store_id', adminController.viewStoreDetail);

router.get('/transactions', adminController.viewAllTransactions);
router.get('/transactions/:order_id/details', adminController.viewTransactionDetails);


module.exports = router;