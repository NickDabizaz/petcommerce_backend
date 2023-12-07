module.exports = (sequelize, DataTypes) => {
    const PostLike = sequelize.define('PostLike', {
      like_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      post_id:{
        type: DataTypes.INTEGER,
      },
    },
    {
      paranoid: true,
      tableName: 'postlikes'
    });
  
    PostLike.associate = (models) => {
      PostLike.belongsTo(models.User, { foreignKey: 'user_id' });
      PostLike.belongsTo(models.Post, { foreignKey: 'post_id' });
    };
  
    return PostLike;
  };