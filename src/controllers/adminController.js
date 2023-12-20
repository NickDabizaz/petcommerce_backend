const { User, Post, Store, Product, Order, OrderDetail, sequelize, PostLike, Comment } = require('../models');



const viewAllUsers = async (req, res) => {

  try {

    // Get all users
    const users = await User.findAll();

    // console.log(users.dataValues);

    const tempArrayLengkap = await Promise.all(
      users.map(async (item) => {

        console.log(item.dataValues.user_id);

        const getJumlahTrasaksi = await Order.findAll({
          where: {
            user_id: item.dataValues.user_id,
          },
        });

        console.log(getJumlahTrasaksi.length);

        const getLast = await Order.findOne({
          where: {
            user_id: item.dataValues.user_id,
          },
          order: [["order_date", "DESC"]],
        });

        console.log(getLast);

        if (getJumlahTrasaksi.length > 0 && getLast) {

          return {
            user_id: item.dataValues.user_id,
            name: item.dataValues.name,
            email: item.dataValues.email,
            jumlah_transaksi: getJumlahTrasaksi.length,
            transaksi_terakhir: new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }).format(getLast.dataValues.order_date)
          };

        } else {

          return {
            user_id: item.dataValues.user_id,
            name: item.dataValues.name,
            email: item.dataValues.email,
            jumlah_transaksi: 0,
            transaksi_terakhir: "-"
          };

        }

      })
    )

    const sortedResults = tempArrayLengkap.sort(
      (a, b) => a.user_id - b.user_id
    );

    res.status(200).json(sortedResults);


  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting users");
  }

};

const viewAllPosts = async (req, res) => {

  try {

    // Get all posts
    const posts = await Post.findAll();

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
    const post = await Post.findByPk(post_id);
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
    const user = await User.findByPk(user_id);

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

const viewAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      attributes: ['store_id', 'store_name', 'store_description'],
      include: [
        {
          model: User,
          attributes: ['user_id', 'name'],
        },
      ],
    });

    // Transformasi hasil query sesuai dengan kebutuhan
    const transformedStores = stores.map(store => ({
      store_id: store.store_id,
      store_name: store.store_name,
      store_description: store.store_description,
      owner: store.User ? store.User.name : null,
    }));

    res.status(200).json(transformedStores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const viewStoreDetail = async (req, res) => {
  const { store_id } = req.params;

  try {
    const store = await Store.findOne({
      where: { store_id },
      attributes: ['store_id', 'store_name', 'store_description'],
      include: [
        {
          model: Product,
          attributes: ['product_id', 'product_name', 'quantity', 'price'],
          include: [
            {
              model: OrderDetail,
              attributes: ['detail_id', 'order_id', 'qty', 'subtotal'],
              include: [
                {
                  model: Order,
                  attributes: ['order_date'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Transformasi hasil query sesuai dengan kebutuhan
    const transformedStore = {
      store_id: store.store_id,
      store_name: store.store_name,
      store_description: store.store_description,
      products: store.Products.map(product => ({
        product_id: product.product_id,
        product_name: product.product_name,
        quantity: product.quantity,
        price: product.price,
        order_details: product.OrderDetails.map(orderDetail => ({
          detail_id: orderDetail.detail_id,
          order_id: orderDetail.order_id,
          qty: orderDetail.qty,
          subtotal: orderDetail.subtotal,
          order_date: orderDetail.Order ? new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }).format(orderDetail.Order.order_date) : null,
        })),
      })),
    };

    res.status(200).json(transformedStore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const viewPostDetails = async (req, res) => {
  const { post_id } = req.params;

  try {
    const post = await Post.findOne({
      where: { post_id },
      attributes: ['post_id', 'title'],
      include: [
        {
          model: PostLike,
          attributes: ['like_id'],
          include: [
            {
              model: User,
              attributes: ['user_id', 'name'],
            },
          ],
        },
        {
          model: Comment,
          attributes: ['comment_id', 'comment_text', 'comment_time'],
          include: [
            {
              model: User,
              attributes: ['user_id', 'name'],
            },
          ],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Transformasi hasil query sesuai dengan kebutuhan
    const transformedPost = {
      post_id: post.post_id,
      title: post.title,
      likes: post.PostLikes.map(like => ({
        like_id: like.like_id,
        user: {
          user_id: like.User.user_id,
          name: like.User.name,
        },
      })),
      comments: post.Comments.map(comment => ({
        comment_id: comment.comment_id,
        comment_text: comment.comment_text,
        comment_time: new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(comment.comment_time),
        user: {
          user_id: comment.User.user_id,
          name: comment.User.name,
        },
      })),
    };

    res.status(200).json(transformedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteComment = async (req, res) => {
  const { comment_id } = req.params;

  try {
    // Cek apakah komentar dengan ID tersebut ada
    const comment = await Comment.findByPk(comment_id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Hapus komentar
    await Comment.destroy({
      where: { comment_id },
    });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const viewAllTransactions = async (req, res) => {
  try {
    const transactions = await Order.findAll({
      attributes: ['order_id', 'order_date', 'total_price'],
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: OrderDetail,
          attributes: [
            [sequelize.fn('SUM', sequelize.col('qty')), 'total_quantity'],
          ],
          include: [
            {
              model: Product,
              attributes: [],
            },
          ],
        },
      ],
      group: ['Order.order_id', 'User.user_id'],
    });

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


const viewTransactionDetails = async (req, res) => {
  const { order_id } = req.params;

  try {
    const transactionDetails = await OrderDetail.findAll({
      where: { order_id },
      include: [
        {
          model: Product,
          attributes: ['product_id', 'product_name', 'price'],
        },
      ],
    });

    if (transactionDetails.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transactionDetails);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  viewAllUsers,
  viewAllPosts,
  deleteUserPost,
  deleteUser,
  viewAllStores,
  viewStoreDetail,
  viewPostDetails,
  deleteComment,
  viewAllTransactions,
  viewTransactionDetails,
};

