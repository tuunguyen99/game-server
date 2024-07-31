const express = require('express');
const createError = require('http-errors');
require('express-async-errors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const authMiddleware = require('./src/auth/auth.middlewares');
const mongoose = require('mongoose');
dotenv.config();
mongoose.connect(`mongodb+srv://admin:3YkXHZDQ3JJb3EZu@cluster0.xmiyl.mongodb.net/guildtechdemo`)

const authRouter = require('./src/auth/auth.routes');
const usersRouter = require('./src/users/users.routes');
const guildRouter = require('./src/guilds/guilds.routes');
const app = express();

app.use(
	bodyParser.urlencoded({
		extended: false,
	}),
);
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('APP IS RUNNING');
});
app.use('/auth', authRouter);
app.use('/users',authMiddleware.isAuth, usersRouter);
app.use('/guilds', guildRouter);

app.use((req, res, next) => {
	next(createError(404));
});

app.use((err, req, res) => {
	console.log(err.stack);
	res.status(err.status || 500).send(err.message);
});

const server = app.listen(3000, () => {
	console.log(`Express running → PORT ${server.address().port}`);
});
