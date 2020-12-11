//import express
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user.routes');
const ApiError = require('./utils/ApiError');

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
  next(new ApiError('sorry route not found', 404));
});

//global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack,
  });
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
