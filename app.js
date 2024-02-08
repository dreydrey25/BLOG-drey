const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/css'));

// Configuração da conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'phpmyadmin',
  password: 'yerdna',
  database: 'myappdatabase'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados MySQL: ' + err.stack);
    return;
  }

  console.log('Conexão bem-sucedida ao banco de dados MySQL.');
});

app.post('/cadastro', (req, res) => {
  const { username, email, password } = req.body;

  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';

  connection.query(query, [username, email, password], (err, results) => {
    if (err) {
      console.error(err);
      res.send('Erro ao cadastrar. <a href="/cadastro">Tente novamente</a>');
    } else {
      // Redirecione para a página de login após o cadastro bem-sucedido
      res.redirect('/login');
    }
  });
});



// Rota para verificação de login
app.post('/login', (req, res) => {
  const { username, email, password } = req.body;
  const SELECT_USER_QUERY = `SELECT * FROM users WHERE username=? AND email = ? AND password = ?`;

  connection.query(SELECT_USER_QUERY, [username, email, password], (error, results) => {
    if (error) {
      throw error;
    }
    if (results.length > 0) {
      console.log('Login bem-sucedido.');
      res.redirect('/home');
    } else {
      console.log('Credenciais inválidas. Tente novamente.');
      res.redirect('/login');
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/sobre', (req, res) => {
  res.render('sobre');
});

app.get('/contato', (req, res) => {
  res.render('contato');
});

app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/postagens', (req, res) => {
  res.render('postagens');
});

app.get('/cadastro', (req, res) => {
  res.render('cadastro');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
