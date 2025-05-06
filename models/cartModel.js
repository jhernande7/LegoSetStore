import db from '../database.js';

const Cart ={
    async createActiveCart(userId){
        return new Promise((resolve, reject) =>{
            db.get(
                `SELECT * FROM carts WHERE user_id = ? AND status = 'new'
                ORDER BY created_date DESC LIMIT 1`,
                userId, 
                (err, cart) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    //if there isnt an active cart, we need to create one
                    if(!cart) { 
                        db.run(
                            `INSERT INTO carts (user_id, status) VALUES (?, 'new')`,
                            userId,
                            function(err) {
                                if (err) {
                                    reject(err);
                                    return;
                                }

                                db.get(`SELECT * FROM carts WHERE id = ?`, this.lastID,
                                    (err, newCart) => {
                                        if (err) {
                                            reject(err);
                                            return;
                                        }
                                        resolve(newCart);
                                    });
                            }
                        );
                    } else {
                        resolve(cart);
                    }
                });
        });
    },

    //getting the cart by id with all the products in it
    async getCartWithProducts(cartId){
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM carts WHERE id =?`, cartId, (err, cart) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!cart) {
                    resolve(null);
                    return;
                }

                db.all(
                    `SELECT cp.id, cp.quantity, p.id as product_id, p.name, p.description, p.image_url,
                    p.price, p.num_pieces, p.age_rating, p.item_num,
                    c.name as category_name
                    FROM cart_products cp
                    JOIN products p ON cp.product_id = p.id
                    JOIN categories c ON p.category_id = c.id
                    WHERE cp.cart_id = ?`,
                    cartId,
                    (err, cartProducts) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        //calcualting the total price of the cart
                        let total=0;
                        for (const item of cartProducts) {
                            total += item.price * item.quantity;
                        }

                        resolve({
                            ...cart,
                            products: cartProducts,
                            total: total.toFixed(2)
                        });
                    }
                );
            });
        });
    },

    //getting all carts for a user 
    async getUserCarts(userId){
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM carts WHERE user_id = ? 
                ORDER BY created_date DESC`,
                userId,
                (err, carts) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(carts);
                }
            );
        });
    },

    //update cart status
    async updateCartStatus(cartId, status){
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE carts SET status = ? WHERE id = ?`,
                [status, cartId],
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
};

export default Cart;