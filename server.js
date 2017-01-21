var express = require('express');
var multer  = require('multer');
var ext = require('file-extension');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, +Date.now() + '.' + ext(file.originalname))
  }
})

var upload = multer({ storage: storage }).single('picture');

var app = express();

app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index', { title: 'Miaugram' });
})

app.get('/signup', function (req, res) {
  res.render('index', { title: 'Miaugram - Signup' });
})

app.get('/signin', function (req, res) {
  res.render('index', { title: 'Miaugram - Signin' });
})

app.get('/api/pictures', function (req, res, next) {
  var pictures = [
    {
      user: {
        username: 'MiauMiau',
        avatar: 'https://scontent-dft4-1.cdninstagram.com/t51.2885-19/s150x150/14607014_979200455518856_6501924825026527232_a.jpg'
      },
      url: 'mom.jpg',
      likes: 24,
      liked: false,
      createdAt: new Date().getTime()
    }
  ];

  setTimeout(function () {
    res.send(pictures);
  }, 2000)
});

app.post('/api/pictures', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      return res.send(500, "Error uploading file");
    }
    res.send('File uploaded');
  })
})

app.get('/api/user/:username', (req, res) => {
  var username = req.params.username;

  client.getUser(username, function (err, user) {
    if (err) return res.status(404).send({ error: 'User not found' })
    
    res.send(user);
  });
})

app.get('/:username', function (req, res) {
  res.render('index', { title: `Miaugram - ${req.params.username}` });
})

app.get('/:username/:id', function (req, res) {
  res.render('index', { title: `Miaugram - ${req.params.username}` });
})

app.listen(4000, function (err) {
  if (err) return console.log('Hubo un error'), process.exit(1);

  console.log('Miaugram escuchando en el puerto 4000');
})
