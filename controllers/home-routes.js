const router = require('express').Router();
const withAuth = require('../utils/auth');
const { User, Post, Comment } = require('../models');

router.get('/', (req, res) =>
{
    Post.findAll({
        attributes: [
            'id',
            'title',
            'contents',
            'createdAt',
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'createdAt'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData =>
        {
            const posts = dbPostData.map(post => post.get({ plain: true }));
            console.log(posts);
            res.render('homepage', {posts, loggedIn: req.session.loggedIn});
        })
        .catch(err =>
        {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/login', (req, res) =>
{
    if (req.session.loggedIn)
    {
        res.redirect('/');
        return;
    }

    res.render('login', { loggedIn: req.session.loggedIn });
});

router.get('/dashboard', withAuth, (req, res) =>
{
    res.render('dashboard', { loggedIn: req.session.loggedIn });
});

module.exports = router;