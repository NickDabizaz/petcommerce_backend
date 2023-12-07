module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_name: DataTypes.STRING(255),
      product_description: DataTypes.TEXT,
      price: DataTypes.INTEGER,
      rating: DataTypes.FLOAT,
      category_id: DataTypes.INTEGER,
      store_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      paranoid: true,
      tableName: 'products'
    }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.Category, { foreignKey: "category_id" });
    Product.belongsTo(models.Store, { foreignKey: "store_id" });
    Product.hasMany(models.OrderDetail, { foreignKey: "product_id" });
    Product.hasMany(models.Review, { foreignKey: "product_id" });
    Product.hasMany(models.ShoppingCart, { foreignKey: "product_id" });
  };

  return Product;
};
