import express from 'express';
import * as adminController from '../controllers/adminController.js';
import multer from 'multer';
import path, { parse } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//setup storage for product images
const uploadDir = path.join(__dirname, '../uploads');
if(!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

const router = express.Router();

// sample data (stubbed)
const sampleCategories = [
  { id: 1, name: 'Star Wars' },
  { id: 2, name: 'Construction' },
  { id: 3, name: 'Need for Speed' }
];

const sampleProducts = [
  { id: 1, 
    name: 'Star Wars Lego Set', 
    description: 'A detailed Star Wars Lego set for fans.',
    image_url: '/uploads/lego1.jpg',
    price: 29.99,
    num_pices: 500,
    age_rating: '10+',
    item_num: '74224',
    categoryId: 1
  },

  { id: 2, 
    name: 'construction Lego Set', 
    description: 'construcitno lego set for fans.',
    image_url: '/uploads/lego2.jpg',
    price: 39.99,
    num_pices: 200,
    age_rating: '10+',
    item_num: '742353',
    categoryId: 2
  },
  { id: 3, 
    name: 'Fast and Furious Lego Set', 
    description: 'Fast and Furious Lego set for fans.',
    image_url: '/uploads/lego3.jpg',
    price: 99.99,
    num_pices: 1000,
    age_rating: '15+',
    item_num: '743564',
    categoryId: 3
  },

];

//POST /api/admin/products
// STUBS
router.post('/products', upload.single('image'), (req, res) => {
    try {
        const { name, description, price, num_pices, age_rating, item_num, categoryId } = req.body;

        //validate product fileds
        if (!name || !description || !price || !num_pices || !age_rating || !item_num || !categoryId) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        let image_url = '/uploads/default.jpg';
        if (req.file) {
            image_url = '/uploads/' + req.file.filename;
        }

        //creating mock new product with an id
        const newProdcut = {
            id: sampleProducts.length + 1,
            name,
            description,
            image_url,
            price: parseFloat(price),
            num_pices: parseInt(num_pices),
            age_rating,
            item_num: parseInt(item_num),
            categoryId: parseInt(categoryId)
        };

        //returning the mock product, instead of saving to a database for now
        res.status(201).json(newProdcut);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// PUT /api/admin/products/:id for updatinng product STUBS
router.put('/products/:id', upload.single('image'), (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        if (isNaN(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const existingProductIndex = sampleProducts.findIndex(p => p.id === productId);
        if (existingProductIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const existingProduct = sampleProducts[existingProductIndex];
        const { name, description, price, num_pices, age_rating, item_num, categoryId } = req.body;

        let image_url = existingProduct.image_url;
        if (req.file) {
            image_url = '/uploads/' + req.file.filename;
        }
        
        const updatedProduct = {
            ...existingProduct,
            name: name || existingProduct.name,
            description: description || existingProduct.description,
            image_url,
            price: price ? parseFloat(price) : existingProduct.price,
            num_pices: num_pices ? parseInt(num_pices) : existingProduct.num_pices,
            age_rating: age_rating || existingProduct.age_rating,
            item_num: item_num ? parseInt(item_num) : existingProduct.item_num,
            categoryId: categoryId ? parseInt(categoryId) : existingProduct.categoryId
        };

        //same thing as above, returning mock data
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error in update product stub', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST for /api/admin/products/bulk STUBS
router.post('/products/bulk', upload.array('images'), (req, res) => {
    try {
        const products = req.body.products;
        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ error: 'Invalid products data' });
        }

            //for validating the products
        const invalidProducts =[];
        for (let i=0; i < products.length; i++) {
            const product = products[i];
            const { name, description, price, num_pices, age_rating, item_num, categoryId } = product;
            if (!name || !description || !price || !num_pices || !age_rating || !item_num || !categoryId) {
                invalidProducts.push(`Product at index ${i}`);
            }
        }

        if (invalidProducts.length > 0) {
            return res.status(400).json({ error: `Invalid product data for the products entered check fields`, invalidProducts });
        }

        //returning the mock products
        res.status(201).json({
            message: `Suscessfully uploaded ${products.length} products (stub)`
        });
    } catch (error) {
        console.error('Error in bulk upload stub', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST for creating a category STUBS
router.post('/categories', (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        const newCategory = {
            id: sampleCategories.length + 1,
            name
        };

       //right now just returning the mock category
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error creating category stub', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// PUT for updating a category STUBS
router.put('/categories/:id', (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        if (isNaN(categoryId)) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }

        const existingCategoryIndex = sampleCategories.findIndex(c => c.id === categoryId);
        if (existingCategoryIndex === -1) {
            return res.status(404).json({ error: 'Category not found' });
        }

    
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        const updatedCategory = {
            id: categoryId,
            name
        };

        //returning the mock updated category
        res.json(updatedCategory);
    } catch (error) {
        console.error('Error updating category stub', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;




