const { where, Sequelize, Op } = require("sequelize");
const { Post, User, Comment, PostLike, PostShare } = require("../models");

const addPost = async (req, res) => {
  try {
    const { user_id, title } = req.body;

    const post = await Post.create({
      title,
      user_id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostPic = (req, res) => {
  const post_id = req.params.post_id;
  const lokasinya = `uploads/post/${post_id}.jpg`;
  // ./uploads/esther/profpic.jpg
  return res.status(200).sendFile(lokasinya, { root: "." });
};


const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();
    const tempArrayLengkap = await Promise.all(
      posts.map(async (item) => {
        const user = await User.findOne({ where: { user_id: item.user_id } });
        const like = await PostLike.count({
          where: {
            post_id: item.post_id,
          },
        });
        const share = await PostShare.count({
          where: {
            post_id: item.post_id,
          },
        });

        const tempArray = await Promise.all(
          (
            await Comment.findAll({
              where: { post_id: item.post_id },
            })
          ).map(async (item) => {
            const tempUser = await User.findOne({
              where: { user_id: item.user_id },
            });
            return {
              nama_pengomen: tempUser.name,
              komentar: item.comment_text,
              waktu_komentar: item.comment_time,
            };
          })
        );

        return {
          post_id: item.post_id,
          nama_pengepost: user.name,
          title: item.title,
          createdAt: item.createdAt,
          jumlah_like: like,
          jumlah_share: share,
          comment: tempArray,
        };
      })
    );

    const sortedResults = tempArrayLengkap.sort(
      (a, b) => a.post_id - b.post_id
    );

    res.status(200).json(sortedResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    // Mengambil jumlah like dari model PostLike
    const likeCount = await PostLike.count({ where: { post_id: id } });

    // Mengambil jumlah comment dari model Comment
    const commentCount = await Comment.count({ where: { post_id: id } });

    // Mengambil post, user yang membuat post, dan komentar
    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["name"],
            },
          ],
          order: [["comment_time", "ASC"]],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Memformat komentar
    const formattedComments = post.Comments.map((comment) => ({
      comment_id: comment.dataValues.comment_id,
      comment_text: comment.dataValues.comment_text,
      comment_time: comment.dataValues.comment_time,
      post_id: comment.dataValues.post_id,
      user: comment.dataValues.User.dataValues.name,
    }));

    const result = {
      post_id: id,
      title: post.title,
      nama_pengepost: post.User.name,
      createdAt: post.createdAt,
      jumlah_like: likeCount,
      jumlah_share: 0, // Jumlah share tidak dihitung berdasarkan kode yang ada
      comment: formattedComments,
      jumlah_comment: commentCount,
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, user_id } = req.body;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.title = title;
    post.user_id = user_id;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.destroy();

    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostPic,
};
