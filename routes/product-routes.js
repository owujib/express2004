const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(require('stream').pipeline);

const Product = require('../models/Product');

const router = express.Router();

const upload = multer();

router.get('/create', (req, res, next) => {
  res.render('products/create.ejs', {
    title: 'create product',
  });
});

router.post('/create', upload.single('productImg'), async (req, res, next) => {
  try {
    const { file, body } = req;

    console.log(file);
    //check if file is not an image
    if (
      file.detectedFileExtension != '.jpg' &&
      file.detectedFileExtension != '.png'
    ) {
      return res.send('you can only upload png and jpg files');
    }
    await pipeline(
      file.stream,
      fs.createWriteStream(`./uploads/${Date.now()}-${file.originalName}`)
    );
    const product = await Product.create(body);
    res.redirect(`/product/${product._id}`);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render('products/list.ejs', {
      title: 'Product list',
      products,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById({ _id: req.params.id });
    res.render('products/single.ejs', {
      title: 'single product',
      product,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/edit/:id', async (req, res, next) => {
  try {
    const product = await Product.findById({ _id: req.params.id });
    res.render('products/edit-product.ejs', {
      title: 'edit product',
      product,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/edit/:id', async (req, res, next) => {
  try {
    console.log(req.body);
    const product = await Product.findByIdAndUpdate(
      { _id: req.body.id },
      req.body,
      {
        new: true,
      }
    );
    res.redirect(`/product/${product._id}`);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id });
    res.redirect('/product');
  } catch (error) {}
});
module.exports = router;
