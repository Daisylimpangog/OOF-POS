// API Base URL
const API_BASE = 'http://localhost/OOF%20POS/backend/';

// Default Password (you can change this)
const DEFAULT_PASSWORD = 'admin123';

// ================== LOGIN FUNCTIONS ==================
function handleLogin(event) {
    event.preventDefault();
    
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    console.log('Login attempt with password:', password);
    console.log('Expected password:', DEFAULT_PASSWORD);
    
    // Clear previous error
    errorDiv.textContent = '';
    errorDiv.classList.remove('show');
    
    // Validate password
    if (password === DEFAULT_PASSWORD) {
        console.log('Password correct! Logging in...');
        
        // Set session storage to mark user as logged in
        sessionStorage.setItem('oof_pos_authenticated', 'true');
        sessionStorage.setItem('oof_pos_login_time', new Date().getTime());
        
        // Hide login and show app
        document.getElementById('loginContainer').classList.remove('active');
        document.getElementById('appWrapper').classList.add('active');
        
        // Clear password field
        document.getElementById('loginPassword').value = '';
        
        console.log('Login container active class removed');
        console.log('App wrapper active class added');
        
        // Initialize the app
        initializeApp();
    } else {
        console.log('Password incorrect!');
        
        // Show error
        errorDiv.textContent = '❌ Invalid password. Please try again.';
        errorDiv.classList.add('show');
        document.getElementById('loginPassword').value = '';
        document.getElementById('loginPassword').focus();
    }
}

function togglePasswordVisibility() {
    const input = document.getElementById('loginPassword');
    const toggle = document.querySelector('.password-toggle');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = '🙈';
    } else {
        input.type = 'password';
        toggle.textContent = '👁️';
    }
}

function logout() {
    // Clear session storage
    sessionStorage.removeItem('oof_pos_authenticated');
    sessionStorage.removeItem('oof_pos_login_time');
    
    // Hide app and show login
    document.getElementById('appWrapper').classList.remove('active');
    document.getElementById('loginContainer').classList.add('active');
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginPassword').focus();
    
    // Clear error message
    document.getElementById('loginError').textContent = '';
    document.getElementById('loginError').classList.remove('show');
}

function isUserAuthenticated() {
    return sessionStorage.getItem('oof_pos_authenticated') === 'true';
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    if (isUserAuthenticated()) {
        // User is logged in, show app
        document.getElementById('loginContainer').classList.remove('active');
        document.getElementById('appWrapper').classList.add('active');
        initializeApp();
    } else {
        // User not logged in, show login page
        document.getElementById('appWrapper').classList.remove('active');
        document.getElementById('loginContainer').classList.add('active');
        document.getElementById('loginPassword').focus();
    }
});

function initializeApp() {
    loadStores();
    loadProducts();
    loadSales();
    loadDeliveries();
    setDefaultDate();
    setupEventListeners();
    loadRightSidebarData();
    setInterval(loadRightSidebarData, 30000); // Refresh every 30 seconds
}

function setupEventListeners() {
    // Sidebar navigation
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const module = this.dataset.module;
            if (module) {
                switchModule(module);
            }
        });
    });

    // Modal clicks
    window.addEventListener('click', function(event) {
        if (event.target.id === 'salesModal') {
            closeSalesModal();
        }
        if (event.target.id === 'deliveryModal') {
            closeDeliveryModal();
        }
        if (event.target.id === 'returnModal') {
            closeReturnModal();
        }
        if (event.target.id === 'addProductModal') {
            closeAddProductModal();
        }
        if (event.target.id === 'addStoreModal') {
            closeAddStoreModal();
        }
        if (event.target.id === 'managementModal') {
            closeManagementMenu();
        }
        if (event.target.id === 'productListModal') {
            closeProductListModal();
        }
        if (event.target.id === 'storeListModal') {
            closeStoreListModal();
        }
        if (event.target.id === 'editProductModal') {
            closeEditProductModal();
        }
        if (event.target.id === 'editStoreModal') {
            closeEditStoreModal();
        }
        if (event.target.id === 'salesHistoryModal') {
            closeSalesHistoryModal();
        }
        if (event.target.id === 'deliveriesHistoryModal') {
            closeDeliveriesHistoryModal();
        }
    });

    // Set default month for summary
    const summaryMonth = document.getElementById('summaryMonth');
    if (summaryMonth) {
        summaryMonth.value = new Date().toISOString().slice(0, 7);
    }
}

// Module Switching
function switchModule(module) {
    // Hide all modules
    document.querySelectorAll('.module').forEach(mod => {
        mod.classList.remove('active');
    });

    // Remove active from nav items
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected module
    const moduleEl = document.getElementById(module);
    if (moduleEl) {
        moduleEl.classList.add('active');
    }
    
    const navBtn = document.querySelector(`[data-module="${module}"]`);
    if (navBtn) {
        navBtn.classList.add('active');
    }

    // Load data for summary
    if (module === 'summary') {
        loadMergedSummary();
    }
}

// Filter by category
// Store all products globally for filtering
let allProducts = [];

function filterByCategory(category) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.tab-btn').classList.add('active');
    
    // Filter and display products
    let filtered = allProducts;
    if (category !== 'all') {
        filtered = allProducts.filter(product => product.category === category);
    }
    
    displayProductCards(filtered);
}

function displayProductCards(products) {
    const grid = document.getElementById('productsCardsGrid');
    grid.innerHTML = '';
    
    if (products.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No products found</div>';
        return;
    }
    
    const categoryColors = {
        'HERBS': { color: '#d1f2eb', icon: '🌿' },
        'CROPS': { color: '#fdeaa8', icon: '🌾' },
        'FRUITS': { color: '#dbeafe', icon: '🍎' },
        'VEGETABLES': { color: '#dcfce7', icon: '🥬' },
        'SPICES': { color: '#fed7aa', icon: '🌶️' },
        'EDIBLE FLOWERS': { color: '#fce7f3', icon: '🌸' },
        'FROM THE WILD': { color: '#d1f2eb', icon: '🌿' },
        'EGGS & MEAT': { color: '#f3e8ff', icon: '🥚' },
        'SLOW FRESH DRINKS': { color: '#cffafe', icon: '🥤' }
    };
    
    products.forEach(product => {
        const categoryInfo = categoryColors[product.category] || { color: '#f3f4f6', icon: '📦' };
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.category = product.category;
        card.innerHTML = `
            <div class="card-header" style="background-color: ${categoryInfo.color}; padding: 10px; border-radius: 8px 8px 0 0;">
                <span class="status-badge" style="background-color: ${categoryInfo.color}; color: #000;">${categoryInfo.icon} ${product.category}</span>
            </div>
            <div class="card-body">
                <h3>${product.name}</h3>
                <p class="card-info" style="color: #666; font-size: 0.9em;">
                    Pack Size: <strong>${product.pack_size}</strong>
                </p>
                <div style="display: flex; gap: 10px; margin-top: 8px;">
                    ${product.retail_price ? `<span style="font-size: 0.85em; color: #666;">Retail: <strong>₱${parseFloat(product.retail_price).toFixed(2)}</strong></span>` : ''}
                    ${product.institutional_price ? `<span style="font-size: 0.85em; color: #666;">Inst: <strong>₱${parseFloat(product.institutional_price).toFixed(2)}</strong></span>` : ''}
                </div>
                <div style="margin-top: 12px;">
                    <input type="number" class="quantity-input" value="1" min="0.1" step="0.1" style="width: 60px; padding: 6px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Qty">
                    <button class="btn btn-primary btn-sm" style="margin-left: 8px;" onclick="addToSale(event.target)">Add to Sale</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Add to sale from product card
function addToSale(btn) {
    const card = btn.closest('.product-card');
    const productName = card.querySelector('h3').textContent;
    const quantity = card.querySelector('.quantity-input').value;
    
    if (!quantity || quantity <= 0) {
        showNotification('Please enter a valid quantity', 'error');
        return;
    }
    
    showNotification(`Added ${quantity} of ${productName} to sale`, 'success');
}

// View delivery details
function viewDetails(btn) {
    showNotification('Loading delivery details...', 'success');
}

// Mark delivery as delivered
function markDelivered(btn) {
    const card = btn.closest('.product-card');
    const badge = card.querySelector('.status-badge');
    badge.classList.remove('status-pending');
    badge.classList.add('status-completed');
    badge.textContent = 'Completed';
    showNotification('Delivery marked as completed', 'success');
}

// Print delivery label
function printLabel(btn) {
    showNotification('Printing label...', 'success');
}

// Filter by delivery status
function filterByDeliveryStatus(status) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (event && event.target) {
        event.target.closest('.tab-btn').classList.add('active');
    }
    // Add filtering logic here
}

// Set Default Date
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('saleDate').value = today;
    document.getElementById('deliveryDate').value = today;
}

// ================== PRODUCTS ==================
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}api_products.php?action=all`);
        const result = await response.json();

        if (result.success) {
            const products = result.data;
            allProducts = products; // Store globally for filtering
            
            // Display product cards initially
            displayProductCards(products);

            // Populate sale product dropdown
            const saleProductSelect = document.getElementById('saleProduct');
            saleProductSelect.innerHTML = '<option value="">Select Product</option>';
            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} (${product.category})`;
                option.dataset.category = product.category;
                option.dataset.price = product.price;
                saleProductSelect.appendChild(option);
            });

            // Populate delivery product dropdown
            const deliveryProductSelect = document.getElementById('deliveryProduct');
            deliveryProductSelect.innerHTML = '<option value="">Select Product</option>';
            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} (${product.category})`;
                option.dataset.category = product.category;
                option.dataset.price = product.price;
                deliveryProductSelect.appendChild(option);
            });

            // Update category when sale product selected
            saleProductSelect.addEventListener('change', function() {
                const selected = this.options[this.selectedIndex];
                const category = selected.dataset.category || '';
                document.getElementById('saleCategory').value = category;
            });

            // Update category when delivery product selected
            deliveryProductSelect.addEventListener('change', function() {
                const selected = this.options[this.selectedIndex];
                const category = selected.dataset.category || '';
                document.getElementById('deliveryCategory').value = category;
            });
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Error loading products', 'error');
    }
}

// ================== MANAGEMENT ==================
function openManagementMenu() {
    document.getElementById('managementModal').classList.add('active');
}

function closeManagementMenu() {
    document.getElementById('managementModal').classList.remove('active');
}

// Product List Functions
function openProductListModal() {
    closeManagementMenu();
    document.getElementById('productListModal').classList.add('active');
    loadProductList();
}

function closeProductListModal() {
    document.getElementById('productListModal').classList.remove('active');
}

function loadProductList() {
    fetch(`${API_BASE}api_products.php?action=all`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                displayProductList(result.data);
            }
        })
        .catch(error => console.error('Error loading products:', error));
}

function displayProductList(products) {
    const tbody = document.getElementById('productsListTable');
    tbody.innerHTML = '';

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No products found</td></tr>';
        return;
    }

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td><span class="status-badge" style="background-color: ${product.category === 'HERBS' ? '#d1f2eb' : product.category === 'CROPS' ? '#fdeaa8' : '#dbeafe'}; color: #000;">${product.category}</span></td>
            <td>${product.pack_size || '-'}</td>
            <td>${product.retail_price ? '₱' + parseFloat(product.retail_price).toFixed(2) : '-'}</td>
            <td>${product.institutional_price ? '₱' + parseFloat(product.institutional_price).toFixed(2) : '-'}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="openEditProductModal(${product.id}, '${product.name}', '${product.category}', '${product.pack_size}', ${product.retail_price || 0}, ${product.institutional_price || 0})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            const response = await fetch(`${API_BASE}api_products.php?action=delete&id=${productId}`, {
                method: 'POST'
            });
            const result = await response.json();
            
            if (result.success) {
                showNotification('Product deleted successfully', 'success');
                loadProductList();
                loadProducts();
            } else {
                showNotification('Error deleting product', 'error');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            showNotification('Error deleting product', 'error');
        }
    }
}

// Store List Functions
function openStoreListModal() {
    closeManagementMenu();
    document.getElementById('storeListModal').classList.add('active');
    loadStoreList();
}

function closeStoreListModal() {
    document.getElementById('storeListModal').classList.remove('active');
}

function loadStoreList() {
    fetch(`${API_BASE}api_stores.php`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                displayStoreList(result.data);
            }
        })
        .catch(error => console.error('Error loading stores:', error));
}

function displayStoreList(stores) {
    const tbody = document.getElementById('storesListTable');
    tbody.innerHTML = '';

    if (stores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No stores found</td></tr>';
        return;
    }

    stores.forEach(store => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${store.id}</td>
            <td>${store.name}</td>
            <td>${store.address || '-'}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="openEditStoreModal(${store.id}, '${store.name}', '${store.address || ''}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteStore(${store.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function deleteStore(storeId) {
    if (confirm('Are you sure you want to delete this store?')) {
        try {
            const response = await fetch(`${API_BASE}api_stores.php?action=delete&id=${storeId}`, {
                method: 'POST'
            });
            const result = await response.json();
            
            if (result.success) {
                showNotification('Store deleted successfully', 'success');
                loadStoreList();
                loadStores();
            } else {
                showNotification('Error deleting store', 'error');
            }
        } catch (error) {
            console.error('Error deleting store:', error);
            showNotification('Error deleting store', 'error');
        }
    }
}

// Edit Product Functions
function openEditProductModal(productId, name, category, packSize, retailPrice, institutionalPrice) {
    document.getElementById('editProductId').value = productId;
    document.getElementById('editProductName').value = name;
    document.getElementById('editProductCategory').value = category;
    document.getElementById('editProductPackSize').value = packSize;
    document.getElementById('editProductRetailPrice').value = retailPrice;
    document.getElementById('editProductInstitutionalPrice').value = institutionalPrice;
    document.getElementById('editProductModal').classList.add('active');
}

function closeEditProductModal() {
    document.getElementById('editProductModal').classList.remove('active');
}

async function saveEditProduct(event) {
    event.preventDefault();
    
    const id = document.getElementById('editProductId').value;
    const name = document.getElementById('editProductName').value;
    const category = document.getElementById('editProductCategory').value;
    const packSize = document.getElementById('editProductPackSize').value;
    const retailPrice = document.getElementById('editProductRetailPrice').value;
    const institutionalPrice = document.getElementById('editProductInstitutionalPrice').value;
    
    if (!name || !category || !packSize) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}api_products.php?action=edit&id=${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                category,
                pack_size: packSize,
                retail_price: retailPrice || null,
                institutional_price: institutionalPrice || null
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Product updated successfully', 'success');
            closeEditProductModal();
            loadProductList();
            loadProducts();
        } else {
            showNotification(result.message || 'Error updating product', 'error');
        }
    } catch (error) {
        console.error('Error updating product:', error);
        showNotification('Error updating product', 'error');
    }
}

// Edit Store Functions
function openEditStoreModal(storeId, name, address) {
    document.getElementById('editStoreId').value = storeId;
    document.getElementById('editStoreName').value = name;
    document.getElementById('editStoreAddress').value = address;
    document.getElementById('editStoreModal').classList.add('active');
}

function closeEditStoreModal() {
    document.getElementById('editStoreModal').classList.remove('active');
}

async function saveEditStore(event) {
    event.preventDefault();
    
    const id = document.getElementById('editStoreId').value;
    const name = document.getElementById('editStoreName').value;
    const address = document.getElementById('editStoreAddress').value;
    
    if (!name) {
        showNotification('Store name is required', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}api_stores.php?action=edit&id=${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                address
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Store updated successfully', 'success');
            closeEditStoreModal();
            loadStoreList();
            loadStores();
        } else {
            showNotification(result.message || 'Error updating store', 'error');
        }
    } catch (error) {
        console.error('Error updating store:', error);
        showNotification('Error updating store', 'error');
    }
}

// Sales History Functions
function openSalesHistoryModal() {
    closeManagementMenu();
    document.getElementById('salesHistoryModal').classList.add('active');
    loadSalesHistoryData();
}

function closeSalesHistoryModal() {
    document.getElementById('salesHistoryModal').classList.remove('active');
}

function loadSalesHistoryData() {
    fetch(`${API_BASE}api_sales.php?action=all`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                displaySalesHistory(result.data);
            }
        })
        .catch(error => console.error('Error loading sales history:', error));
}

function displaySalesHistory(sales) {
    const tbody = document.getElementById('salesHistoryTable');
    tbody.innerHTML = '';

    if (sales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No sales found</td></tr>';
        return;
    }

    sales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.product_name}</td>
            <td><span class="status-badge" style="background-color: ${sale.category === 'HERBS' ? '#d1f2eb' : sale.category === 'CROPS' ? '#fdeaa8' : '#dbeafe'}; color: #000;">${sale.category}</span></td>
            <td>${sale.store_name}</td>
            <td>${parseFloat(sale.quantity).toFixed(2)}</td>
            <td>₱${parseFloat(sale.amount).toFixed(2)}</td>
            <td>${formatDate(sale.sale_date)}</td>
            <td>${sale.notes || '-'}</td>
        `;
        tbody.appendChild(row);
    });
}

// Deliveries History Functions
function openDeliveriesHistoryModal() {
    closeManagementMenu();
    document.getElementById('deliveriesHistoryModal').classList.add('active');
    loadDeliveriesHistoryData();
}

function closeDeliveriesHistoryModal() {
    document.getElementById('deliveriesHistoryModal').classList.remove('active');
}

function loadDeliveriesHistoryData() {
    fetch(`${API_BASE}api_deliveries.php?action=all`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                displayDeliveriesHistory(result.data);
            }
        })
        .catch(error => console.error('Error loading deliveries history:', error));
}

function displayDeliveriesHistory(deliveries) {
    const tbody = document.getElementById('deliveriesHistoryTable');
    tbody.innerHTML = '';

    if (deliveries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No deliveries found</td></tr>';
        return;
    }

    deliveries.forEach(delivery => {
        const statusClass = `status-${delivery.status}`;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${delivery.product_name}</td>
            <td><span class="status-badge" style="background-color: ${delivery.category === 'HERBS' ? '#d1f2eb' : delivery.category === 'CROPS' ? '#fdeaa8' : '#dbeafe'}; color: #000;">${delivery.category}</span></td>
            <td>${delivery.store_name}</td>
            <td>${delivery.receiver}</td>
            <td>${parseFloat(delivery.quantity).toFixed(2)}</td>
            <td><span class="status-badge ${statusClass}">${delivery.status.toUpperCase()}</span></td>
            <td>${formatDate(delivery.delivery_date)}</td>
            <td>${delivery.notes || '-'}</td>
        `;
        tbody.appendChild(row);
    });
}

// ================== MANAGEMENT ==================
function openAddProductModal() {
    closeManagementMenu();
    document.getElementById('addProductModal').classList.add('active');
}

function closeAddProductModal() {
    document.getElementById('addProductModal').classList.remove('active');
    document.getElementById('addProductModal').querySelector('form').reset();
}

async function saveProduct(event) {
    event.preventDefault();

    const data = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        pack_size: document.getElementById('productPackSize').value,
        retail_price: parseFloat(document.getElementById('productRetailPrice').value) || null,
        institutional_price: parseFloat(document.getElementById('productInstitutionalPrice').value) || null
    };

    if (!data.name || !data.category || !data.pack_size) {
        showNotification('Please fill all required fields', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}api_products.php?action=add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showNotification('Product added successfully', 'success');
            closeAddProductModal();
            loadProducts();
        } else {
            showNotification('Error adding product: ' + (result.message || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        showNotification('Error adding product: ' + error.message, 'error');
    }
}

// Add Store Functions
function openAddStoreModal() {
    closeManagementMenu();
    document.getElementById('addStoreModal').classList.add('active');
}

function closeAddStoreModal() {
    document.getElementById('addStoreModal').classList.remove('active');
    document.getElementById('addStoreModal').querySelector('form').reset();
}

async function saveStore(event) {
    event.preventDefault();

    const data = {
        name: document.getElementById('storeName').value,
        address: document.getElementById('storeAddress').value || null
    };

    if (!data.name) {
        showNotification('Please enter store name', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}api_stores.php?action=add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showNotification('Store added successfully', 'success');
            closeAddStoreModal();
            loadStores();
        } else {
            showNotification('Error adding store: ' + (result.message || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Error adding store:', error);
        showNotification('Error adding store: ' + error.message, 'error');
    }
}

// ================== STORES ==================
async function loadStores() {
    try {
        const response = await fetch(`${API_BASE}api_stores.php`);
        const result = await response.json();

        if (result.success) {
            const stores = result.data;

            // Populate dropdowns
            const selects = [
                'saleStore',
                'deliveryStore'
            ];

            selects.forEach(selectId => {
                const select = document.getElementById(selectId);
                if (!select) return; // Skip if element doesn't exist
                
                select.innerHTML = '<option value="">Select Store</option>';

                stores.forEach(store => {
                    const option = document.createElement('option');
                    option.value = store.id;
                    option.textContent = store.name;
                    select.appendChild(option);
                });
            });
        }
    } catch (error) {
        console.error('Error loading stores:', error);
        showNotification('Error loading stores', 'error');
    }
}

// ================== SALES ==================
async function loadSales() {
    try {
        const response = await fetch(`${API_BASE}api_sales.php?action=all`);
        const result = await response.json();

        if (result.success) {
            displaySalesTable(result.data);
            updateSalesSummary(result.data);
        }
    } catch (error) {
        console.error('Error loading sales:', error);
        showNotification('Error loading sales', 'error');
    }
}

function displaySalesTable(sales) {
    const tbody = document.getElementById('salesTable');
    tbody.innerHTML = '';

    if (sales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No sales recorded</td></tr>';
        return;
    }

    sales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.product_name}</td>
            <td><span class="status-badge" style="background-color: ${sale.category === 'HERBS' ? '#d1f2eb' : '#fdeaa8'}; color: #000;">${sale.category}</span></td>
            <td>${sale.store_name}</td>
            <td>${parseFloat(sale.quantity).toFixed(2)}</td>
            <td>₱${parseFloat(sale.amount).toFixed(2)}</td>
            <td>${formatDate(sale.sale_date)}</td>
            <td><button class="btn btn-danger" onclick="deleteSale(${sale.id})">Delete</button></td>
        `;
        tbody.appendChild(row);
    });
}

function updateSalesSummary(sales) {
    const totalAmount = sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    document.getElementById('totalSales').textContent = '₱' + totalAmount.toFixed(2);
    document.getElementById('totalSalesCount').textContent = sales.length;
}

function openSalesModal() {
    document.getElementById('salesModal').classList.add('active');
    // Clear inventory info when opening
    document.getElementById('inventoryInfo').innerHTML = '';
}

function closeSalesModal() {
    document.getElementById('salesModal').classList.remove('active');
    document.querySelectorAll('#salesModal input, #salesModal select, #salesModal textarea').forEach(el => {
        el.value = '';
    });
    setDefaultDate();
}

async function saveSale(event) {
    event.preventDefault();

    const productId = document.getElementById('saleProduct').value;
    const storeId = document.getElementById('saleStore').value;
    const quantity = parseFloat(document.getElementById('saleQuantity').value);
    const amount = parseFloat(document.getElementById('saleAmount').value);
    const saleDate = document.getElementById('saleDate').value;
    const notes = document.getElementById('saleNotes').value;
    const unit = 'kg';

    if (!productId || !storeId || !quantity || !amount) {
        showNotification('Please fill all required fields', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}api_sales.php?action=add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: productId,
                store_id: storeId,
                quantity: quantity,
                unit: unit,
                amount: amount,
                sale_date: saleDate,
                notes: notes
            })
        });

        const result = await response.json();

        if (result.success) {
            showNotification('Sale added successfully', 'success');
            closeSalesModal();
            loadSales();
        } else {
            showNotification('Error adding sale: ' + (result.message || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Error adding sale:', error);
        showNotification('Error adding sale: ' + error.message, 'error');
    }
}

function filterSales() {
    // Implement filtering logic
    loadSales();
}

async function downloadSalesPDF() {
    const month = new Date().toISOString().slice(0, 7);
    window.location.href = `${API_BASE}export_pdf.php?action=sales&month=${month}`;
}

async function deleteSale(id) {
    if (confirm('Are you sure you want to delete this sale?')) {
        // Implement delete logic
        loadSales();
    }
}

// ================== DELIVERIES ==================
async function loadDeliveries() {
    try {
        const response = await fetch(`${API_BASE}api_deliveries.php?action=all`);
        const result = await response.json();

        if (result.success) {
            displayDeliveriesTable(result.data);
            updateDeliveriesSummary(result.data);
        }
    } catch (error) {
        console.error('Error loading deliveries:', error);
        showNotification('Error loading deliveries', 'error');
    }
}

function displayDeliveriesTable(deliveries) {
    const tbody = document.getElementById('deliveriesTable');
    tbody.innerHTML = '';

    if (deliveries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No deliveries recorded</td></tr>';
        return;
    }

    deliveries.forEach(delivery => {
        const statusClass = `status-${delivery.status}`;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${delivery.product_name}</td>
            <td><span class="status-badge" style="background-color: ${delivery.category === 'HERBS' ? '#d1f2eb' : '#fdeaa8'}; color: #000;">${delivery.category}</span></td>
            <td>${delivery.store_name}</td>
            <td>${delivery.receiver}</td>
            <td>${parseFloat(delivery.quantity).toFixed(2)}</td>
            <td><span class="status-badge ${statusClass}">${delivery.status.toUpperCase()}</span></td>
            <td>${formatDate(delivery.delivery_date)}</td>
            <td>
                <button class="btn btn-primary" onclick="openReturnModal(${delivery.id})">Return</button>
                <button class="btn btn-danger" onclick="deleteDelivery(${delivery.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateDeliveriesSummary(deliveries) {
    document.getElementById('totalDeliveries').textContent = deliveries.length;
}

function openDeliveryModal() {
    document.getElementById('deliveryModal').classList.add('active');
}

function closeDeliveryModal() {
    document.getElementById('deliveryModal').classList.remove('active');
    document.querySelectorAll('#deliveryModal input, #deliveryModal select, #deliveryModal textarea').forEach(el => {
        el.value = '';
    });
    setDefaultDate();
}

async function saveDelivery(event) {
    event.preventDefault();

    const productId = document.getElementById('deliveryProduct').value;
    const storeId = document.getElementById('deliveryStore').value;
    const quantity = parseFloat(document.getElementById('deliveryQuantity').value);
    const amount = parseFloat(document.getElementById('deliveryAmount').value);
    const receiver = document.getElementById('deliveryReceiver').value;
    const deliveryDate = document.getElementById('deliveryDate').value;
    const notes = document.getElementById('deliveryNotes').value;

    if (!productId || !storeId || !quantity || !amount || !receiver) {
        showNotification('Please fill all required fields', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}api_deliveries.php?action=add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: productId,
                store_id: storeId,
                quantity: quantity,
                amount: amount,
                receiver: receiver,
                delivery_date: deliveryDate,
                notes: notes
            })
        });

        const result = await response.json();

        if (result.success) {
            showNotification('Delivery added successfully', 'success');
            closeDeliveryModal();
            loadDeliveries();
        } else {
            showNotification('Error adding delivery: ' + (result.message || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Error adding delivery:', error);
        showNotification('Error adding delivery: ' + error.message, 'error');
    }
}

function filterDeliveries() {
    loadDeliveries();
}

async function downloadDeliveriesPDF() {
    const month = new Date().toISOString().slice(0, 7);
    window.location.href = `${API_BASE}export_pdf.php?action=deliveries&month=${month}`;
}

let currentReturnDeliveryId = null;

function openReturnModal(deliveryId) {
    currentReturnDeliveryId = deliveryId;
    document.getElementById('returnModal').classList.add('active');
}

function closeReturnModal() {
    document.getElementById('returnModal').classList.remove('active');
    document.getElementById('returnForm').reset();
    currentReturnDeliveryId = null;
}

async function submitReturn(event) {
    event.preventDefault();

    if (!currentReturnDeliveryId) {
        showNotification('Error: No delivery selected', 'error');
        return;
    }

    const data = {
        delivery_id: currentReturnDeliveryId,
        quantity: parseFloat(document.getElementById('returnQuantity').value),
        reason: document.getElementById('returnReason').value
    };

    try {
        const response = await fetch(`${API_BASE}api_deliveries.php?action=return`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showNotification('Product returned successfully', 'success');
            closeReturnModal();
            loadDeliveries();
        } else {
            showNotification('Error processing return: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error processing return:', error);
        showNotification('Error processing return', 'error');
    }
}

async function deleteDelivery(id) {
    if (confirm('Are you sure you want to delete this delivery?')) {
        loadDeliveries();
    }
}

// ================== SUMMARY ==================
async function loadMergedSummary() {
    const month = document.getElementById('summaryMonth').value || new Date().toISOString().slice(0, 7);

    try {
        const response = await fetch(`${API_BASE}api_summary.php?action=merged_monthly&month=${month}`);
        const result = await response.json();

        if (result.success) {
            const data = result.data;
            displaySalesSummary(data.sales);
            displayDeliveriesSummary(data.deliveries);
        }
    } catch (error) {
        console.error('Error loading merged summary:', error);
        showNotification('Error loading summary', 'error');
    }
}

function displaySalesSummary(sales) {
    let totalAmount = 0;
    let totalQuantity = 0;
    let herbsAmount = 0;
    let cropsAmount = 0;
    let fruitsAmount = 0;

    if (sales && sales.length > 0) {
        sales.forEach(sale => {
            const amount = parseFloat(sale.amount) || 0;
            const quantity = parseFloat(sale.quantity) || 0;
            
            totalAmount += amount;
            totalQuantity += quantity;
            
            if (sale.category === 'HERBS') {
                herbsAmount += amount;
            } else if (sale.category === 'CROPS') {
                cropsAmount += amount;
            } else if (sale.category === 'FRUITS') {
                fruitsAmount += amount;
            }
        });
    }

    // Update summary cards
    document.getElementById('summaryTotalSales').textContent = '₱' + totalAmount.toFixed(2);
    document.getElementById('summaryTotalSalesQty').textContent = totalQuantity.toFixed(2) + ' kg';
    document.getElementById('summaryTotalSalesOrders').textContent = (sales ? sales.length : 0);
    document.getElementById('summaryHerbsSales').textContent = '₱' + herbsAmount.toFixed(2);
    document.getElementById('summaryCropsSales').textContent = '₱' + cropsAmount.toFixed(2);
}

function displayDeliveriesSummary(deliveries) {
    let totalDeliveries = 0;
    let totalQuantity = 0;
    let completedCount = 0;
    let pendingCount = 0;
    let returnedCount = 0;
    let returnAmount = 0;

    if (deliveries && deliveries.length > 0) {
        totalDeliveries = deliveries.length;
        
        deliveries.forEach(delivery => {
            const quantity = parseFloat(delivery.quantity) || 0;
            const amount = parseFloat(delivery.amount) || 0;
            
            totalQuantity += quantity;
            
            if (delivery.status === 'completed') {
                completedCount++;
            } else if (delivery.status === 'pending') {
                pendingCount++;
            } else if (delivery.status === 'returned') {
                returnedCount++;
                returnAmount += amount;
            }
        });
    }

    // Update summary cards
    document.getElementById('summaryTotalDeliveries').textContent = totalDeliveries;
    document.getElementById('summaryTotalDeliveriesQty').textContent = totalQuantity.toFixed(2) + ' kg';
    document.getElementById('summaryCompletedDeliveries').textContent = completedCount;
    document.getElementById('summaryPendingDeliveries').textContent = pendingCount;
    document.getElementById('summaryReturnedDeliveries').textContent = returnedCount;
    document.getElementById('summaryReturnAmount').textContent = '₱' + returnAmount.toFixed(2);
}

async function downloadMergedPDF() {
    const month = document.getElementById('summaryMonth').value || new Date().toISOString().slice(0, 7);
    window.location.href = `${API_BASE}export_pdf.php?action=merged&month=${month}`;
}

// ================== UTILITIES ==================
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function showNotification(message, type = 'info') {
    // Create a simple notification (you can replace with a toast library)
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        border-radius: 5px;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ================== RIGHT SIDEBAR FUNCTIONS ==================
function toggleRightSidebar() {
    const sidebar = document.getElementById('rightSidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

function loadRightSidebarData() {
    loadTodayStats();
    loadRecentTransactions();
    loadStoreStatus();
    loadPendingDeliveries();
}

function loadTodayStats() {
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate today's sales
    let todaysSalesAmount = 0;
    let todaysSalesCount = 0;
    let todaysDeliveries = 0;
    
    if (window.salesData && Array.isArray(window.salesData)) {
        window.salesData.forEach(sale => {
            if (sale.date && sale.date.startsWith(today)) {
                todaysSalesAmount += parseFloat(sale.amount) || 0;
                todaysSalesCount++;
            }
        });
    }
    
    if (window.deliveriesData && Array.isArray(window.deliveriesData)) {
        window.deliveriesData.forEach(delivery => {
            if (delivery.date && delivery.date.startsWith(today)) {
                todaysDeliveries++;
            }
        });
    }
    
    document.getElementById('todaysSalesAmount').textContent = '₱' + todaysSalesAmount.toFixed(2);
    document.getElementById('todaysSalesCount').textContent = todaysSalesCount;
    document.getElementById('todaysDeliveries').textContent = todaysDeliveries;
}

function loadRecentTransactions() {
    const container = document.getElementById('recentTransactions');
    
    if (!window.salesData || !Array.isArray(window.salesData)) {
        container.innerHTML = '<p class="text-muted">No recent transactions</p>';
        return;
    }
    
    // Sort sales by date and get last 5
    const recent = window.salesData
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    if (recent.length === 0) {
        container.innerHTML = '<p class="text-muted">No recent transactions</p>';
        return;
    }
    
    let html = '';
    recent.forEach(sale => {
        const product = window.productsData?.find(p => p.id == sale.product_id)?.name || 'Unknown';
        const store = window.storesData?.find(s => s.id == sale.store_id)?.name || 'Unknown';
        const date = formatDate(sale.date);
        
        html += `
            <div class="transaction-item">
                <div class="transaction-product">${product}</div>
                <div class="transaction-details">
                    Store: ${store}<br>
                    Date: ${date}
                </div>
                <div class="transaction-amount">₱${parseFloat(sale.amount).toFixed(2)}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function loadStoreStatus() {
    const container = document.getElementById('storeStatusList');
    
    if (!window.storesData || !Array.isArray(window.storesData)) {
        container.innerHTML = '<p class="text-muted">No stores available</p>';
        return;
    }
    
    let html = '';
    window.storesData.forEach(store => {
        // Count sales for this store
        const storeCount = (window.salesData || []).filter(s => s.store_id == store.id).length;
        const status = storeCount > 0 ? 'Active' : 'Inactive';
        const statusClass = status === 'Active' ? '' : 'inactive';
        
        html += `
            <div class="store-item">
                <span class="store-name">${store.name}</span>
                <span class="store-badge ${statusClass}">${status}</span>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function loadPendingDeliveries() {
    const container = document.getElementById('pendingDeliveriesList');
    
    if (!window.deliveriesData || !Array.isArray(window.deliveriesData)) {
        container.innerHTML = '<p class="text-muted">No pending deliveries</p>';
        return;
    }
    
    // Filter pending deliveries
    const pending = window.deliveriesData.filter(d => d.status === 'pending').slice(0, 5);
    
    if (pending.length === 0) {
        container.innerHTML = '<p class="text-muted">No pending deliveries</p>';
        return;
    }
    
    let html = '';
    pending.forEach(delivery => {
        const product = window.productsData?.find(p => p.id == delivery.product_id)?.name || 'Unknown';
        const receiver = delivery.receiver || 'Unknown';
        const quantity = delivery.quantity || 0;
        
        html += `
            <div class="pending-item">
                <div class="pending-product">${product}</div>
                <div class="pending-details">
                    ${quantity} kg to deliver
                </div>
                <div class="pending-receiver">👤 ${receiver}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}
