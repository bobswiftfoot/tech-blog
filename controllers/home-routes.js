const router = require('express').Router();

router.get('/', (req, res) =>
{
    res.render('homepage', { loggedIn: req.session.loggedIn });
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

router.get('/dashboard', (req, res) =>
{
    res.render('dashboard', { loggedIn: req.session.loggedIn });
});

module.exports = router;