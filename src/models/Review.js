module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
      review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      rating: DataTypes.FLOAT,
      comment: DataTypes.TEXT
    },
    {
      paranoid: true,
      tableName: 'reviews'
    });
  
    Review.associate = (models) => {
      Review.belongsTo(models.User, { foreignKey: 'user_id' });
      Review.belongsTo(models.Product, { foreignKey: 'product_id' });
    };
  
    return Review;
  };