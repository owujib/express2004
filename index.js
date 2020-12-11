//import express
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user.routes');

//initialize my express app
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//static middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); //uploads would be read from '/uploads

/** product routes */
app.use('/api/user', userRoutes);

//404 route
app.all('*', (req, res, next) => {
  res.send('404 page does not exist');
});

//connecting my server to mongoose server
mongoose
  .connect('mongodb://127.0.0.1:27017/e_sales', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
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
