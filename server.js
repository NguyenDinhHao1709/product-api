const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/product_db';

// Product Schema & Model
const productSchema = new mongoose.Schema(
  {
    pid: { type: String, required: true, unique: true },
    pname: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

// Healthcheck endpoint (useful for Step 9 & Docker/CI)
app.get('/health', (req, res) => {
  const isMongoConnected = mongoose.connection.readyState === 1;
  if (isMongoConnected) {
    return res.status(200).json({ status: 'OK', mongodb: 'connected' });
  }
  return res.status(503).json({ status: 'ERROR', mongodb: 'disconnected' });
});

// CRUD Endpoints
// 1. Create Product
app.post('/api/products', async (req, res) => {
  try {
    const { pid, pname, price, quantity } = req.body;
    if (!pid || !pname || price === undefined || quantity === undefined) {
      return res.status(400).json({ message: 'Missing required fields: pid, pname, price, quantity' });
    }
    const product = new Product({ pid, pname, price, quantity });
    await product.save();
    return res.status(201).json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Product with this pid already exists' });
    }
    return res.status(500).json({ message: error.message });
  }
});

// 2. Read All Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 3. Read Product by pid
app.get('/api/products/:pid', async (req, res) => {
  try {
    const product = await Product.findOne({ pid: req.params.pid });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 4. Update Product by pid
app.put('/api/products/:pid', async (req, res) => {
  try {
    const { pname, price, quantity } = req.body;
    const updatedProduct = await Product.findOneAndUpdate(
      { pid: req.params.pid },
      { pname, price, quantity },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 5. Delete Product by pid
app.delete('/api/products/:pid', async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ pid: req.params.pid });
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Connect MongoDB and Start Server
let server;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`Connected to MongoDB at ${MONGO_URI}`);
    server = app.listen(PORT, () => {
      console.log(`Product API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
  });

module.exports = { app, Product };
