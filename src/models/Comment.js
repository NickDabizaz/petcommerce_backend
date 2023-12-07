module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
      comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      comment_text: DataTypes.TEXT,
      comment_time: DataTypes.DATE,
      user_id: {
        type: DataTypes.INTEGER,
      },
      post_id:{
        type: DataTypes.INTEGER,
      },
    },
    {
      paranoid: true,
      tableName: 'comments'
    });
  
    Comment.associate = (models) => {
      Comment.belongsTo(models.User, { foreignKey: 'user_id' });
      Comment.belongsTo(models.Post, { foreignKey: 'post_id' });
    };
  
    return Comment;
  };