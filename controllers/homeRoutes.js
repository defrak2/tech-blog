const { Comment, Post, User } = require('../models');
const withAuth = require('../utils/auth');
const router = require('express').Router();

// home, login, individual project
router.get('/', async (req, res) => {
    const postData = await Post.findAll({
        include: [
            {
                model: User,
                attributes: ['name']
            },
            {
                model: Comment,
                include: [
                    {
                        model: User,
                        attributes: ['name'],
                    }
                ],
            },
        ]
    });
    const posts = postData.map((post) => post.get({plain: true}));
    res.render('homepage', { posts });
})


router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });
        if (!postData) {
            return res.status(404).render('404', {message: 'Post not found' });
        }
        const post = postData.get({ plain: true });
            res.render('post', {
                ...post,
                logged_in: req.session.logged_in
            });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

router.get('/profile', withAuth, async (req, res) => {
    try {
      // Find the logged in user based on the session ID
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Post,
            include: [
              {
                model: Comment, // Include the Comment model
                attributes: ['id', 'message', 'date_created'], // Include the message and date_created attributes
                include: [
                  {
                    model: User, // Include the User model for comments
                    attributes: ['name'] // Include only the user name
                  }
                ]
              }
            ]
          }
        ],
      });
  
      const user = userData.get({ plain: true });
  
      res.render('profile', {
        ...user,
        logged_in: true
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    }
  
    res.render('login');
  });

  router.get('/signup', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    }
  
    res.render('signup');
  });

module.exports = router;












