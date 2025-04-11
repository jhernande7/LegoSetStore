import db from '../database.js';

const CartProduct = {

    //adding pruduct to cart
    async addProduct(cartId, productId, quantity){
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM cart_products WHERE cart_id = ? AND product_id = ?`,
                [cartId, productId],
                (err, existingProduct) => {
                    if(err) {
                        reject(err);
                        return;
                    }

                    if(existingProduct) {
                        //update the quantity of the existing product
                        const newQuantity = existingProduct.quantity + quantity;
                        db.run(
                            `UPDATE cart_products SET quantity = ? WHERE id = ?`,
                            [newQuantity, existingProduct.id],
                            function(err) {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                resolve(this.changes > 0);
                            }
                        );
                    } else {
                        //insert new product into cart
                        db.run(
                            `INSERT INTO cart_products (cart_id, product_id, quantity) 
                            VALUES (?, ?, ?)`,
                            [cartId, productId, quantity],
                            function(err) {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                resolve(this.lastID);
                            }
                        );
                    }
                }
            );
        });
    },

    //update product quantity in cart
    async updateQuantity(cartProductId, quantity) {
        if(quantity <= 0) {
            return await this.removeProduct(cartProductId); //removing product if quantity is zero or less
        } else {
            return new Promise((resolve, reject) => {
                db.run(
                    `UPDATE cart_products SET quantity = ? WHERE id = ?`,
                    [quantity, cartProductId],
                    function(err) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(this.changes > 0);
                    }
                );
            });
        }
    },

    //remove product from cart
    async removeProduct(cartProductId) {
        return new Promise((resolve, reject) => {
            db.run(
                `DELETE FROM cart_products WHERE id = ?`,
                cartProductId,
                function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(this.changes > 0);
                }
            );
        });
    },

    //get all products in a cart
    async getCartProducts(cartId) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT cp.*, p.name, p.price, p.image_url
                FROM cart_products cp
                JOIN products p ON cp.product_id = p.id
                WHERE cp.cart_id = ?`,
                cartId,
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

export default CartProduct;