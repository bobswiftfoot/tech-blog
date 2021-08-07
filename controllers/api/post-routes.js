const router = require('express').Router();
const { Post, Comment, User } = require('../../models');

// GET /api/posts
router.get('/', (req, res) =>
{
    Post.findAll(
        {
            include: [
                {
                    model: Comment,
                    include: [
                        {
                            model: User,
                        }
                    ]
                },
                {
                    model: User,
                }
            ]
        })
        .then(dbPostData => res.json(dbPostData))
        .catch(err =>
        {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET /api/posts/1
router.get('/:id', (req, res) =>
{
    Post.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Comment,
                include: [
                    {
                        model: User,
                    }
                ]
            },
            {
                model: User,
            }
        ]
    })
        .then(dbPostData => 
        {
            if (!dbPostData)
            {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err =>
        {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/posts
router.post('/', (req, res) =>
{
    /* expects 
    {
        title: 'New Post'
        contents: 'Lots of content'
        user_id: 1
    }*/
    Post.create({
        title: req.body.title,
        contents: req.body.contents,
        user_id: req.session.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err =>
        {
            console.log(err);
            res.status(500).json(err);
        });
});

// PUT /api/posts/1
router.put('/:id', (req, res) => 
{
    /* expects 
    {
        title: 'New Post'
        contents: 'Lots of content'
        user_id: 1
    }*/
    Post.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData =>
        {
            if (!dbPostData[0])
            {
                res.status(404).json({ dbPostData: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err =>
        {
            console.log(err);
            res.status(500).json(err);
        });
});

// DELETE /api/posts/id
router.delete('/:id', (req, res) =>
{
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData =>
        {
            if (!dbPostData)
            {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err =>
        {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;