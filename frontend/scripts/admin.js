// admin side of the setup for scripts

//load products for admin page
async function loadAdminProducts() {
    const tbody = document.querySelector('.product-listings tbody');
    if (!tbody) return;

    try {
        const products = await fetchApi('/products');

        tbody.innerHTML = products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td><img str="${product.image_url}" class="product-img"></td>
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>${product.category_name || 'N/A'}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${product.num_pieces}</td>
                <td class="action-btn">
                    <a href="product-edit.html?id=${product.id}" class="edit-btn">Edit</a>
                    <button class="archive-btn" onclick="alert('Archive not implemented')">Archive</button>
                    <button class="delete-btn" onclick="alert('Delete not implemented')">Delete</button>
                </td>
            </tr>
            `).join('');
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="8">Failed to load products</td></tr>';
    }
}

// setup product form for editing 
function setupProductForm() {
    const form = document.querySelector('.edit-form');
    if(!form) return;

    const params = getUrlParams();

    if (params.id) {
        loadProductForEdit(params.id);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const productId = document.getElementById('product-id').value;
        const formData = {
            name: document.getElementById('product-name').value,
            description: document.getElementById('product-description').value,
            image_url: document.getElementById('product-image').value,
            price: document.getElementById('product-price').value,
            num_pieces: document.getElementById('product-pieces').value,
            category_id: document.getElementById('product-category').value,
            age_rating: '10+',
            item_num: Math.floor(Math.random() * 1000)
        };

        try {
            if (productId) {
                // update existing product
                await fetchApi(`/admin/products/${productId}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
            } else {
                await fetchApi('/admin/products', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
            }

            alert('Product saved successfully');
            window.location.href = 'admin-products.html';
        } catch (error) {
            alert('Failed to save product');
        }
    });
}

async function loadProductForEdit(productId) {
    try {
        const product = await fetchApi(`/products/${productId}`);

        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-image').value = product.image_url;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-pieces').value = product.num_pieces;

        if (product.category_id) {
            document.getElementById('product-category').value = product.category_id;
        }
    } catch (error) {
        alert('Failed to load product details');
    }
}

// init admin page
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;

    if(currentPage.includes('admin-products.html')) {
        loadAdminProducts();
    } else if (currentPage.includes('product-edit.html')) {
        setupProductForm();
    }
});