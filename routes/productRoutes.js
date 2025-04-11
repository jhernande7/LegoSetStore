import express from 'express';
import * as productController from '../controllers/productController.js';

const router = express.Router();

// GET /api/products - Get all products
router.get('/', productController.getAllProducts);

// GET /api/products/search - Search for products by name
router.get('/search', productController.searchProducts);

// GET /api/products/categories/all
router.get('/categories/all', productController.getAllCategories);

// GET /api/products/category/:categoryId - get products by category
router.get('/category/:categoryId', productController.getProductsByCategory);

// GET /api/products/:id - Get a single product by ID
router.get('/:id', productController.getProductById);

export default router;