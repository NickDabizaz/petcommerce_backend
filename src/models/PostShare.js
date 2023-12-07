module.exports = (sequelize, DataTypes) => {
    const PostShare = sequelize.define('PostShare', {
      share_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      link: DataTypes.STRING(255),
      user_id: {
        type: DataTypes.INTEGER,
      },
      post_id:{
        type: DataTypes.INTEGER,
      },
    },
    {
      paranoid: true,
      tableName: 'postshares'
    });
  
    PostShare.associate = (models) => {
      PostShare.belongsTo(models.User, { foreignKey: 'user_id' });
      PostShare.belongsTo(models.Post, { foreignKey: 'post_id' });
    };
  
    return PostShare;
  };