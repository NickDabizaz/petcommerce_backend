// Importing Dependencies
const { Order, OrderDetail, Sequelize, Product } = require("../models");
const Op = Sequelize.Op;
const db = require("../models");

// Create a new order
const createNewOrder = async (req, res) => {
  try {
    // Find the latest order in the database
    const latestOrder = await Order.findOne({ order: [["order_id", "DESC"]] });

    // Get the next order ID by incrementing the latest order ID by 1
    const nextOrderId = latestOrder ? latestOrder.order_id + 1 : 1;

    // Create a new order with the next order ID
    const order = new Order({
      user_id: req.body.user_id,
      order_id: nextOrderId,
      order_date: new Date(),
      total_price: req.body.total_price,
    });

    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get an order by user_id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findAll({
      where: { user_id: req.params.user_id },
    });
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addProductToOrder = async (req, res) => {
  try {
    // Find the latest order based on user_id
    const order = await Order.findOne({
      where: { user_id: req.params.user_id },
      order: [["order_id", "DESC"]],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found for the user" });
    }

    // Get the product_id from the request body
    const product = await Product.findOne({
      where: { product_id: req.body.product_id },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calculate the subtotal based on the product price and quantity
    const subtotal = product.price * req.body.qty;

    // Create a new order detail
    const orderDetail = new OrderDetail({
      order_id: order.order_id,
      product_id: req.body.product_id,
      qty: req.body.qty,
      subtotal: subtotal,
    });

    const newOrderDetail = await orderDetail.save();

    res.status(201).json(newOrderDetail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get order details by order_id
const getOrderDetailsById = async (req, res) => {
  try {
    console.log({ orderId: req.params.order_id });
    const orderDetails = await OrderDetail.findAll({
      where: { order_id: req.params.order_id },
      include: [
        {
          model: Product,
          attributes: ["product_id", "product_name", "price"],
          as: "Product",
        },
      ],
      attributes: [
        "detail_id",
        "order_id",
        "qty",
        "subtotal",
        "createdAt",
        "updatedAt",
        "deletedAt",
      ],
    });

    if (orderDetails && orderDetails.length > 0) {
      let total = 0; // Inisialisasi total

      const formattedResponse = {
        order_id: orderDetails[0].order_id,
        products: orderDetails.map((detail) => {
          // Menghitung total untuk setiap produk
          total += detail.subtotal;

          return {
            detail_id: detail.detail_id,
            product_id: detail.Product.product_id,
            product_name: detail.Product.product_name,
            price: detail.Product.price,
            qty: detail.qty,
            subtotal: detail.subtotal,
          };
        }),
        total: total, // Menambahkan total ke respons
      };

      res.status(200).json(formattedResponse);
    } else {
      res.status(404).json({ message: "Order details not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCountProductId = async (req, res) => {
  const { product_id } = req.params;

  OrderDetail.sum("qty", { where: { product_id: product_id } })
    .then((totalQty) => {
      if (totalQty === null) {
        res.send({ totalQty: 0 });
      } else {
        res.send({ totalQty });
      }
    })
    .catch((error) => res.status(500).send({ error: error.message }));
};

const reportByProduct = async (req, res) => {
  try {
    const { store_id } = req.params;

    const products = await db.Product.findAll({
      where: { store_id: store_id }, // Filter products by store_id
      attributes: ['product_id'], // Only include product_id in the response
    });

    const productIds = products.map((product) => product.product_id);

    const orderDetails = await db.OrderDetail.findAll({
      where: { product_id: productIds },
      attributes: ['order_id'],
    });

    const uniqueOrderIds = [...new Set(orderDetails.map((orderDetail) => orderDetail.order_id))];

    res.status(200).json({ data: uniqueOrderIds.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

async function getTotalTransactionProduct(req, res, next) {
  const { product_id } = req.params;

  try {
    const product = await Product.findByPk(product_id, {
      include: [
        {
          model: OrderDetail,
          attributes: [
            [db.sequelize.fn('sum', db.sequelize.col('qty')), 'total_quantity'],
          ],
          raw: true,
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Extracting the total quantity directly from the OrderDetails array
    const totalQuantity = product.OrderDetails?.total_quantity || 0;

    return res.json({ productName : product.product_name, totalQuantity : product.OrderDetails[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}



// Exporting the functions
module.exports = {
  getOrderById,
  createNewOrder,
  getOrderDetailsById,
  addProductToOrder,
  getCountProductId,
  reportByProduct,
  getTotalTransactionProduct
};
