const API_KEY = 'cb7fdb3cd1msh55af9eb038823afp137b0ajsnead1ebd5cf01';
const API_HOST = 'real-time-amazon-data.p.rapidapi.com';

let favs = [];

function loadFavs() {
    const saved = localStorage.getItem('amazonFavorites');
    if (saved) {
        favs = JSON.parse(saved);
        showFavs();
    }
}

function saveFavs() {
    localStorage.setItem('amazonFavorites', JSON.stringify(favs));
}

async function search() {
    const query = document.getElementById('search').value.trim();
    if (!query) {
        document.getElementById('error').textContent = 'Please enter a search term';
        return;
    }

    document.getElementById('error').textContent = 'Loading...';
    document.getElementById('results').innerHTML = '';
    document.getElementById('result-count').textContent = '';

    try {
        const url = `https://${API_HOST}/search?query=${encodeURIComponent(query)}&page=1&country=US`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': API_HOST
            }
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        document.getElementById('error').textContent = '';

        if (data.data && data.data.products && data.data.products.length > 0) {
            // Limit to 24 products
            let products = shuffleArray(data.data.products.slice()); 
            products = products.slice(0, 24); 

            const total = data.data.products.length;

            // Show result count
            if (total > 24) {
                document.getElementById('result-count').textContent =
                    `Showing 24 results out of ${total} total`;
            } else {
                document.getElementById('result-count').textContent =
                    `Showing ${total} result${total > 1 ? 's' : ''}`;
            }

            showProducts(products);
        } else {
            document.getElementById('result-count').textContent = '';
            document.getElementById('error').textContent = 'No products found';
        }
    } catch (e) {
        document.getElementById('error').textContent = 'Error: ' + e.message;
    }
}

function showProducts(products) {
    let html = '';
    products.forEach(p => {
        const price = p.product_price || 'Price not available';
        const rating = p.product_star_rating || 'No rating';
        const image = p.product_photo || '';
        const title = p.product_title || 'No title';

        html += `
            <div class="product-card">
                <div class="product-image">
                    ${image ? `<img src="${image}" alt="${title}">` : '<div style="width:150px;height:150px;background:#eee;display:flex;align-items:center;justify-content:center;">No Image</div>'}
                </div>
                <div class="product-info">
                    <h3>${title}</h3>
                    <div class="product-price">${price}</div>
                    <div class="product-rating">⭐ ${rating}</div>
                    <button onclick='add(${JSON.stringify(p).replace(/'/g, "&#39;")})'>Add to Favorites</button>
                </div>
            </div>
        `;
    });
    document.getElementById('results').innerHTML = html;
}

function add(product) {
    const id = product.asin || product.product_url || Math.random().toString();
    if (!favs.find(f => (f.asin || f.product_url) === id)) {
        favs.push(product);
        saveFavs();
        showFavs();
        alert(`"${product.product_title}" added to favorites!`);

        const errorEl = document.getElementById('error');
        errorEl.className = 'success-message';
        errorEl.textContent = `"${product.product_title}" added to favorites!`;
        setTimeout(() => {
            errorEl.className = '';
            errorEl.textContent = '';
        }, 2000);
    } else {
        document.getElementById('error').textContent = 'Already in favorites!';
    }
}

function remove(index) {
    favs.splice(index, 1);
    saveFavs();
    showFavs();
    alert('"${product.product_title}" removed from favorites');
}

function showFavs() {
    document.getElementById('count').textContent = favs.length;

    if (favs.length === 0) {
        document.getElementById('favorites').innerHTML = '<p style="color:#7f8c8d;font-style:italic;">No favorites yet</p>';
        return;
    }

    let html = '';
    favs.forEach((p, index) => {
        const price = p.product_price || 'Price not available';
        const rating = p.product_star_rating || 'No rating';
        const image = p.product_photo || '';
        const title = p.product_title || 'No title';

        html += `
            <div class="product-card">
                <div class="product-image">
                    ${image ? `<img src="${image}" alt="${title}">` : '<div style="width:150px;height:150px;background:#eee;">No Image</div>'}
                </div>
                <div class="product-info">
                    <h3>${title}</h3>
                    <div class="product-price">${price}</div>
                    <div class="product-rating">⭐ ${rating}</div>
                    <button onclick="remove(${index})">Remove</button>
                </div>
            </div>
        `;
    });
    document.getElementById('favorites').innerHTML = html;
}

function exportFav() {
    if (favs.length === 0) {
        alert('No favorites to export');
        return;
    }
    const blob = new Blob([JSON.stringify(favs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amazon-favorites.json';
    a.click();
    URL.revokeObjectURL(url);
    alert('Favorites exported as amazon-favorites.json');
}

function clearFavs() {
    if (confirm('Delete all favorites?')) {
        favs = [];
        saveFavs();
        showFavs();
    }
}

document.getElementById('search').addEventListener('keydown', e => {
    if (e.key === 'Enter') search();
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


loadFavs();