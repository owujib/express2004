const express = require('express');
const multer = require('multer');

const Product = require('../models/Product');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/product-img/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' || ext !== '.png' || ext !== '.jfif') {
      return cb(
        res.staus(400).end('only jpg, png and jfif are allowed'),
        false
      );
    }
    cb(null, true);
  },
});

const upload = multer({ storage });

router.get('/create', upload.single('productImg'), async (req, res, next) => {
  res.render('products/create.ejs', {
    title: 'create product',
  });
});

router.post('/create', upload.single('productImg'), async (req, res, next) => {
  try {
    const newData = {
      name: req.body.name,
      description: req.body.description,
      color: req.body.color,
      gender: req.body.gender,
      productImg: req.file.filename,
    };
    const product = await Product.create(newData);
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
    console.log(product);
    if (!product) {
      res.send('an error occurred');
    }
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
  } catch (error) {
    next(error);
  }
});
module.exports = router;
