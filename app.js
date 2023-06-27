require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const userRoutes = require('./routes/users');
const path = require('path');
const methodOverride = require('method-override');

const app = express();

const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI;

mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then( () => {
    console.log(`DB is connected at ${DB_URI}`);
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

app.use(session({
    secret: 'mysecret key',
    saveUninitialized: true,
    resave: false
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public/uploads')));

app.use('/', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});