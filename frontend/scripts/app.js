// common functions for LEGOSS application

const API_BASE_URL = '/api';

async function fetchApi(endpoint, options = {}) {
    try{
        /* const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'applications/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok){
            const error = await response.json();
            throw new Error(error.message || `HTTP error, status: ${response.status}`);
        }

        return await response.json(); */

        const fullUrl = `${API_BASE_URL}${endpoint}`;
        console.log("Fetching URL: ", fullUrl);

        const response = await fetch(fullUrl, {
            headers: {
                'Content-Type': 'applications/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("API ERROR response: ", errorData);
            throw new Error(errorData.message || `HTTP error!`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API Error (${endpoint}): `, error);
        throw error;
    }
}

//format the currency
function formatCurrency(amount){
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (let [key, value] of params) {
        result[key]=value;
    }
    return result;
}

//product functions. 
async function loadProducts() {
    const productGrid = document.querySelector('.products-grid');
    if(!productGrid) return;

    try {
        const params = getUrlParams();
        let products; 

        if (params.category) {
            const categories = await fetchApi('/products/categories/all');
            console.log("Available categories:", categories);

            const category = categories.find(cat =>
                cat.name.toLowerCase().includes(params.category.toLowerCase()) ||
                params.category.toLowerCase().includes(cat.name.toLowerCase())
            );

            if (category) {
                products = await fetchApi(`/products/category/${category.id}`);
            } else {
                productGrid.innerHTML = '<p>Category not found</p>';
                return;
            }
        } else if (params.search) { 
            // search parameter
            products = await fetchApi(`/products/search?q=${encodeURIComponent(params.search)}`);
        } else {
            products = await fetchApi('/products');
        }

       

        if (products && products.length > 0) {
            productGrid.innerHTML = products.map(product => {
                return `
                <article class="products-card">
                    <img src="${product.image_url}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${formatCurrency(product.price)}</p>
                    <a href="details.html?id=${product.id}" class="button">Details</a>
                </article>
                `;
            }).join('');
        }
    } catch(error){
        productGrid.innerHTML = '<p>Failed to load products.</p>';
    }
}

// load page with specific product details. 
async function loadProductDetails() {
    const detailsContainer = document.querySelector('.products-details');
    if(!detailsContainer) return;

    const params = getUrlParams();
    const productId = params.id;

    if(!productId){
        detailsContainer.innerHTML = '<p>No product ID provided</p>';
        return;
    }

    try {
        const product = await fetchApi(`/products/${productId}`);

        detailsContainer.innerHTML = `
            <div class="products-image">
                <img src="${product.image_url}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h2>${product.name}</h2>
                <p class="price>${formatCurrency(product.price)}</p>
                <p class="description">${product.description}</p>
                <ul>
                    <li>Ages ${product.age_rating}</li>
                    <li>${product.num_pieces} Pieces</li>
                    <li>Item Number: ${product.item_num}</li>
                </ul>
                <button class="button" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
    } catch(error){
        detailsContainer.innerHTML = "<p>Failed to load product details.</p>";
    }
}

async function loadCart() {
    const cartContainer = document.querySelector('.cart-container');
    if (!cartContainer) return;

    try {
        const userId = 1;
        const cart = await fetchApi(`/cart/${userId}`);

        if (!cart.products || cart.products.length === 0) {
            cartContainer.innerHTML = '<h1 class="cart-title">Your Cart</h1> <p>Your cart is empty.</p>';
            return;
        }

        const itemsHtml = cart.products.map(item => `
            <div class="cart-item">
                <div class="item-img">
                    <img src="${item.image_url}" alt=${item.name}">
                </div>
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>${formatCurrency(item.price)}</p>
                    <div class="controls">
                        <div class="quantity">
                            <label>Qty: </label>
                            <input type="number" value="${item.quantity}" min="1" max="5"
                            onchange="updateQuantity(${item.id}, this.value)">
                        </div>
                        <button class="button" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                    <div class="sub-total">
                        <h3>Total for item: ${formatCurrency(item.price * item.quantity)}</h3>
                    </div>
                </div> 
            </div>
            `).join('');

            const subtotal = parseFloat(cart.total);
            const tax = subtotal * 0.0675;
            const grandTotal = subtotal + tax + 2.00;

            cartContainer.innerHTML = `
                <h1 class="cart-title">Your Cart</h1>
                ${itemsHtml}
                <div class="total">
                    <div class="total-row">
                        <h3>Subtotal: ${formatCurrency(subtotal)}</h3>
                    </div>
                    <div class="total-row">
                        <h3>Tax: ${tax}</h3>
                    </div>
                    <div class="total-row">
                        <h3>Shipping: $2.00</h3>
                    </div>
                    <div class="total-row">
                        <h3>Grand Total: ${formatCurrency(grandTotal)}</h3>
                    </div>
                    <button class="cart-button" onclick="checkout()">Checkout</button>
                </div>
            `;
    } catch (error){
        cartContainer.innerHTML = '<h1>Your cart</h1> <p>Failed to load cart.</p>';
    }
}

async function addToCart(productId){
    try {

        const userId =1;

        const parsedProductId = parseInt(productId);

        console.log("Adding product to cart: ", productId);


        const response = await fetchApi(`/cart/${userId}/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productId: parsedProductId, quantity: 1})
        });
        alert('Product added to cart!');
    } catch (error) {
        alert('Failed to add product to cart');
    }
}

async function updateQuantity(cartProductId, quantity) {
    try {
        const userId=1;
        await fetchApi(`/cart/${userId}/update`, {
            method: 'POST',
            body: JSON.stringify({ cartProductId, quantity: parseInt(quantity)})
        });
        loadCart();
    } catch (error) {
        alert('Failed to update quantity.');
    }
}

async function removeFromCart(cartProductId) {
    try {
        const userId=1;
        await fetchApi(`/cart/${userId}/update`, {
            method: 'POST',
            body: JSON.stringify({ cartProductId, quantity: 0})
        });
        loadCart();
    } catch (error) {
        alert('Failed to remove product.');
    }
}

async function checkout() {
    try {
        const userId=1;
        await fetchApi(`/cart/${userId}/checkout`, {method: 'POST' });
        alert('Thank you for your purchase!');
        window.location.href = 'index.html';
    } catch (error) {
        alert('Failed to complete checkout.');
    }
}

// initialization 
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;

    if(currentPage.includes('products.html')) {
        loadProducts();
    } else if (currentPage.includes('details.html')) {
        loadProductDetails();
    } else if (currentPage.includes('cart.html')) {
        loadCart();
    } else if (currentPage.includes('index.html') || currentPage === '/'){
        loadProducts();

    }
    
});