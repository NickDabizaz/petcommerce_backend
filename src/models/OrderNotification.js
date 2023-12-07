module.exports = (sequelize, DataTypes) => {
    const OrderNotification = sequelize.define('OrderNotification', {
      notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      date: DataTypes.DATE,
      message: DataTypes.TEXT
    },
    {
      paranoid: true,
      tableName: 'ordernotifications'
    });
  
    OrderNotification.associate = (models) => {
      OrderNotification.belongsTo(models.User, { foreignKey: 'user_id' });
    };
  
    return OrderNotification;
  };