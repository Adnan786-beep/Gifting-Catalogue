// Products array mapped to your images folder (C:\Gift Product\image\)
const products = [
    { id: 'HPK01', category: '2-in-1 Sets', name: 'Black & Gold Keyring Pen Set', image: 'image/0.jpg' },
    { id: 'HPK02', category: '2-in-1 Sets', name: 'Classic Executive Pen & Keyring', image: 'image/1.jpg' },
    { id: 'HPK03', category: '2-in-1 Sets', name: 'Gold-Trimmed Gift Set', image: 'image/2.jpg' },
    { id: 'HPK04', category: '2-in-1 Sets', name: 'Silver & Gold Pen Keyring Set', image: 'image/3.jpg' },
    { id: 'PC01', category: 'Cardholder Sets', name: 'Ball Pen & Cardholder Gift Set', image: 'image/PC01.jpg' },
    { id: 'PM01', category: 'Powerbank Sets', name: '10000mAh Powerbank & Foldable Stand', image: 'image/PM01.jpg' },
    { id: 'WB01', category: 'Leather Sets', name: 'PU Leather Wallet & Belt Gift Set', image: 'image/WB01.jpg' },
    { id: 'DP01', category: 'Diary Sets', name: 'Ball Pen & 160Pgs Hardbound Diary', image: 'image/DP01.jpg' },
    { id: 'CKP01', category: '3-in-1 Sets', name: 'Card Holder, Ball Pen & Hook Keychain', image: 'image/CKP01.jpg' },
    { id: 'DPB01', category: 'Flask Sets', name: 'Temperature Bottle, Pen & Diary Set', image: 'image/DPB01.jpg' },
    { id: 'DW001', category: 'Drinkware', name: 'Temperature Bottle (Black, White, Red, Blue)', image: 'image/DW001.jpg' },
    { id: 'DW007', category: 'Drinkware', name: 'Thermos Cup Bottle 500ml', image: 'image/DW007.jpg' },
    { id: 'VL01', category: 'Leather Accessories', name: 'Premium Executive Laptop Bag', image: 'image/VL01.jpg' },
    { id: 'WI01', category: 'Writing Instruments', name: 'Stylus Ball Pen Metal Finish', image: 'image/WI01.jpg' }
];

let cart = {};
let activeCategory = 'All';
let selectedProduct = null;
let currentDrawerQty = 1;

const categories = ['All', ...new Set(products.map(p => p.category))];

function renderCategoryTabs() {
    const tabsContainer = document.getElementById('category-tabs');
    tabsContainer.innerHTML = categories.map(cat => `
        <button onclick="setCategory('${cat}')" class="px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] sm:text-xs font-semibold transition ${activeCategory === cat ? 'bg-amber-500 text-slate-900 shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">
            ${cat}
        </button>
    `).join('');
}

function setCategory(category) {
    activeCategory = category;
    renderCategoryTabs();
    filterProducts();
}

function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const grid = document.getElementById('product-grid');

    const filtered = products.filter(p => {
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm) || p.id.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-10 text-gray-500 text-xs sm:text-sm">No products found matching your search.</div>`;
        return;
    }

    grid.innerHTML = filtered.map(p => `
        <div class="bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col justify-between hover:shadow-md transition">
            <div class="cursor-pointer group" onclick="openProductDrawer('${p.id}')">
                <div class="relative overflow-hidden bg-gray-50">
                    <img src="${p.image}" alt="${p.name}" 
                         onerror="this.onerror=null; this.src='https://placehold.co/300x200/1e293b/f59e0b?text=${p.id}';" 
                         class="w-full h-36 sm:h-44 object-cover group-hover:scale-105 transition duration-300">
                    <span class="absolute bottom-1 right-1 bg-slate-900/80 text-amber-400 text-[9px] px-1.5 py-0.5 rounded backdrop-blur-sm">Tap for details</span>
                </div>
                <div class="p-2 sm:p-3">
                    <span class="bg-amber-100 text-amber-800 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded">${p.id}</span>
                    <h3 class="font-bold text-xs sm:text-sm mt-1 text-slate-900 line-clamp-1">${p.name}</h3>
                    <p class="text-[10px] sm:text-xs text-gray-500">${p.category}</p>
                </div>
            </div>
            <div class="p-2 sm:p-3 pt-0">
                <button onclick="addToCart('${p.id}')" class="w-full bg-slate-900 hover:bg-amber-500 hover:text-slate-900 text-white font-semibold py-1 sm:py-1.5 rounded text-[11px] sm:text-xs transition">
                    + Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Side Drawer Functions for Product Details
function openProductDrawer(productId) {
    selectedProduct = products.find(p => p.id === productId);
    if (!selectedProduct) return;

    currentDrawerQty = 1;
    document.getElementById('drawer-qty').innerText = currentDrawerQty;
    document.getElementById('drawer-title').innerText = selectedProduct.id;
    document.getElementById('drawer-code').innerText = selectedProduct.id;
    document.getElementById('drawer-name').innerText = selectedProduct.name;
    document.getElementById('drawer-category').innerText = selectedProduct.category;
    document.getElementById('drawer-image').src = selectedProduct.image;

    // Show drawer and backdrop
    document.getElementById('product-drawer').classList.remove('translate-x-full');
    document.getElementById('backdrop').classList.remove('hidden');
}

function closeProductDrawer() {
    document.getElementById('product-drawer').classList.add('translate-x-full');
    checkBackdrop();
}

function changeDrawerQty(delta) {
    currentDrawerQty = Math.max(1, currentDrawerQty + delta);
    document.getElementById('drawer-qty').innerText = currentDrawerQty;
}

function addCurrentProductToCart() {
    if (!selectedProduct) return;
    
    if (cart[selectedProduct.id]) {
        cart[selectedProduct.id].qty += currentDrawerQty;
    } else {
        cart[selectedProduct.id] = { ...selectedProduct, qty: currentDrawerQty };
    }
    
    updateCartUI();
    closeProductDrawer();
    toggleCart(); // Open cart drawer to confirm
}

function sendSingleWhatsAppInquiry() {
    if (!selectedProduct) return;
    const phone = document.getElementById('whatsapp-number').value.replace(/[^0-9]/g, '');
    if (!phone) {
        alert('Please enter a valid phone number with country code in the cart.');
        return;
    }

    const message = `Hello, I am interested in inquiring about:\n\n*Code:* ${selectedProduct.id}\n*Product:* ${selectedProduct.name}\n*Quantity:* ${currentDrawerQty}\n\nPlease share the pricing and availability.`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Cart Drawer Functions
function addToCart(productId) {
    if (cart[productId]) {
        cart[productId].qty += 1;
    } else {
        const product = products.find(p => p.id === productId);
        cart[productId] = { ...product, qty: 1 };
    }
    updateCartUI();
}

function updateQuantity(productId, change) {
    if (cart[productId]) {
        cart[productId].qty += change;
        if (cart[productId].qty <= 0) {
            delete cart[productId];
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const totalCount = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').innerText = totalCount;
    document.getElementById('drawer-cart-count').innerText = totalCount;

    const cartItemsContainer = document.getElementById('cart-items');
    
    if (Object.keys(cart).length === 0) {
        cartItemsContainer.innerHTML = `<div class="text-center py-12 text-gray-400 text-xs sm:text-sm">Your cart is empty. Tap items to add inquiries.</div>`;
        return;
    }

    cartItemsContainer.innerHTML = Object.values(cart).map(item => `
        <div class="py-3 flex justify-between items-center gap-2">
            <div class="flex-grow">
                <p class="font-bold text-xs text-slate-900">${item.id} - ${item.name}</p>
                <p class="text-[10px] text-gray-500">${item.category}</p>
            </div>
            <div class="flex items-center gap-2 bg-gray-100 rounded px-2 py-1">
                <button onclick="updateQuantity('${item.id}', -1)" class="text-gray-600 font-bold px-1 text-xs hover:text-slate-900">-</button>
                <span class="text-xs font-semibold px-1">${item.qty}</span>
                <button onclick="updateQuantity('${item.id}', 1)" class="text-gray-600 font-bold px-1 text-xs hover:text-slate-900">+</button>
            </div>
        </div>
    `).join('');
}

function toggleCart() {
    const cartDrawer = document.getElementById('cart-drawer');
    closeProductDrawer();
    cartDrawer.classList.toggle('translate-x-full');
    checkBackdrop();
}

function closeAllDrawers() {
    document.getElementById('product-drawer').classList.add('translate-x-full');
    document.getElementById('cart-drawer').classList.add('translate-x-full');
    document.getElementById('backdrop').classList.add('hidden');
}

function checkBackdrop() {
    const isCartOpen = !document.getElementById('cart-drawer').classList.contains('translate-x-full');
    const isProductOpen = !document.getElementById('product-drawer').classList.contains('translate-x-full');
    
    if (isCartOpen || isProductOpen) {
        document.getElementById('backdrop').classList.remove('hidden');
    } else {
        document.getElementById('backdrop').classList.add('hidden');
    }
}

function sendToWhatsApp() {
    const items = Object.values(cart);
    if (items.length === 0) {
        alert('Please add at least one item to the cart first!');
        return;
    }

    const phone = document.getElementById('whatsapp-number').value.replace(/[^0-9]/g, '');
    if (!phone) {
        alert('Please enter a valid phone number with country code.');
        return;
    }

    let message = "Hello, I would like to inquire about the following corporate gifts:\n\n";
    items.forEach((item, index) => {
        message += `${index + 1}. Code: *${item.id}* | Qty: *${item.qty}* (${item.name})\n`;
    });
    message += "\nPlease let me know the availability and pricing.";

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Initialise on script load
renderCategoryTabs();
filterProducts();