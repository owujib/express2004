//import express
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const productRoutes = require('./routes/product-routes');
const userRoutes = require('./routes/user.routes');

//initialize my express app
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

//template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//static middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

/** product routes */
app.use('/product', productRoutes);
app.use('/api/user', userRoutes);

/**my app routes */
app.get('/', (req, res, next) => {
  res.render('index.ejs', {
    title: 'Home ',
  });
});

app.get('/about', (req, res, next) => {
  res.render('about.ejs', {
    title: 'about us',
  });
});

app.get('/contact', (req, res, next) => {
  res.render('contact.ejs', {
    title: 'contact us',
  });
});

app.post('/contact', (req, res, next) => {
  console.log(req.body);
  res.json(req.body);
});

app.get('/api/student', (req, res, next) => {
  const student = [
    { id: 1, name: 'james' },
    { id: 2, name: 'mark' },
    { id: 3, name: 'john' },
    { id: 4, name: 'khalid' },
  ];
  res.json(student);
});

//404 route
app.all('*', (req, res, next) => {
  res.send('404 page does not exist');
});

//connecting my server to mongoose server
mongoose
  .connect('mongodb://127.0.0.1:27017/e_sales', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log('database connection successful...');
  })
  .catch((err) => console.log(err));

//create my server
const port = 3000;

app.listen(port, () => {
  console.log(`server is running on localhost:${port}`);
});

//^2.0.0-rc.1
