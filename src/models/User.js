module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: DataTypes.STRING(255),
      email: DataTypes.STRING(255),
      password: DataTypes.STRING(255),
      address: DataTypes.STRING(255),
      phone_number: DataTypes.STRING(15),
      token: DataTypes.STRING(255),
      role: DataTypes.STRING(20)
    },
    {
      paranoid: true,
      tableName: 'users'
    });
  
    User.associate = (models) => {
      // Define associations here
      User.hasMany(models.Order, { foreignKey: 'user_id' });
      User.hasMany(models.Review, { foreignKey: 'user_id' });
      User.hasMany(models.Post, { foreignKey: 'user_id' });
      User.hasMany(models.Comment, { foreignKey: 'user_id' });
      User.hasMany(models.PostLike, { foreignKey: 'user_id' });
      User.hasMany(models.PostShare, { foreignKey: 'user_id' });
      User.hasMany(models.OrderNotification, { foreignKey: 'user_id' });
      User.hasMany(models.Store, { foreignKey: 'user_id' });
      User.hasMany(models.ShoppingCart, { foreignKey: 'user_id' });
    };
  
    return User;
  };