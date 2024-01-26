const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login_ejs'
});

db.connect((err) => {
    if (err) {
        console.error('Error connection to database');
    } else {
        console.log('Connected to database');
    }
});

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results, fields) => {
      if (results.length > 0) {
        res.redirect('/home?username=' + username);
      } else {
        res.send('Incorrect username or password');
      }
      res.end();
    });
});

app.get('/home', (req, res) => {
    const username = req.query.username;
    if (username) {
      res.render('home', { username: username });
    } else {
      res.redirect('/');
    }
});

app.get('/logout', (req, res) => {
    res.redirect('/');
});

app.listen(port, () => {
    console.log('Server is running');
});