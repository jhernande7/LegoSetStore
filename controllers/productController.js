import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

//get all products 
export const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const products = await Product.getAll(limit, offset);
        res.json(products);
    } catch(error){
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};

// search products by name
export const searchProducts = async (req, res) => {
    try {
        const query = req.query.q;
        if(!query) {
            return res.status(400).json({ message: 'Query parameter is required' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const products = await Product.search(query, limit, offset);
        res.json(products);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Failed to search products' });
    }
};

// get products by category
export const getProductsByCategory = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        if(isNaN(categoryId)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const products = await Product.getByCategory(categoryId, limit, offset);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ message: 'Failed to fetch products by category' });
    }
};

// get a single product by ID
export const getProductById = async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        if(isNaN(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const product = await Product.getById(productId);
        if(!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ message: 'Failed to fetch product' });
    }
};

// get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.getAll();
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
};