module.exports = (sequelize, DataTypes) => {
    const ShoppingCart = sequelize.define('ShoppingCart', {
      cart_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      qty: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      paranoid: true,
      tableName: 'shoppingcarts'
    });
  
    ShoppingCart.associate = (models) => {
      ShoppingCart.belongsTo(models.User, { foreignKey: 'user_id' });
      ShoppingCart.belongsTo(models.Product, { foreignKey: 'product_id' });
    };
  
    return ShoppingCart;
  };

  