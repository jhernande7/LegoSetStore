import db from '../database.js';

const Category = {

    //gets all categories
    async getAll() {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM categories`,
                (err, categories) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(categories);
                }
            );
        });
    },

    //get category by id
    async getById(categoryId) {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM categories WHERE id = ?`,
                categoryId,
                (err, category) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(category);
                }
            );
        });
    },

    //create a new category
    async create(name) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO categories (name) VALUES (?)`,
                name,
                function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({ id: this.lastID, name });
                }
            );
        });
    },

    //update a category
    async update(categoryId, name) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE categories SET name = ? WHERE id = ?`,
                [name, categoryId],
                function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({ id: categoryId, name });
                }
            );
        });
    }


};

export default Category;