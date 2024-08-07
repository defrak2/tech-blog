const { Posts, User } = require('../models');

const router = require('express').Router();

// home, login, individual project
router.get('/', async (req, res) => {
    const postData = await Posts.findAll({
        include: [
            {
                model: User,
                attributes: ['name']
            }
        ]
    });
    const posts = postData.map((post) => post.get({plain: true}));
    res.render('homepage', { posts });
})

router.get('/login', (req, res) => {
  res.render('login');
})

module.exports = router;












