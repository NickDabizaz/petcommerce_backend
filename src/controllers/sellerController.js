const models = require("../models");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");

const createStore = async (req, res) => {
  const { user_id, store_name, store_description } = req.body;

  try {
    // Validate seller role
    const user = await models.User.findByPk(user_id);

    if (!user || user.role !== "seller") {
      return res
        .status(403)
        .send("You don't have permission to create a store");
    }

    // Generate store id
    const highestStore = await models.Store.max("store_id");
    const nextId = highestStore ? highestStore + 1 : 1;

    // Create new store
    const store = await models.Store.create({
      store_id: nextId,
      store_name,
      store_description,
      user_id,
    });

    // Return created store
    res.json(store);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating store");
  }
};

const getStorePic = (req, res) => {
  const store_id = req.params.store_id;
  const lokasinya = `uploads/store/${store_id}.jpg`;
  return res.status(200).sendFile(lokasinya, { root: "." });
};

const addProduct = async (req, res) => {
  const {
    user_id,
    store_id,
    product_name,
    product_description,
    price,
    quantity,
    rating,
    category_id,
  } = req.body;

  console.log(req.body);

  try {
    // Validate seller role
    const user = await models.User.findByPk(user_id);

    if (!user || user.role !== "seller") {
      return res.status(403).send("You don't have permission to add products");
    }

    // Generate product id
    const latestProduct = await models.Product.max('product_id', {
      where: {
        deletedAt: null,
      },
    });

    let nextProductId = 1;

    if (latestProduct) {
      nextProductId = latestProduct + 1;
    }

    // Create new product
    const product = await models.Product.create({
      product_id: nextProductId,
      product_name,
      product_description,
      price,
      quantity,
      store_id,
      rating,
      category_id,
    });

    // Return created product
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding product");
  }
};

const getProductPic = (req, res) => {
  const product_id = req.params.product_id;
  const lokasinya = `uploads/product/${product_id}.jpg`;
  return res.status(200).sendFile(lokasinya, { root: "." });
};

const editProduct = async (req, res) => {
  const { store_id } = req.params;
  const { product_id } = req.params;

  // const { data } = req.body;
  const {
    user_id,
    product_name,
    product_description,
    price,
    quantity,
    rating,
    category_id,
  } = req.body;

  try {
    // Validate seller permission
    const user = await models.User.findByPk(req.body.data.user_id);
    const product = await models.Product.findByPk(product_id);
    const store = await models.Store.findByPk(store_id);

    console.log(req.body.user_id);
    console.log(user_id);
    console.log(store_id);
    console.log(req.body.data.user_id);

    if (!user || user.role !== "seller" || store.user_id !== user.user_id) {
      return res
        .status(403)
        .send("You don't have permission to edit this product");
    }

    const temp = {
      product_name: req.body.data.product_name,
      product_description: req.body.data.product_description,
      price: req.body.data.price,
      quantity: req.body.data.quantity,
      rating: req.body.data.rating,
      category_id: req.body.data.category_id,
    };

    // Update product
    await product.update(temp);

    // Return updated product
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error editing product");
  }
};

const deleteProduct = async (req, res) => {
  const { user_id } = req.body;
  const { store_id } = req.params;
  const { product_id } = req.params;

  try {
    // Validate seller permission
    const user = await models.User.findByPk(user_id);
    const product = await models.Product.findByPk(product_id);
    const store = await models.Store.findByPk(store_id);

    console.log(store);

    if (!user || user.role !== "seller") {
      return res
        .status(403)
        .send("You don't have permission to delete this product");
    }

    if (!product || store.user_id !== user.user_id) {
      return res
        .status(403)
        .send("You don't have permission to delete this product");
    }

    // Delete product
    await models.Product.destroy({ where: { product_id } });

    // Return response
    res.send("Product deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting product");
  }
};

const viewProducts = async (req, res) => {
  const { user_id } = req.params;

  try {
    // Validate seller role
    const user = await models.User.findByPk(user_id);

    if (!user || user.role !== "seller") {
      return res.status(403).send("You don't have permission to view products");
    }

    // Get products
    const products = await models.Product.findAll({
      where: { store_id: user_id },
    });

    // Return products
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting products");
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await models.Product.findAll({
      include: [
        {
          model: models.Category,
          attributes: ["category_name"],
        },
        {
          model: models.Store,
          attributes: ["store_name"],
        },
      ],
      attributes: {
        exclude: ["category_id", "store_id"], // Exclude category_id and store_id
      },
    });

    // Manipulasi hasil untuk memformat sesuai keinginan Anda
    const formattedProducts = products.map((product) => {
      const product_id = product.product_id;
      const lokasinya = `uploads/product/${product_id}.jpg`;

      return {
        product_id: product.product_id,
        product_name: product.product_name,
        product_description: product.product_description,
        product_img: lokasinya,
        price: product.price,
        rating: product.rating,
        category_name: product.Category.category_name,
        store_name: product.Store.store_name,
        quantity: product.quantity,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        deletedAt: product.deletedAt,
      };
    });

    res.status(200).json(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailStore = async (req, res) => {
  const { store_id } = req.params;

  try {
    const storeData = await models.Store.findOne({
      where: { store_id: store_id },
      include: [
        { model: models.User, attributes: ["name", "user_id"] },
        { model: models.Product }, // Menambahkan relasi untuk mendapatkan produk
      ],
    });

    if (!storeData) {
      return res.status(404).json({ message: "Toko tidak ditemukan" });
    }

    console.log(storeData);

    const products = storeData.Products.map((product) => ({
      product_id: product.product_id,
      product_name: product.product_name,
      price: product.price,
      rating: product.rating,
      category_id: product.category_id,
      quantity: product.quantity,
    }));

    const result = {
      store_id: storeData.store_id,
      store_name: storeData.store_name,
      store_description: storeData.store_description,
      owner: storeData.User.name,
      owner_id: storeData.User.user_id,
      products: products, // Menambahkan data produk
    };

    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengambil data toko" });
  }
};

const searchProduct = async (req, res) => {
  try {
    const { q } = req.query;
    console.log(q);
    const processKeyword = `%${q}%`;
    const results = await models.Product.findAll({
      where: { product_name: { [Op.like]: processKeyword } },
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductDetail = async (req, res) => {
  try {
    const { product_id } = req.params;
    const product = await models.Product.findOne({
      where: { product_id: product_id },
      include: [
        {
          model: models.Store,
          attributes: ["store_name"],
        },
        {
          model: models.Category,
          attributes: ["category_name"],
        },
      ],
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const productDetail = {
      product_id: product.product_id,
      product_name: product.product_name,
      product_description: product.product_description,
      price: product.price,
      rating: product.rating,
      category_id: product.category_id,
      store_id: product.store_id,
      quantity: product.quantity,
      store_name: product.Store.store_name,
      category_name: product.Category.category_name,
      subtotal: product.price * product.quantity,
    };
    res.status(200).json(productDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStore,
  addProduct,
  editProduct,
  deleteProduct,
  viewProducts,
  getAllProducts,
  getDetailStore,
  searchProduct,
  getProductDetail,
  getProductPic,
  getStorePic,
};
