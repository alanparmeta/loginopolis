const express = require('express');
const app = express();
const { User } = require('./db');

const SALT_COUNT = 5

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post("/register", async (req, res, next) => {
  try {
    const { username, password }) = req.body;
    const hashed = await bcrypt.hash(password, SALT_COUNT)
    await User.create({username: username, password: hashed})
    res.send(`successfully created user $(username)`)
  } catch (error) {
    console.log(error);
    next(error);
  }
  console.error(error);
  next(error);
})

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password

app.post('/login', (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username }});
    if (!user) {
      res.send('User is not found.')
      return
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
})

// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB

// we export the app, not listening in here, so that we can run tests
module.exports = app;
