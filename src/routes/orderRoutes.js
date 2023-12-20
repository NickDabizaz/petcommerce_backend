const express = require("express");
const router = express.Router();
const {
  getOrderById,
  createNewOrder,
  getOrderDetailsById,
  addProductToOrder,
  getCountProductId,
  reportByProduct,
  getTotalTransactionProduct
} = require("../controllers/orderController");

// GET a specific order by ID
router.post("/", createNewOrder);
router.get("/:user_id", getOrderById);
router.post("/add/:user_id", addProductToOrder);
router.get("/details/:order_id", getOrderDetailsById);
router.get('/count/:product_id', getCountProductId)
router.get('/report/:store_id', reportByProduct)
router.get('/report/product/:product_id', getTotalTransactionProduct)

module.exports = router;
