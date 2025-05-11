const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 5000;

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Required to handle JSON body from login form

mongoose.connect('mongodb://localhost:27017/formData');
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: Number,
  username: String,
  password: String,
});

const Users = mongoose.model('data', userSchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/submit', async (req, res) => {
  const { name, email, contact, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new Users({
    name,
    email,
    contact,
    username,
    password: hashedPassword
  });

  await user.save();
  console.log('User registered');
  console.log(user);
  res.send('Registration successful');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ username });

  if (!user) {
    return res.status(400).send('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    res.send('Login successful');
  } else {
    res.status(401).send('Invalid password');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
// This is a simple Express server that handles user registration and login.
// It uses MongoDB to store user data and bcrypt for password hashing.