import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// add a new product
export const addProduct = async (req, res) => {
    try {
        const { name, description, price, num_pieces, age_rating,
            item_num, category_id
         } = req.body;

         //validate inputs
         if (!name || !description || !price || !num_pieces || !age_rating || !item_num || !category_id) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        let image_url = null;
        if (req.file){
            image_url = `/uploads/${req.file.filename}`;
        } else {
            return res.status(400).json({ message: 'Image file is required' });
        }

        //create product
        const newProuct = await Product.create({
            name,
            description,
            image_url,
            price: parseFloat(price),
            num_pieces: parseInt(num_pieces),
            age_rating,
            item_num: parseInt(item_num),
            category_id: parseInt(category_id)
        });

        res.status(201).json(newProuct);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Failed to create prodcut' });
    }
};


// update a product
export const updateProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.id);

        if(isNaN(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        //get existing product
        const existingProduct = await Product.getById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { name, description, price, num_pieces, age_rating,
            item_num, category_id
         } = req.body;

         //validate inputs
         if (!name || !description || !price || !num_pieces || !age_rating || !item_num || !category_id) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        let image_url = existingProduct.image_url;
        if (req.file){
            image_url = `/uploads/${req.file.filename}`;
        }

        //update product
        const updatedProduct = await Product.update(productId,{
            name: name || existingProduct.name,
            description: description || existingProduct.description,
            image_url,
            price: price ? parseFloat(price): existingProduct.price,
            num_pieces: num_pieces ? parseInt(num_pieces): existingProduct.num_pieces,
            age_rating: age_rating || existingProduct.age_rating,
            item_num: item_num ? parseInt(item_num): existingProduct.item_num,
            category_id:category_id ? parseInt(category_id): existingProduct.category_id
        });

        if (updatedProduct[0] === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updateProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Failed to update product' });
    }
};

//Bulk upload
export const bulkUpload = async (req, res) => {
    try {
        const products = req.body.products;
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Invalid product data' });
        }

        for (const product of products) {
            const { name, description, image_url, price, num_pieces, age_rating,
                item_num, category_id } = product;
            //validate inputs
            if (!name || !description || !price || !num_pieces || !age_rating || !item_num || !category_id) {
                return res.status(400).json({ message: 'All fields are required' });
            }
        }

        const insertedIds = await Product.bulkInsert(products);

        res.status(201).json({ message: 'Products uploaded successfully', insertedIds });
    } catch (error) {
        console.error('Error bulk uploading products:', error);
        res.status(500).json({ message: 'Failed to bulk upload products' });
    }
};

//create a new category
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if( !name ) {
            return res.status(400).json({ message: 'Category name is required' });
        }
        const newCategory = await Category.create({ name });
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Failed to create category' });
    }
};

//update a category
export const updateCategory = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        if(isNaN(categoryId)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        const { name } = req.body;
        if( !name ) {
            return res.status(400).json({ message: 'Category name is required' });
        }
        const updatedCategory = await Category.update(categoryId, { name });
        res.json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Failed to update category' });
    }
};