const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.ADMIN_PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Admin server connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  crossPrice: { type: Number, required: true },
  tag: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },       // New field
  subcategory: { type: String, required: true },    // New field
  color: { type: String, required: true },          // New field
  dateAdded: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

// API Endpoint: Add a new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, crossPrice, tag, image, category, subcategory, color } = req.body;

    // Validate required fields
    if (!name || !description || !price || !crossPrice || !tag || !image || !category || !subcategory || !color) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const product = new Product({
      name,
      description,
      price,
      crossPrice,
      tag,
      image,
      category,
      subcategory,
      color,
      dateAdded: new Date(),
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });

  } catch (err) {
    res.status(500).json({ message: 'Error adding product', error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Admin server running on port ${port}`);
});
