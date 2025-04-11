import express from 'express';
import * as cartController from '../controllers/cartController.js';

const router = express.Router();

// GET /api/cart/:userId - Get cart for a user
router.get('/:userId', cartController.getUserCart);

// POST /api/cart/:userId/add - Add a product to the user's cart
router.post('/:userId/add', cartController.addProductToCart);

// POST /api/cart/:userId/update - Update the quantity of a product in the user's cart
router.post('/:userId/update', cartController.updateCartProduct);

// DELETE /api/cart/:userId/remove/:productId - Remove a product from the user's cart
//router.delete('/:userId/remove/:cartProductId', cartController.removeCartProduct);

// POST /api/cart/:userId/checkout - Checkout the user's cart
router.post('/:userId/checkout', cartController.checkoutCart);

export default router;