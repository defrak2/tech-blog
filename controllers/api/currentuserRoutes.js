const router = require('express').Router();
const { User } = require('../../models'); // Adjust the path if necessary

// Route to get the current user's information
router.get('/', async (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const user = await User.findByPk(req.session.user_id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ userId: user.id, username: user.name });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;