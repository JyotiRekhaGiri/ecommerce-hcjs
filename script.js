// Function to fetch product data from the provided API
async function fetchProductData(category) {
    try {
        const response = await fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
        const data = await response.json();
        const categories = data.categories;
        const categoryData = categories.find(cat => cat.category_name.toLowerCase() === category.toLowerCase());
        return categoryData ? categoryData.category_products : [];
    } catch (error) {
        console.error('Error fetching product data:', error);
        return []; // Return an empty array in case of error
    }
}

// Function to display product cards in the specified category tab
async function displayProducts(category) {
    try {
        const products = await fetchProductData(category);
        const productContainer = document.getElementById(category);
        productContainer.innerHTML = ''; // Clear previous products

        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.innerHTML = `
                <div class="image-wrapper">
                    <img src="${product.image}" alt="${product.title}">
                    ${product.badge_text ? `<div class="badge">${product.badge_text}</div>` : ''}
                </div>
                <div class="product-details">
                    <div class="product-head">
                        <h3>${product.title}</h3>
                        <p>&#8226; ${product.vendor}</p> <!-- Bullet point for vendor -->
                    </div>
                    <div class="price">
                    <p style="font-weight: bold; margin-right: 5px;">$${product.price}</p>
                        <p class="compare-price"><span style="color: grey;">$${product.compare_at_price}</span></p>
                        <p class="discount"><span style="color: red;">${calculateDiscount(product.price, product.compare_at_price)}% Off</span></p>
                    </div>
                </div>
                <button class="add-to-cart">Add to Cart</button>
            `;
            productContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error displaying product data:', error);
    }
}

// Function to calculate discount percentage
function calculateDiscount(price, compareAtPrice) {
    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

// Function to open the selected category tab
function openCategory(event, category) {
    const tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }

    const tablinks = document.getElementsByClassName('tablinks');
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove('active');
    }

    document.getElementById(category).style.display = 'flex'; // Set display to flex
    event.currentTarget.classList.add('active');

    displayProducts(category);
}

// // Display the default category tab on page load
// window.onload = function() {
//     const event = {}; // Create an empty event object
//     const category = 'Men'; // Set the default category
//     openCategory(event, category); // Display Men's details on page load
// };
