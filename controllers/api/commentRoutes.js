const router = require('express').Router();
// Import the Project model from the models folder
const { Comment, User, Post } = require('../../models');

router.post('/', async (req, res) => {
  const { postId, userId, message } = req.body;

  if (!postId || !userId || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Insert comment into the database using Sequelize
    const newComment = await Comment.create({
      post_id: postId,
      user_id: userId,
      message: message
    });

    res.status(201).json({ success: true, commentId: newComment.id });
  } catch (error) {
    console.error('Error inserting comment:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET all comments for all posts
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        {
          model: User,
          attributes: ['name'] // Include user name in the response
        },
        {
          model: Post,
          attributes: ['title', 'id'] // Include post title and id in the response
        }
      ],
      order: [['date_created', 'DESC']] // Optional: order comments by date
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET all comments for a specific post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { post_id: req.params.postId },
      include: [
        {
          model: User,
          attributes: ['name'] // Include user name in the response
        },
        {
          model: Post,
          attributes: [] // You can include post attributes if needed
        }
      ],
      order: [['date_created', 'DESC']] // Optional: order comments by date
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;