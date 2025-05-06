import db from '../database.js';

const Product = {

    async getById(productId) {

        //get product by id
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT p.*, c.name as category_name
                FROM products p
                JOIN categories c ON p.category_id = c.id
                WHERE p.id = ?`,
                productId,
                (err, product) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(product);
                }
            );
        });
    },

    //getting all products 
    async getAll(limit =20, offset = 0) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM products`;
            db.all(query,[], (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(rows);
                }
            );
        });
    },

    //getting products by category 
    async getByCategory(categoryId, limit = 20, offset = 0) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT p.*, c.name as category_name
                FROM products p
                JOIN categories c ON p.category_id = c.id
                WHERE p.category_id = ?
                LIMIT ? OFFSET ?`,
                [categoryId, limit, offset],
                (err, products) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(products);
                }
            );
        });
    }


};

export default Product;