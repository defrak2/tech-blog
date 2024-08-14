const router = require('express').Router();
// Import the Project model from the models folder
const { Comment } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const { message, post_id } = req.body;
    const user_id = req.session.user_id; 

    const newComment = await Comment.create({
      message,
      post_id,
      user_id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;