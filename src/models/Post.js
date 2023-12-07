module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
      post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: DataTypes.STRING(255),
      user_id : DataTypes.INTEGER
    },
    {
      paranoid: true ,
      tableName: 'posts' 
    });
  
    Post.associate = (models) => {
      Post.belongsTo(models.User, { foreignKey: 'user_id' });
      Post.hasMany(models.Comment, { foreignKey: 'post_id' });
      Post.hasMany(models.PostLike, { foreignKey: 'post_id' });
      Post.hasMany(models.PostShare, { foreignKey: 'post_id' });
    };
  
    return Post;
  };