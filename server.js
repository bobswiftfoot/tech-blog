const express = require('express');
const exphbs = require('express-handlebars');
const expressSession = require('express-session');
require('dotenv').config();

const path = require('path');
const helpers = require('./utils/helpers');
const hbs = exphbs.create({helpers});
const SequelizeStore = require('connect-session-sequelize')(expressSession.Store);

const routes = require('./controllers');
const sequelize = require('./config/connection');

const session = {
    secret: process.env.SESSION_SECRET,
    cookie: {
        //maxAge: 60000 //1 min for testing
        maxAge: 3600000 //1 hour
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(expressSession(session));

app.use(routes);

sequelize.sync({ force: false }).then(() =>
{
    app.listen(PORT, () => console.log('Now listening'));
});