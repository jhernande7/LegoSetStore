import Cart from '../models/cartModel.js';
import CartProduct from '../models/cartProductModel.js';

//get the active cart from a user
export const getUserCart = async (req, res) => {
    try{
        const userId = parseInt(req.params.userId);
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Fetch the active cart for the user
        const cart = await Cart.createActiveCart(userId);

        const cartWithProducts = await Cart.getCartWithProducts(cart.id);
        res.status(200).json(cartWithProducts);
    } catch (error) {
        console.error('Error fetching user cart:', error);
        res.status(500).json({ message: 'Failed to fetch cart' });
    }
};


//add a product to the cart
export const addProductToCart = async (req, res) => {
    try{
        const userId = parseInt(req.params.userId);

        const productId = req.body.productId;
        const quantity = req.body.quantity || 1;

        if(isNaN(userId)){
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        if(!productId || isNaN(productId)){
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const parsedProductId = parseInt(productId);
        const parsedQuantity = parseInt(quantity);

        if (isNaN(parsedProductId) || isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ message: 'Invalid product ID or quantity' });
        }

        // get or create the active cart for the user
        const cart = await Cart.createActiveCart(userId);
        await CartProduct.addProductToCart(cart.id, parsedProductId, parsedQuantity);
        
        
        //update the cart
        const updatedCart = await Cart.getCartWithProducts(cart.id);
       
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Failed to add product to cart' });
    }
};

// update the product quantity in cart
export const updateCartProduct = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const { cartProductId, quantity } = req.body;

        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        if (!cartProductId || isNaN(cartProductId) || !quantity || isNaN(quantity)){
            return res.status(400).json({ message: 'Invalid cart product ID or quantity' });
        }

        //parse as integers
        const parsedCartProductId = parseInt(cartProductId);
        const parsedQuantity = parseInt(quantity);

        if (isNaN(parsedCartProductId) || isNaN(parsedQuantity)) {
            return res.status(400).json({ message: 'Invalid cart product ID or quantity' });
        }

        //update the product quantity 
        await CartProduct.updateQuantity(parsedCartProductId, parsedQuantity);

        //get or create active cart
        const cart = await Cart.createActiveCart(userId);

        const updatedCart = await Cart.getCartWithProducts(cart.id);
        res.status(200).json(updatedCart);
   } catch (error) {
        console.error('Error updating cart product:', error);
        res.status(500).json({ message: 'Failed to update cart product' });
    }
};


// remove a product from the cart
export const removeCartProduct = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const cartProductId = parseInt(req.params.cartProductId);

        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        } 
        if (isNaN(cartProductId)) {
            return res.status(400).json({ message: 'Invalid cart product ID' });
        }

        //remove the product from the cart
        await CartProduct.removeProduct(cartProductId);

        const cart = await Cart.createActiveCart(userId);

        const updatedCart = await Cart.getCartWithProducts(cart.id);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Error removing cart product:', error);
        res.status(500).json({ message: 'Failed to remove cart product' });
    }
};

export const checkoutCart = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);

        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const cart = await Cart.createActiveCart(userId);

        await Cart.updateCartStatus(cart.id, 'purchased');
        res.json({ message: 'Cart checked out successfully' });
    } catch (error){
        console.error('Error checking out cart:', error);
        res.status(500).json({ message: 'Failed to checkout cart' });
    }
};