const { Sequelize } = require("sequelize");
const config = require("../config/config.json");

const sequelize = new Sequelize(config.production);

const User = require("./User.js")(sequelize, Sequelize);
const Category = require("./Category.js")(sequelize, Sequelize);
const Product = require("./Product.js")(sequelize, Sequelize);
const Order = require("./Order.js")(sequelize, Sequelize);
const OrderDetail = require("./OrderDetail")(sequelize, Sequelize); // Added this line
const Review = require("./Review.js")(sequelize, Sequelize);
const Post = require("./Post.js")(sequelize, Sequelize);
const Comment = require("./Comment.js")(sequelize, Sequelize);
const PostLike = require("./PostLike.js")(sequelize, Sequelize);
const PostShare = require("./PostShare.js")(sequelize, Sequelize);
const OrderNotification = require("./OrderNotification.js")(
  sequelize,
  Sequelize
);
const Store = require("./Store.js")(sequelize, Sequelize);
const ShoppingCart = require("./ShoppingCart.js")(sequelize, Sequelize);

// Associations
User.associate(sequelize.models);
Category.associate(sequelize.models);
Product.associate(sequelize.models);
Order.associate(sequelize.models);
OrderDetail.associate(sequelize.models); // Added association
Review.associate(sequelize.models);
Post.associate(sequelize.models);
Comment.associate(sequelize.models);
PostLike.associate(sequelize.models);
PostShare.associate(sequelize.models);
OrderNotification.associate(sequelize.models);
Store.associate(sequelize.models);
ShoppingCart.associate(sequelize.models);

// Rest of file

const models = {
  User,
  Category,
  Product,
  Order,
  OrderDetail,
  Review,
  Post,
  Comment,
  PostLike,
  PostShare,
  OrderNotification,
  Store,
  ShoppingCart,
};

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
