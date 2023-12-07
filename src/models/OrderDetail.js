module.exports = (sequelize, DataTypes) => {
    const OrderDetail = sequelize.define('OrderDetail', {
      detail_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      order_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      subtotal: DataTypes.INTEGER
    }, 
    {
      paranoid: true,
      tableName: 'orderdetails'
    });
  
    OrderDetail.associate = (models) => {
      OrderDetail.belongsTo(models.Order, { foreignKey: 'order_id'});
      OrderDetail.belongsTo(models.Product, { foreignKey: 'product_id'});
    };
  
    return OrderDetail;
  };