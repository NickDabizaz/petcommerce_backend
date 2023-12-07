
const db = require('../models');
const Post = require('../models/Post');
const User = require('../models/User');

const createComment = async (req, res) => {
    try {
        const { comment_text, user_id, post_id } = req.body;

        // Check if user exists
        const user = await db.User.findOne({ where: { user_id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if post exists
        const post = await db.Post.findOne({ where: { post_id } });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Get the last comment id and increment it by 1
        const lastComment = await db.Comment.findOne({
            order: [['comment_id', 'DESC']],
            paranoid: false // Include deleted rows
        });
        const comment_id = lastComment ? lastComment.comment_id + 1 : 1;

        // Create the comment
        const comment = await db.Comment.create({
            comment_id,
            comment_text,
            comment_time: new Date(),
            user_id,
            post_id,
        });

        return res.status(201).json(comment);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const getCommentsByPostId = async (req, res) => {
    try {
        const { post_id } = req.params;

        // Check if post exists
        const post = await Post.findOne({ where: { post_id: post_id } });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Get the comments for the post
        const comments = await Comment.findAll({
            where: { post_id: post_id },
            include: [{ model: User, attributes: ['name'] }],
            order: [['comment_time', 'ASC']]
        });

        console.log(comments[0].dataValues.User.dataValues.name);

        // Check if there are any comments
        if (comments.length === 0) {
            return res.status(404).json({ message: 'No comments found for this post' });
        }

        // Map through the comments to format the output
        const formattedComments = comments.map(comment => ({
            comment_id: comment.dataValues.comment_id,
            comment_text: comment.dataValues.comment_text,
            comment_time: comment.dataValues.comment_time,
            post_id: comment.dataValues.post_id,
            user: comment.dataValues.User.dataValues.name
        }));

        return res.status(200).json(formattedComments);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { comment_id } = req.params;

        // Check if comment exists
        const comment = await db.Comment.findOne({ where: { comment_id: comment_id } });
        if (!comment) {
            return res.status(404).json({ message: `Comment with id ${comment_id} not found` });
        }

        // Delete the comment
        await comment.destroy();

        return res.status(200).json({ message: `Comment with id ${comment_id} has been deleted successfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'An error occurred while trying to delete the comment' });
    }
};

module.exports = {
    createComment,
    getCommentsByPostId,
    deleteComment,
};
