
const express = require('express');
const router = express.Router();
const { addToCart, getCart, getOneCart, updateCart, deleteCart, deleteOneItem } = require('../controllers/cartController.js');

// Route untuk menambahkan cart
router.post('/', addToCart);

// Route untuk mendapatkan cart
router.get('/:user_id', getCart);

// Route untuk menngecek apakah produk sudah ada di dalam cart
router.get('/:user_id/:product_id', getOneCart);

// Route untuk mengupdate cart
router.put('/:user_id', updateCart);

// Route untuk menghapus 1 cart item
router.delete('/:product_id/:user_id', deleteOneItem)

// Route untuk menghapus cart
router.delete('/:user_id', deleteCart);

module.exports = router;
