const { PostLike, User } = require("../models");

exports.likePost = async (req, res) => {
  try {
    const { post_id, user_id } = req.body;

    // Check if user has already liked the post
    const existingLike = await PostLike.findOne({
      where: {
        post_id,
        user_id,
        deletedAt: null,
      },
    });

    if (existingLike) {
      return res
        .status(400)
        .json({ message: "User has already liked this post" });
    }

    const newLike = await PostLike.create({
      post_id,
      user_id,
    });

    return res.status(201).json(newLike);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const { post_id, user_id } = req.body;

    // Check if user has liked the post
    const existingLike = await PostLike.findOne({
      where: {
        post_id,
        user_id,
        deletedAt: null,
      },
    });

    if (!existingLike) {
      return res.status(400).json({ message: "User has not liked this post" });
    }

    await existingLike.destroy();

    return res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getLikesByPostId = async (req, res) => {
  try {
    const { post_id } = req.params;

    const likes = await PostLike.findAll({
      where: {
        post_id,
        deletedAt: null,
      },
      include: [
        {
          model: User,
          attributes: ["user_id", "name"],
        },
      ],
    });

    const simplifiedLikes = likes.map(like => ({
      like_id: like.like_id,
      post_id: like.post_id,
      user_id: like.User.user_id,
      user_name: like.User.name
    }));

    return res.status(200).json(simplifiedLikes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getLikeByUserIdAndPostId = async (req, res) => {
  try {
    const { user_id, post_id } = req.params;

    const like = await PostLike.findOne({
      where: {
        user_id,
        post_id,
        deletedAt: null,
      },
    });

    return res.status(200).json(like !== null);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
