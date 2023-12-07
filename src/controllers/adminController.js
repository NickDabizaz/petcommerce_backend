const models = require('../models');

const viewAllUsers = async (req, res) => {

  try {

    // Get all users
    const users = await models.User.findAll();

    // Return users
    res.json(users);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting users");
  }

};

const viewAllPosts = async (req, res) => {

  try {

    // Get all posts
    const posts = await models.Post.findAll();

    // Return posts
    res.json(posts);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting posts");
  }

};

const deleteUserPost = async (req, res) => {
  const { post_id } = req.params;

  try {
    const post = await models.Post.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.destroy();

    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {

  const { user_id } = req.params;

  try {

    // Find target user
    const user = await models.User.findByPk(user_id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Delete user
    await user.destroy();

    // Return response
    res.send("User deleted successfully");

  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting user");
  }

};

module.exports = {
  viewAllUsers,
  viewAllPosts,
  deleteUserPost,
  deleteUser
};