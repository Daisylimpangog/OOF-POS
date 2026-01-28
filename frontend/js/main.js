// API Base URL - Dynamic (works with localhost, local IP, and external IP)
const getAPIBase = () => {
    const protocol = window.location.protocol; // http: or https:
    const host = window.location.hostname; // Gets current IP or localhost
    const pathname = window.location.pathname; // Gets the path
    
    // Extract the application root path
    let appPath = '/OOF%20POS/backend/';
    if (pathname.includes('OOF%20POS')) {
        appPath = pathname.substring(0, pathname.indexOf('OOF%20POS')) + 'OOF%20POS/backend/';
    }
    
    return `${protocol}//${host}${appPath}`;
};

const API_BASE = getAPIBase();

console.log('API Base URL:', API_BASE);

// Default Password (you can change this)
const DEFAULT_PASSWORD = 'admin123';

// ================== THEME FUNCTIONS ==================
function initTheme() {
    const savedTheme = localStorage.getItem('oof_pos_theme') || 'light';
    console.log('Loading theme:', savedTheme);
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeButton(true);
    } else {
        document.body.classList.remove('dark-mode');
        updateThemeButton(false);
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('oof_pos_theme', isDark ? 'dark' : 'light');
    updateThemeButton(isDark);
    console.log('Theme toggled to:', isDark ? 'dark' : 'light');
}

function updateThemeButton(isDark) {
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.textContent = isDark ? '☀️' : '🌙';
        btn.title = isDark ? 'Toggle Light Mode' : 'Toggle Dark Mode';
    }
}

// Initialize theme immediately (before DOM ready)
if (localStorage.getItem('oof_pos_theme') === 'dark') {
    document.documentElement.classList.add('dark-mode');
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});

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
    // Load categories first, then other data
    loadCategories().then(() => {
        console.log('Categories loaded, populating dropdowns');
        loadStores();
        loadProducts();
        loadSales();
        loadDeliveries();
        setDefaultDate();
        setupEventListeners();
        loadRightSidebarData();
        // Load dashboard on startup
        setTimeout(() => {
            loadDashboard();
        }, 500);
        setInterval(loadRightSidebarData, 30000); // Refresh every 30 seconds
    }).catch(error => {
        console.error('Error initializing app:', error);
    });
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
        if (event.target.id === 'salesDetailModal') {
            closeSalesDetailModal();
        }
        if (event.target.id === 'deliveryDetailModal') {
            closeDeliveryDetailModal();
        }
        if (event.target.id === 'returnedProductsModal') {
            closeReturnedProductsModal();
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

    // Update header title and buttons based on module
    const headerTitle = document.getElementById('headerTitle');
    const downloadBtn = document.getElementById('downloadBtn');
    const addNewBtn = document.getElementById('addNewBtn');
    
    if (headerTitle) {
        if (module === 'dashboard') {
            headerTitle.textContent = 'Dashboard';
            if (downloadBtn) downloadBtn.style.display = 'none';
            if (addNewBtn) addNewBtn.style.display = 'none';
        } else if (module === 'sales') {
            headerTitle.textContent = 'Sales Management';
            if (downloadBtn) downloadBtn.style.display = 'inline-block';
            if (addNewBtn) {
                addNewBtn.textContent = '+ Add Sale';
                addNewBtn.onclick = openSalesModal;
            }
        } else if (module === 'deliveries') {
            headerTitle.textContent = 'Deliveries Management';
            if (downloadBtn) downloadBtn.style.display = 'none';
            if (addNewBtn) {
                addNewBtn.textContent = '+ Add Deliveries';
                addNewBtn.onclick = openDeliveryModal;
            }
        } else if (module === 'summary') {
            headerTitle.textContent = 'Analytics & Summary';
            if (downloadBtn) downloadBtn.style.display = 'none';
            if (addNewBtn) addNewBtn.style.display = 'none';
        }
    }

    // Load data for modules
    if (module === 'dashboard') {
        loadDashboard();
    } else if (module === 'sales') {
        // Load both sales history and sales management
        loadSales();
        loadSalesManagement();
    } else if (module === 'summary') {
        loadMergedSummary();
    }
}

// Filter by category
// Store all products globally for filtering
let allProducts = [];
let allStoresData = [];

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
    
    // If grid doesn't exist (not in current view), skip rendering
    if (!grid) {
        return;
    }
    
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
        'SLOW FRESH DRINKS': { color: '#cffafe', icon: '🥤' },
        'BASKET/BAGS': { color: '#e0d5ff', icon: '🧺' },
        'DEHYDRATED PRODUCT': { color: '#fef3c7', icon: '🏜️' }
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
            
            // Display product cards initially (if grid exists)
            displayProductCards(products);

            // Populate sale product dropdown (if exists)
            const saleProductSelect = document.getElementById('saleProduct');
            if (saleProductSelect) {
                saleProductSelect.innerHTML = '<option value="">Select Product</option>';
                products.forEach(product => {
                    const option = document.createElement('option');
                    option.value = product.id;
                    option.textContent = `${product.name} (${product.category})`;
                    option.dataset.category = product.category;
                    option.dataset.price = product.price;
                    saleProductSelect.appendChild(option);
                });

                // Update category when sale product selected
                saleProductSelect.addEventListener('change', function() {
                    const selected = this.options[this.selectedIndex];
                    const category = selected.dataset.category || '';
                    const saleCategory = document.getElementById('saleCategory');
                    if (saleCategory) {
                        saleCategory.value = category;
                    }
                });
            }

            // Populate delivery product dropdown (if exists)
            const deliveryProductSelect = document.getElementById('deliveryProduct');
            if (deliveryProductSelect) {
                deliveryProductSelect.innerHTML = '<option value="">Select Product</option>';
                products.forEach(product => {
                    const option = document.createElement('option');
                    option.value = product.id;
                    option.textContent = `${product.name} (${product.category})`;
                    option.dataset.category = product.category;
                    option.dataset.price = product.price;
                    deliveryProductSelect.appendChild(option);
                });

                // Update category when delivery product selected
                deliveryProductSelect.addEventListener('change', function() {
                    const selected = this.options[this.selectedIndex];
                    const category = selected.dataset.category || '';
                    const deliveryCategory = document.getElementById('deliveryCategory');
                    if (deliveryCategory) {
                        deliveryCategory.value = category;
                    }
                });
            }
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
    // Initialize pagination
    productsDisplayData = products;
    productsCurrentPage = 1;
    productsTotalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
    
    displayProductsPage();
    updateProductsPaginationControls();
}

function displayProductsPage() {
    const tbody = document.getElementById('productsListTable');
    tbody.innerHTML = '';

    const startIndex = (productsCurrentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const pageData = productsDisplayData.slice(startIndex, endIndex);

    if (pageData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No products found</td></tr>';
        return;
    }

    pageData.forEach(product => {
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

function updateProductsPaginationControls() {
    const paginationInfo = document.getElementById('productsPaginationInfo');
    const pageNumbers = document.getElementById('productsPageNumbers');
    const prevBtn = document.getElementById('productsPrevBtn');
    const nextBtn = document.getElementById('productsNextBtn');

    if (!paginationInfo) return;

    // Update info text
    const startNum = (productsCurrentPage - 1) * PRODUCTS_PER_PAGE + 1;
    const endNum = Math.min(productsCurrentPage * PRODUCTS_PER_PAGE, productsDisplayData.length);
    paginationInfo.textContent = `Showing ${startNum} to ${endNum} of ${productsDisplayData.length} products`;

    // Update page numbers
    if (pageNumbers) {
        pageNumbers.innerHTML = '';
        
        for (let i = 1; i <= productsTotalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'page-btn';
            if (i === productsCurrentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.textContent = i;
            pageBtn.onclick = () => {
                productsCurrentPage = i;
                displayProductsPage();
                updateProductsPaginationControls();
            };
            pageNumbers.appendChild(pageBtn);
        }
    }

    // Update button states
    if (prevBtn) prevBtn.disabled = productsCurrentPage === 1;
    if (nextBtn) nextBtn.disabled = productsCurrentPage === productsTotalPages;
}

function previousProductsPage() {
    if (productsCurrentPage > 1) {
        productsCurrentPage--;
        displayProductsPage();
        updateProductsPaginationControls();
    }
}

function nextProductsPage() {
    if (productsCurrentPage < productsTotalPages) {
        productsCurrentPage++;
        displayProductsPage();
        updateProductsPaginationControls();
    }
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

// Categories Management Functions
function openCategoriesModal() {
    closeManagementMenu();
    document.getElementById('categoriesModal').classList.add('active');
    loadCategoriesList();
}

function closeCategoriesModal() {
    document.getElementById('categoriesModal').classList.remove('active');
}

function openAddCategoryModal() {
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryDescription').value = '';
    document.getElementById('categoryModalTitle').textContent = '➕ Add Category';
    document.getElementById('categoryModal').classList.add('active');
}

function openEditCategoryModal(id, name, description) {
    document.getElementById('categoryId').value = id;
    document.getElementById('categoryName').value = name;
    document.getElementById('categoryDescription').value = description || '';
    document.getElementById('categoryModalTitle').textContent = '✏️ Edit Category';
    document.getElementById('categoryModal').classList.add('active');
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('active');
}

function loadCategoriesList() {
    fetch(`${API_BASE}api_categories.php?action=all`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                displayCategoriesList(result.data);
            }
        })
        .catch(error => console.error('Error loading categories:', error));
}

function displayCategoriesList(categories) {
    const tbody = document.getElementById('categoriesListTable');
    tbody.innerHTML = '';

    if (categories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No categories found</td></tr>';
        return;
    }

    categories.forEach(category => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category.id}</td>
            <td><strong>${category.name}</strong></td>
            <td>${category.description || '-'}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="openEditCategoryModal(${category.id}, '${category.name.replace(/'/g, "\\'")}', '${(category.description || '').replace(/'/g, "\\'")}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCategory(${category.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function saveCategory(event) {
    event.preventDefault();
    
    const id = document.getElementById('categoryId').value;
    const name = document.getElementById('categoryName').value.trim();
    const description = document.getElementById('categoryDescription').value.trim();
    
    if (!name) {
        showNotification('Category name is required', 'error');
        return;
    }
    
    try {
        const action = id ? 'update' : 'add';
        const data = {
            name: name,
            description: description
        };
        
        if (id) {
            data.id = parseInt(id);
        }
        
        const response = await fetch(`${API_BASE}api_categories.php?action=${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(result.message, 'success');
            closeCategoryModal();
            loadCategoriesList();
            loadCategories(); // Reload categories for product dropdowns
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error saving category:', error);
        showNotification('Error saving category', 'error');
    }
}

async function deleteCategory(categoryId) {
    if (confirm('Are you sure you want to delete this category?')) {
        try {
            const response = await fetch(`${API_BASE}api_categories.php?action=delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: categoryId })
            });
            
            // Get response text first
            const responseText = await response.text();
            console.log('Delete category API Response:', responseText);
            
            // Try to parse JSON
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse response as JSON:', parseError);
                console.error('Response was:', responseText);
                showNotification('Error deleting category: Invalid response from server', 'error');
                return;
            }
            
            if (result.success) {
                showNotification('Category deleted successfully', 'success');
                loadCategoriesList();
                loadCategories(); // Reload categories for product dropdowns
            } else {
                showNotification(result.message || 'Error deleting category', 'error');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            showNotification('Error deleting category: ' + error.message, 'error');
        }
    }
}

async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}api_categories.php?action=all`);
        const result = await response.json();
        
        if (result.success) {
            const select = document.getElementById('saleCategory') || document.getElementById('deliveryCategory');
            if (select) {
                const currentValue = select.value;
                select.innerHTML = '<option value="">Select a category</option>';
                result.data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.name;
                    option.textContent = category.name;
                    select.appendChild(option);
                });
                if (currentValue) {
                    select.value = currentValue;
                }
            }
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadCategoriesForProductForm() {
    try {
        const response = await fetch(`${API_BASE}api_categories.php?action=all`);
        const result = await response.json();
        
        if (result.success) {
            // Update Add Product form
            const productCategorySelect = document.getElementById('productCategory');
            if (productCategorySelect) {
                const currentValue = productCategorySelect.value;
                productCategorySelect.innerHTML = '<option value="">Select Category</option>';
                result.data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.name;
                    option.textContent = category.name;
                    productCategorySelect.appendChild(option);
                });
                if (currentValue) {
                    productCategorySelect.value = currentValue;
                }
            }
            
            // Update Edit Product form
            const editProductCategorySelect = document.getElementById('editProductCategory');
            if (editProductCategorySelect) {
                const currentValue = editProductCategorySelect.value;
                editProductCategorySelect.innerHTML = '<option value="">Select Category</option>';
                result.data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.name;
                    option.textContent = category.name;
                    editProductCategorySelect.appendChild(option);
                });
                if (currentValue) {
                    editProductCategorySelect.value = currentValue;
                }
            }
        }
    } catch (error) {
        console.error('Error loading categories for product form:', error);
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
    loadCategoriesForProductForm();
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
            <td>${formatQuantity(sale.quantity)}</td>
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
            <td>${formatQuantity(delivery.quantity)}</td>
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
    loadCategoriesForProductForm();
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
            allStoresData = stores; // Store globally for Quick Info

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
            allSalesData = result.data;
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
    if (!tbody) return; // Exit if element doesn't exist
    
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
            <td>${formatQuantity(sale.quantity)}</td>
            <td>₱${parseFloat(sale.amount).toFixed(2)}</td>
            <td>${formatDate(sale.sale_date)}</td>
            <td><button class="btn btn-danger" onclick="deleteSale(${sale.id})">Delete</button></td>
        `;
        tbody.appendChild(row);
    });
}

function updateSalesSummary(sales) {
    const totalAmount = sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    const totalSalesEl = document.getElementById('totalSales');
    const totalSalesCountEl = document.getElementById('totalSalesCount');
    
    if (totalSalesEl) {
        totalSalesEl.textContent = '₱' + totalAmount.toFixed(2);
    }
    if (totalSalesCountEl) {
        totalSalesCountEl.textContent = sales.length;
    }
}

function openSalesModal() {
    document.getElementById('salesModal').classList.add('active');
    // Clear inventory info when opening
    const inventoryInfo = document.getElementById('inventoryInfo');
    if (inventoryInfo) {
        inventoryInfo.innerHTML = '';
    }
    // Initialize search functionality
    setTimeout(() => {
        setupSaleProductSearch();
    }, 100);
}

function closeSalesModal() {
    document.getElementById('salesModal').classList.remove('active');
    document.querySelectorAll('#salesModal input, #salesModal select, #salesModal textarea').forEach(el => {
        el.value = '';
    });
    // Clear search results
    const searchInput = document.getElementById('saleProductSearch');
    const resultsDiv = document.getElementById('saleProductSearchResults');
    if (searchInput) searchInput.value = '';
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
        resultsDiv.innerHTML = '';
    }
    setDefaultDate();
}

// Product Search for Sales Modal
function setupSaleProductSearch() {
    const searchInput = document.getElementById('saleProductSearch');
    const resultsDiv = document.getElementById('saleProductSearchResults');
    
    if (!searchInput || !resultsDiv) {
        console.warn('Search elements not found for sales modal');
        return;
    }

    // Remove any existing listeners
    const newSearchInput = searchInput.cloneNode(true);
    searchInput.parentNode.replaceChild(newSearchInput, searchInput);

    const updatedSearchInput = document.getElementById('saleProductSearch');
    
    updatedSearchInput.addEventListener('keyup', function(e) {
        const searchTerm = this.value.toLowerCase().trim();
        console.log('Search triggered:', searchTerm, 'Products available:', allProducts.length);
        
        if (searchTerm.length === 0) {
            resultsDiv.style.display = 'none';
            resultsDiv.innerHTML = '';
            return;
        }

        // Filter products
        const filtered = allProducts.filter(product => {
            const name = (product.name || '').toLowerCase();
            const category = (product.category || '').toLowerCase();
            return name.includes(searchTerm) || category.includes(searchTerm);
        });

        console.log('Filtered results:', filtered.length);

        if (filtered.length === 0) {
            resultsDiv.innerHTML = '<div style="padding: 12px; text-align: center; color: #6B5344;">No products found</div>';
            resultsDiv.style.display = 'block';
            return;
        }

        resultsDiv.innerHTML = '';
        filtered.forEach(product => {
            const item = document.createElement('div');
            item.style.cssText = 'padding: 12px; border-bottom: 1px solid #E8DDD3; cursor: pointer; background-color: var(--bg-secondary);';
            item.innerHTML = `<strong>${product.name}</strong><br><small style="color: #6B5344;">${product.category} • ${product.pack_size}</small>`;
            
            item.onmouseover = () => item.style.backgroundColor = '#F5F1EE';
            item.onmouseout = () => item.style.backgroundColor = 'var(--bg-secondary)';
            
            item.onclick = () => {
                document.getElementById('saleProduct').value = product.id;
                document.getElementById('saleCategory').value = product.category;
                updatedSearchInput.value = product.name;
                resultsDiv.style.display = 'none';
                resultsDiv.innerHTML = '';
                document.getElementById('saleProduct').dispatchEvent(new Event('change'));
            };
            
            resultsDiv.appendChild(item);
        });

        resultsDiv.style.display = 'block';
    });

    // Hide on blur
    updatedSearchInput.addEventListener('blur', function() {
        setTimeout(() => {
            resultsDiv.style.display = 'none';
        }, 200);
    });
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
                product_id: parseInt(productId),
                store_id: parseInt(storeId),
                quantity: quantity,
                unit: unit,
                amount: amount,
                sale_date: saleDate,
                notes: notes
            })
        });

        // Get response text first
        const responseText = await response.text();
        console.log('Sale API Response:', responseText);

        // Try to parse JSON
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse response as JSON:', parseError);
            console.error('Response was:', responseText);
            showNotification('Error adding sale: Invalid response from server', 'error');
            return;
        }

        if (result.success) {
            showNotification('Sale added successfully', 'success');
            closeSalesModal();
            loadSales();
            // Reload deliveries to show deducted quantities
            loadDeliveries();
        } else {
            showNotification('Error adding sale: ' + (result.message || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Error adding sale:', error);
        showNotification('Error adding sale: ' + error.message, 'error');
    }
}

// Store original sales data for filtering
let allSalesData = [];

function applySalesFilters() {
    const filterDateFromEl = document.getElementById('filterDateFrom');
    const filterDateToEl = document.getElementById('filterDateTo');
    const filterCategoryEl = document.getElementById('filterCategory');
    
    if (!filterDateFromEl || !filterDateToEl || !filterCategoryEl) {
        console.warn('Filter elements not found');
        return;
    }
    
    const dateFrom = filterDateFromEl.value;
    const dateTo = filterDateToEl.value;
    const category = filterCategoryEl.value;

    let filtered = allSalesData;

    // Filter by date range
    if (dateFrom) {
        filtered = filtered.filter(sale => sale.sale_date >= dateFrom);
    }
    if (dateTo) {
        filtered = filtered.filter(sale => sale.sale_date <= dateTo);
    }

    // Filter by category
    if (category) {
        filtered = filtered.filter(sale => sale.category === category);
    }

    displaySalesTable(filtered);
    updateSalesSummary(filtered);
}

function resetSalesFilters() {
    const filterDateFromEl = document.getElementById('filterDateFrom');
    const filterDateToEl = document.getElementById('filterDateTo');
    const filterCategoryEl = document.getElementById('filterCategory');
    
    if (filterDateFromEl) filterDateFromEl.value = '';
    if (filterDateToEl) filterDateToEl.value = '';
    if (filterCategoryEl) filterCategoryEl.value = '';
    
    displaySalesTable(allSalesData);
    updateSalesSummary(allSalesData);
}

function printSalesHistory() {
    generateCategoryGroupedPDF(allSalesData);
}

function generateCategoryGroupedPDF(salesData) {
    if (salesData.length === 0) {
        alert('No sales data to print');
        return;
    }

    // Group sales by category
    const groupedByCategory = {};
    salesData.forEach(sale => {
        if (!groupedByCategory[sale.category]) {
            groupedByCategory[sale.category] = [];
        }
        groupedByCategory[sale.category].push(sale);
    });

    const printWindow = window.open('', '', 'height=600,width=800');
    const dateFrom = document.getElementById('filterDateFrom')?.value || '';
    const dateTo = document.getElementById('filterDateTo')?.value || '';

    let dateRange = 'All Dates';
    if (dateFrom && dateTo) {
        dateRange = `${dateFrom} to ${dateTo}`;
    } else if (dateFrom) {
        dateRange = `From ${dateFrom}`;
    } else if (dateTo) {
        dateRange = `Until ${dateTo}`;
    }

    printWindow.document.write(`
        <html>
            <head>
                <title>Sales Report by Category</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h2 { color: #1a202c; text-align: center; }
                    .report-info { margin-bottom: 20px; color: #666; font-size: 14px; text-align: center; }
                    .report-info p { margin: 5px 0; }
                    .category-section { margin-top: 30px; page-break-inside: avoid; }
                    .category-title { background-color: #dbeafe; padding: 12px; font-size: 16px; font-weight: bold; color: #1a202c; margin-bottom: 10px; border-left: 4px solid #0284c7; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
                    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 14px; }
                    th { background-color: #f3f4f6; font-weight: bold; }
                    tr:nth-child(even) { background-color: #f9fafb; }
                    .category-total { background-color: #dcfce7; font-weight: bold; font-size: 13px; }
                    .grand-total-section { margin-top: 30px; padding: 20px; background-color: #dbeafe; border-radius: 6px; text-align: center; }
                    .grand-total-section h3 { margin: 0 0 10px 0; color: #1a202c; }
                    .grand-total { font-size: 24px; color: #059669; font-weight: bold; }
                    .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
                </style>
            </head>
            <body>
                <h2>📋 Sales Report by Category</h2>
                <div class="report-info">
                    <p><strong>Date Range:</strong> ${dateRange}</p>
                    <p><strong>Printed on:</strong> ${new Date().toLocaleString()}</p>
                </div>
    `);

    let grandTotal = 0;
    const categories = Object.keys(groupedByCategory).sort();

    categories.forEach(category => {
        const categorySales = groupedByCategory[category];
        let categoryTotal = 0;

        printWindow.document.write(`
            <div class="category-section">
                <div class="category-title">🏷️ ${category}</div>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Store</th>
                            <th>Quantity (kg)</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
        `);

        categorySales.forEach(sale => {
            const amount = parseFloat(sale.amount);
            categoryTotal += amount;
            grandTotal += amount;

            printWindow.document.write(`
                <tr>
                    <td>${sale.product_name}</td>
                    <td>${sale.store_name}</td>
                    <td>${formatQuantity(sale.quantity)}</td>
                    <td>₱${amount.toFixed(2)}</td>
                    <td>${formatDate(sale.sale_date)}</td>
                </tr>
            `);
        });

        printWindow.document.write(`
                    </tbody>
                </table>
                <div style="text-align: right; padding-right: 10px;">
                    <strong style="color: #059669;">Category Total: ₱${categoryTotal.toFixed(2)}</strong>
                </div>
            </div>
        `);
    });

    printWindow.document.write(`
        <div class="grand-total-section">
            <h3>Total Overall Sales</h3>
            <div class="grand-total">₱${grandTotal.toFixed(2)}</div>
        </div>

        <div class="footer">
            <p>OOF POS - Sales Management System © 2026</p>
        </div>
            </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.print();
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
        try {
            const response = await fetch(`${API_BASE}api_sales.php?action=delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            });

            const result = await response.json();

            if (result.success) {
                showNotification('Sale deleted successfully', 'success');
                loadSales();
            } else {
                showNotification('Error deleting sale: ' + (result.message || 'Unknown error'), 'error');
            }
        } catch (error) {
            console.error('Error deleting sale:', error);
            showNotification('Error deleting sale: ' + error.message, 'error');
        }
    }
}

// ================== DELIVERIES ==================
async function loadDeliveries() {
    try {
        // Load sales first to have updated sold quantities
        const salesResponse = await fetch(`${API_BASE}api_sales.php?action=all`);
        const salesResult = await salesResponse.json();
        if (salesResult.success) {
            allSalesData = salesResult.data;
            console.log('Loaded sales data:', allSalesData);
        } else {
            console.warn('Sales API returned failure:', salesResult);
            allSalesData = [];
        }

        // Now load deliveries
        const response = await fetch(`${API_BASE}api_deliveries.php?action=all`);
        const result = await response.json();

        if (result.success) {
            allDeliveriesData = result.data;
            console.log('Loaded deliveries data:', allDeliveriesData);
            // Use pagination instead of displaying all at once
            initializeDeliveriesPagination(result.data);
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
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">No deliveries recorded</td></tr>';
        return;
    }

    deliveries.forEach(delivery => {
        // Calculate sold quantity for this delivery
        let soldQuantity = 0;
        const deliveryProductId = parseInt(delivery.product_id);
        const deliveryStoreId = parseInt(delivery.store_id);
        
        console.log(`Processing delivery ${delivery.id}: product_id=${deliveryProductId}, store_id=${deliveryStoreId}`);
        
        if (allSalesData && allSalesData.length > 0) {
            allSalesData.forEach(sale => {
                const saleProductId = parseInt(sale.product_id);
                const saleStoreId = parseInt(sale.store_id);
                
                if (saleProductId === deliveryProductId && saleStoreId === deliveryStoreId) {
                    console.log(`Found matching sale: ${sale.quantity} (product_id=${saleProductId}, store_id=${saleStoreId})`);
                    soldQuantity += parseFloat(sale.quantity) || 0;
                }
            });
        } else {
            console.log('No sales data available');
        }
        
        console.log(`Total sold quantity for delivery ${delivery.id}: ${soldQuantity}`);

        const statusClass = `status-${delivery.status}`;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${delivery.product_name}</td>
            <td><span class="status-badge" style="background-color: ${delivery.category === 'HERBS' ? '#d1f2eb' : '#fdeaa8'}; color: #000;">${delivery.category}</span></td>
            <td>${delivery.store_name}</td>
            <td>${delivery.receiver}</td>
            <td>${formatQuantity(delivery.quantity)}</td>
            <td>${formatQuantity(soldQuantity)}</td>
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

// Store original deliveries data and categories for filtering
let allDeliveriesData = [];
let allCategoriesData = [];

// Load categories from database
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}api_categories.php?action=all`);
        const result = await response.json();
        
        if (result.success && result.data) {
            allCategoriesData = result.data;
            console.log('Categories loaded successfully:', allCategoriesData);
            populateCategoryDropdowns();
            return result.data;
        } else {
            console.warn('Categories API returned failure:', result);
            allCategoriesData = [];
            populateCategoryDropdowns();
            return [];
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        allCategoriesData = [];
        populateCategoryDropdowns();
        return [];
    }
}

// Populate all category dropdowns from database categories
function populateCategoryDropdowns() {
    console.log('Populating category dropdowns from database:', allCategoriesData);
    const dropdownIds = ['filterDeliveryStatus', 'filterSalesManagementCategory'];
    
    dropdownIds.forEach(dropdownId => {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) {
            console.warn(`Dropdown with ID '${dropdownId}' not found`);
            return;
        }
        
        // Clear and rebuild
        dropdown.innerHTML = '';
        
        // Add "All Categories" option
        const optionAll = document.createElement('option');
        optionAll.value = '';
        optionAll.textContent = 'All Categories';
        dropdown.appendChild(optionAll);
        
        // Add categories from database
        if (allCategoriesData && Array.isArray(allCategoriesData) && allCategoriesData.length > 0) {
            allCategoriesData.forEach(category => {
                if (category && category.name) {
                    const option = document.createElement('option');
                    option.value = category.name;
                    option.textContent = category.name;
                    dropdown.appendChild(option);
                }
            });
            console.log(`Successfully populated dropdown '${dropdownId}' with ${allCategoriesData.length} categories`);
        } else {
            console.log(`No categories to add to dropdown '${dropdownId}'`);
        }
    });
}

function applyDeliveryFilters() {
    const filterDateFromEl = document.getElementById('filterDeliveryDateFrom');
    const filterDateToEl = document.getElementById('filterDeliveryDateTo');
    const filterStatusEl = document.getElementById('filterDeliveryStatus');
    
    if (!filterDateFromEl || !filterDateToEl || !filterStatusEl) {
        console.warn('Delivery filter elements not found');
        return;
    }
    
    const dateFrom = filterDateFromEl.value;
    const dateTo = filterDateToEl.value;
    const category = filterStatusEl.value;

    let filtered = allDeliveriesData;

    // Filter by date range
    if (dateFrom) {
        filtered = filtered.filter(delivery => delivery.delivery_date >= dateFrom);
    }
    if (dateTo) {
        filtered = filtered.filter(delivery => delivery.delivery_date <= dateTo);
    }

    // Filter by category
    if (category) {
        filtered = filtered.filter(delivery => delivery.category === category);
    }

    // Use pagination for filtered data
    initializeDeliveriesPagination(filtered);
    updateDeliveriesSummary(filtered);
}

function resetDeliveryFilters() {
    const filterDateFromEl = document.getElementById('filterDeliveryDateFrom');
    const filterDateToEl = document.getElementById('filterDeliveryDateTo');
    const filterStatusEl = document.getElementById('filterDeliveryStatus');
    
    if (filterDateFromEl) filterDateFromEl.value = '';
    if (filterDateToEl) filterDateToEl.value = '';
    if (filterStatusEl) filterStatusEl.value = '';
    
    // Use pagination for all data
    initializeDeliveriesPagination(allDeliveriesData);
    updateDeliveriesSummary(allDeliveriesData);
}

function printDeliveriesHistory() {
    // Get the current page data from pagination
    const startIndex = (deliveriesCurrentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageData = deliveriesDisplayData.slice(startIndex, endIndex);
    
    if (pageData.length === 0) {
        alert('No deliveries data to print');
        return;
    }

    // Group deliveries by status (from current page only)
    const groupedByStatus = {
        'pending': [],
        'completed': [],
        'returned': []
    };
    
    pageData.forEach(delivery => {
        if (groupedByStatus[delivery.status]) {
            groupedByStatus[delivery.status].push(delivery);
        }
    });

    const printWindow = window.open('', '', 'height=600,width=800');
    const dateFrom = document.getElementById('filterDeliveryDateFrom')?.value || '';
    const dateTo = document.getElementById('filterDeliveryDateTo')?.value || '';

    let dateRange = 'All Dates';
    if (dateFrom && dateTo) {
        dateRange = `${dateFrom} to ${dateTo}`;
    } else if (dateFrom) {
        dateRange = `From ${dateFrom}`;
    } else if (dateTo) {
        dateRange = `Until ${dateTo}`;
    }

    printWindow.document.write(`
        <html>
            <head>
                <title>Deliveries Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h2 { color: #1a202c; text-align: center; }
                    .report-info { margin-bottom: 20px; color: #666; font-size: 14px; text-align: center; }
                    .report-info p { margin: 5px 0; }
                    .status-section { margin-top: 30px; page-break-inside: avoid; }
                    .status-title { background-color: #dbeafe; padding: 12px; font-size: 16px; font-weight: bold; color: #1a202c; margin-bottom: 10px; border-left: 4px solid #0284c7; }
                    .status-title.pending { background-color: #fef3c7; border-left-color: #f59e0b; }
                    .status-title.completed { background-color: #dcfce7; border-left-color: #16a34a; }
                    .status-title.returned { background-color: #fee2e2; border-left-color: #dc2626; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
                    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 14px; }
                    th { background-color: #f3f4f6; font-weight: bold; }
                    tr:nth-child(even) { background-color: #f9fafb; }
                    .status-total { background-color: #dcfce7; font-weight: bold; font-size: 13px; }
                    .grand-total-section { margin-top: 30px; padding: 20px; background-color: #dbeafe; border-radius: 6px; text-align: center; }
                    .grand-total-section h3 { margin: 0 0 10px 0; color: #1a202c; }
                    .grand-total { font-size: 20px; color: #059669; font-weight: bold; }
                    .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
                    .page-info { text-align: center; color: #0284c7; font-weight: bold; margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <h2>📦 Deliveries Report (Page ${deliveriesCurrentPage} of ${deliveriesTotalPages})</h2>
                <div class="report-info">
                    <p><strong>Date Range:</strong> ${dateRange}</p>
                    <p><strong>Printed on:</strong> ${new Date().toLocaleString()}</p>
                    <p class="page-info">Showing ${startIndex + 1} to ${Math.min(endIndex, deliveriesDisplayData.length)} of ${deliveriesDisplayData.length} deliveries</p>
                </div>
    `);

    let grandTotal = 0;
    const statusOrder = ['pending', 'completed', 'returned'];
    const statusLabels = {
        'pending': '⏳ PENDING',
        'completed': '✓ COMPLETED',
        'returned': '↩️ RETURNED'
    };

    statusOrder.forEach(statusKey => {
        const statusDeliveries = groupedByStatus[statusKey];
        if (statusDeliveries.length === 0) return;

        let statusTotal = statusDeliveries.length;
        let statusQuantity = 0;

        printWindow.document.write(`
            <div class="status-section">
                <div class="status-title ${statusKey}">${statusLabels[statusKey]}</div>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Store</th>
                            <th>Receiver</th>
                            <th>Quantity (kg)</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
        `);

        statusDeliveries.forEach(delivery => {
            const quantity = parseFloat(delivery.quantity);
            statusQuantity += quantity;
            grandTotal += quantity;

            printWindow.document.write(`
                <tr>
                    <td>${delivery.product_name}</td>
                    <td>${delivery.category}</td>
                    <td>${delivery.store_name}</td>
                    <td>${delivery.receiver}</td>
                    <td>${formatQuantity(quantity)}</td>
                    <td>${formatDate(delivery.delivery_date)}</td>
                </tr>
            `);
        });

        printWindow.document.write(`
                    </tbody>
                </table>
            </div>
        `);
    });

    printWindow.document.write(`
        <div class="footer">
            <p>OOF POS - Sales Management System © 2026</p>
            <p>Page ${deliveriesCurrentPage} of ${deliveriesTotalPages}</p>
        </div>
            </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.print();
}

function openDeliveryModal() {
    document.getElementById('deliveryModal').classList.add('active');
    
    // Reset form fields
    document.querySelectorAll('#deliveryModal input, #deliveryModal select, #deliveryModal textarea').forEach(el => {
        if (el.id !== 'deliveryDate') el.value = '';
    });
    
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('deliveryDate').value = today;
    
    // Reload products to ensure fresh data
    loadProducts();
    
    // Initialize search functionality
    setTimeout(() => {
        setupDeliveryProductSearch();
    }, 100);
}

function closeDeliveryModal() {
    document.getElementById('deliveryModal').classList.remove('active');
    document.querySelectorAll('#deliveryModal input, #deliveryModal select, #deliveryModal textarea').forEach(el => {
        el.value = '';
    });
    // Clear search results
    const searchInput = document.getElementById('deliveryProductSearch');
    const resultsDiv = document.getElementById('deliveryProductSearchResults');
    if (searchInput) searchInput.value = '';
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
        resultsDiv.innerHTML = '';
    }
    setDefaultDate();
}

// Product Search for Delivery Modal
function setupDeliveryProductSearch() {
    const searchInput = document.getElementById('deliveryProductSearch');
    const resultsDiv = document.getElementById('deliveryProductSearchResults');
    
    if (!searchInput || !resultsDiv) {
        console.warn('Search elements not found for delivery modal');
        return;
    }

    // Remove any existing listeners
    const newSearchInput = searchInput.cloneNode(true);
    searchInput.parentNode.replaceChild(newSearchInput, searchInput);

    const updatedSearchInput = document.getElementById('deliveryProductSearch');
    
    updatedSearchInput.addEventListener('keyup', function(e) {
        const searchTerm = this.value.toLowerCase().trim();
        console.log('Search triggered:', searchTerm, 'Products available:', allProducts.length);
        
        if (searchTerm.length === 0) {
            resultsDiv.style.display = 'none';
            resultsDiv.innerHTML = '';
            return;
        }

        // Filter products
        const filtered = allProducts.filter(product => {
            const name = (product.name || '').toLowerCase();
            const category = (product.category || '').toLowerCase();
            return name.includes(searchTerm) || category.includes(searchTerm);
        });

        console.log('Filtered results:', filtered.length);

        if (filtered.length === 0) {
            resultsDiv.innerHTML = '<div style="padding: 12px; text-align: center; color: #6B5344;">No products found</div>';
            resultsDiv.style.display = 'block';
            return;
        }

        resultsDiv.innerHTML = '';
        filtered.forEach(product => {
            const item = document.createElement('div');
            item.style.cssText = 'padding: 12px; border-bottom: 1px solid #E8DDD3; cursor: pointer; background-color: var(--bg-secondary);';
            item.innerHTML = `<strong>${product.name}</strong><br><small style="color: #6B5344;">${product.category} • ${product.pack_size}</small>`;
            
            item.onmouseover = () => item.style.backgroundColor = '#F5F1EE';
            item.onmouseout = () => item.style.backgroundColor = 'var(--bg-secondary)';
            
            item.onclick = () => {
                document.getElementById('deliveryProduct').value = product.id;
                document.getElementById('deliveryCategory').value = product.category;
                updatedSearchInput.value = product.name;
                resultsDiv.style.display = 'none';
                resultsDiv.innerHTML = '';
                document.getElementById('deliveryProduct').dispatchEvent(new Event('change'));
            };
            
            resultsDiv.appendChild(item);
        });

        resultsDiv.style.display = 'block';
    });

    // Hide on blur
    updatedSearchInput.addEventListener('blur', function() {
        setTimeout(() => {
            resultsDiv.style.display = 'none';
        }, 200);
    });
}



async function saveDelivery(event) {
    event.preventDefault();

    const productId = document.getElementById('deliveryProduct').value;
    const storeId = document.getElementById('deliveryStore').value;
    const quantity = parseFloat(document.getElementById('deliveryQuantity').value);
    const receiver = document.getElementById('deliveryReceiver').value;
    const deliveryDate = document.getElementById('deliveryDate').value;
    const notes = document.getElementById('deliveryNotes').value;
    const unit = 'kg'; // Default unit

    if (!productId || !storeId || !quantity || !receiver) {
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
                unit: unit,
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
        try {
            const response = await fetch(`${API_BASE}api_deliveries.php?action=delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            });

            const result = await response.json();

            if (result.success) {
                showNotification('Delivery deleted successfully', 'success');
                loadDeliveries();
            } else {
                showNotification('Error deleting delivery: ' + (result.message || 'Unknown error'), 'error');
            }
        } catch (error) {
            console.error('Error deleting delivery:', error);
            showNotification('Error deleting delivery: ' + error.message, 'error');
        }
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

    // Update summary cards - check if element exists before updating
    const totalSalesEl = document.getElementById('summaryTotalSales');
    if (totalSalesEl) totalSalesEl.textContent = '₱' + totalAmount.toFixed(2);
    
    const totalQtyEl = document.getElementById('summaryTotalSalesQty');
    if (totalQtyEl) totalQtyEl.textContent = formatQuantity(totalQuantity) + ' kg';
    
    const totalOrdersEl = document.getElementById('summaryTotalSalesOrders');
    if (totalOrdersEl) totalOrdersEl.textContent = (sales ? sales.length : 0);
    
    const herbsEl = document.getElementById('summaryHerbsSales');
    if (herbsEl) herbsEl.textContent = '₱' + herbsAmount.toFixed(2);
    
    const cropsEl = document.getElementById('summaryCropsSales');
    if (cropsEl) cropsEl.textContent = '₱' + cropsAmount.toFixed(2);
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

    // Update summary cards - check if element exists before updating
    const totalDelEl = document.getElementById('summaryTotalDeliveries');
    if (totalDelEl) totalDelEl.textContent = totalDeliveries;
    
    const totalQtyEl = document.getElementById('summaryTotalDeliveriesQty');
    if (totalQtyEl) totalQtyEl.textContent = formatQuantity(totalQuantity) + ' kg';
    
    const completedEl = document.getElementById('summaryCompletedDeliveries');
    if (completedEl) completedEl.textContent = completedCount;
    
    const pendingEl = document.getElementById('summaryPendingDeliveries');
    if (pendingEl) pendingEl.textContent = pendingCount;
    
    const returnedEl = document.getElementById('summaryReturnedDeliveries');
    if (returnedEl) returnedEl.textContent = returnedCount;
    
    const returnAmountEl = document.getElementById('summaryReturnAmount');
    if (returnAmountEl) returnAmountEl.textContent = '₱' + returnAmount.toFixed(2);
}

async function downloadMergedPDF() {
    const month = document.getElementById('summaryMonth').value || new Date().toISOString().slice(0, 7);
    window.location.href = `${API_BASE}export_pdf.php?action=merged&month=${month}`;
}

function printOverallReport() {
    const month = document.getElementById('summaryMonth').value || new Date().toISOString().slice(0, 7);
    const [year, monthNum] = month.split('-');
    const monthName = new Date(`${year}-${monthNum}-01`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const printWindow = window.open('', '', 'height=900,width=1200');
    
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Overall Report - ${monthName}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; font-size: 11px; }
                h1 { text-align: center; color: #2c3e50; font-size: 18px; margin-bottom: 5px; }
                .report-header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #34495e; padding-bottom: 10px; }
                .report-date { text-align: center; color: #7f8c8d; margin-bottom: 15px; }
                .section-title { background-color: #34495e; color: white; padding: 8px; margin-top: 15px; margin-bottom: 10px; font-weight: bold; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
                th { background-color: #3498db; color: white; padding: 8px; text-align: left; border: 1px solid #2980b9; font-weight: bold; }
                td { padding: 6px 8px; border: 1px solid #bdc3c7; }
                tr:nth-child(even) { background-color: #ecf0f1; }
                .total-row { background-color: #2ecc71; color: white; font-weight: bold; }
                .subtotal-row { background-color: #f39c12; color: white; font-weight: bold; }
                .summary-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px; }
                .stat-box { background-color: #ecf0f1; padding: 10px; border-radius: 5px; text-align: center; }
                .stat-label { color: #7f8c8d; font-size: 11px; }
                .stat-value { font-size: 16px; font-weight: bold; color: #2c3e50; }
                .page-break { page-break-after: always; }
                .footer { text-align: center; color: #7f8c8d; margin-top: 20px; font-size: 9px; }
            </style>
        </head>
        <body>
            <div class="report-header">
                <h1>OOF POS - OVERALL BUSINESS REPORT</h1>
                <div class="report-date">Period: ${monthName}</div>
            </div>
    `;

    // Summary Statistics
    html += `<div class="summary-stats">`;
    
    let totalSalesAmount = 0, totalSalesQty = 0, totalDeliveries = 0, totalDeliveryQty = 0;
    
    if (allSalesData && Array.isArray(allSalesData)) {
        allSalesData.forEach(sale => {
            if (sale.sale_date && sale.sale_date.startsWith(month)) {
                totalSalesAmount += parseFloat(sale.amount) || 0;
                totalSalesQty += parseFloat(sale.quantity) || 0;
            }
        });
    }

    if (allDeliveriesData && Array.isArray(allDeliveriesData)) {
        allDeliveriesData.forEach(delivery => {
            if (delivery.delivery_date && delivery.delivery_date.startsWith(month)) {
                totalDeliveries++;
                totalDeliveryQty += parseFloat(delivery.quantity) || 0;
            }
        });
    }

    html += `
        <div class="stat-box">
            <div class="stat-label">Total Sales Amount</div>
            <div class="stat-value">₱${totalSalesAmount.toFixed(2)}</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">Total Sales Quantity</div>
            <div class="stat-value">${totalSalesQty.toFixed(2)} kg</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">Total Deliveries</div>
            <div class="stat-value">${totalDeliveries} / ${totalDeliveryQty.toFixed(2)} kg</div>
        </div>
    </div>`;

    // Sales Breakdown
    html += `<div class="section-title">📊 SALES BREAKDOWN BY CATEGORY</div>
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Store</th>
                    <th>Quantity (kg)</th>
                    <th>Amount (₱)</th>
                    <th>Date</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>`;

    const salesByMonth = allSalesData ? allSalesData.filter(s => s.sale_date && s.sale_date.startsWith(month)) : [];
    const categoryTotals = {};

    salesByMonth.forEach(sale => {
        const category = sale.category || 'Other';
        if (!categoryTotals[category]) {
            categoryTotals[category] = { qty: 0, amount: 0, count: 0 };
        }
        categoryTotals[category].qty += parseFloat(sale.quantity) || 0;
        categoryTotals[category].amount += parseFloat(sale.amount) || 0;
        categoryTotals[category].count++;

        html += `<tr>
            <td>${sale.product_name || 'N/A'}</td>
            <td>${category}</td>
            <td>${sale.store_name || 'N/A'}</td>
            <td>${formatQuantity(sale.quantity)}</td>
            <td>₱${parseFloat(sale.amount).toFixed(2)}</td>
            <td>${formatDate(sale.sale_date)}</td>
            <td>${sale.notes || '-'}</td>
        </tr>`;
    });

    // Category Subtotals
    Object.keys(categoryTotals).forEach(category => {
        const totals = categoryTotals[category];
        html += `<tr class="subtotal-row">
            <td colspan="2"><strong>${category} Subtotal</strong></td>
            <td></td>
            <td><strong>${totals.qty.toFixed(2)}</strong></td>
            <td><strong>₱${totals.amount.toFixed(2)}</strong></td>
            <td></td>
            <td></td>
        </tr>`;
    });

    html += `<tr class="total-row">
        <td colspan="2"><strong>TOTAL SALES</strong></td>
        <td></td>
        <td><strong>${totalSalesQty.toFixed(2)}</strong></td>
        <td><strong>₱${totalSalesAmount.toFixed(2)}</strong></td>
        <td></td>
        <td></td>
    </tr>`;

    html += `</tbody></table>`;

    // Deliveries Breakdown
    html += `<div class="section-title">📦 DELIVERIES BREAKDOWN BY STATUS</div>
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Store</th>
                    <th>Receiver</th>
                    <th>Quantity (kg)</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>`;

    const deliveriesByMonth = allDeliveriesData ? allDeliveriesData.filter(d => d.delivery_date && d.delivery_date.startsWith(month)) : [];
    const statusTotals = {};

    deliveriesByMonth.forEach(delivery => {
        const status = delivery.status || 'pending';
        if (!statusTotals[status]) {
            statusTotals[status] = { qty: 0, count: 0 };
        }
        statusTotals[status].qty += parseFloat(delivery.quantity) || 0;
        statusTotals[status].count++;

        const statusIcon = status === 'completed' ? '✓' : status === 'pending' ? '⏳' : '↩️';
        html += `<tr>
            <td>${delivery.product_name || 'N/A'}</td>
            <td>${delivery.category || 'N/A'}</td>
            <td>${delivery.store_name || 'N/A'}</td>
            <td>${delivery.receiver || '-'}</td>
            <td>${formatQuantity(delivery.quantity)}</td>
            <td>${statusIcon} ${status.toUpperCase()}</td>
            <td>${formatDate(delivery.delivery_date)}</td>
            <td>${delivery.notes || '-'}</td>
        </tr>`;
    });

    // Status Subtotals
    Object.keys(statusTotals).forEach(status => {
        const totals = statusTotals[status];
        html += `<tr class="subtotal-row">
            <td colspan="4"><strong>${status.toUpperCase()} Subtotal</strong></td>
            <td><strong>${totals.qty.toFixed(2)}</strong></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>`;
    });

    html += `<tr class="total-row">
        <td colspan="4"><strong>TOTAL DELIVERIES</strong></td>
        <td><strong>${totalDeliveryQty.toFixed(2)}</strong></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>`;

    html += `</tbody></table>`;

    // Store Summary
    const storesSummary = {};
    salesByMonth.forEach(sale => {
        if (!storesSummary[sale.store_name]) {
            storesSummary[sale.store_name] = { sales: 0, amount: 0 };
        }
        storesSummary[sale.store_name].sales++;
        storesSummary[sale.store_name].amount += parseFloat(sale.amount) || 0;
    });

    html += `<div class="section-title">🏪 SALES BY STORE</div>
        <table>
            <thead>
                <tr>
                    <th>Store Name</th>
                    <th>Number of Sales</th>
                    <th>Total Amount (₱)</th>
                </tr>
            </thead>
            <tbody>`;

    let storeTotal = 0;
    Object.keys(storesSummary).forEach(store => {
        const data = storesSummary[store];
        storeTotal += data.amount;
        html += `<tr>
            <td>${store}</td>
            <td>${data.sales}</td>
            <td>₱${data.amount.toFixed(2)}</td>
        </tr>`;
    });

    html += `<tr class="total-row">
        <td><strong>TOTAL</strong></td>
        <td></td>
        <td><strong>₱${storeTotal.toFixed(2)}</strong></td>
    </tr>`;

    html += `</tbody></table>`;

    html += `
        <div class="footer">
            <p>Generated: ${new Date().toLocaleString()}</p>
            <p>OOF POS System - Confidential</p>
        </div>
        </body>
        </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
}

// ================== UTILITIES ==================
function formatQuantity(quantity) {
    const num = parseFloat(quantity);
    // Remove unnecessary trailing zeros but keep all significant digits
    return num.toString();
}

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
    
    if (allSalesData && Array.isArray(allSalesData)) {
        allSalesData.forEach(sale => {
            if (sale.sale_date && sale.sale_date.startsWith(today)) {
                todaysSalesAmount += parseFloat(sale.amount) || 0;
                todaysSalesCount++;
            }
        });
    }
    
    if (allDeliveriesData && Array.isArray(allDeliveriesData)) {
        allDeliveriesData.forEach(delivery => {
            if (delivery.delivery_date && delivery.delivery_date.startsWith(today)) {
                todaysDeliveries++;
            }
        });
    }
    
    const todaysSalesAmountEl = document.getElementById('todaysSalesAmount');
    const todaysSalesCountEl = document.getElementById('todaysSalesCount');
    const todaysDeliveriesEl = document.getElementById('todaysDeliveries');
    
    if (todaysSalesAmountEl) todaysSalesAmountEl.textContent = '₱' + todaysSalesAmount.toFixed(2);
    if (todaysSalesCountEl) todaysSalesCountEl.textContent = todaysSalesCount;
    if (todaysDeliveriesEl) todaysDeliveriesEl.textContent = todaysDeliveries;
}

function loadRecentTransactions() {
    const container = document.getElementById('recentTransactions');
    if (!container) return;
    
    if (!allSalesData || !Array.isArray(allSalesData) || allSalesData.length === 0) {
        container.innerHTML = '<p class="text-muted">No recent transactions</p>';
        return;
    }
    
    // Sort sales by date and get last 5
    const recent = [...allSalesData]
        .sort((a, b) => new Date(b.sale_date) - new Date(a.sale_date))
        .slice(0, 5);
    
    if (recent.length === 0) {
        container.innerHTML = '<p class="text-muted">No recent transactions</p>';
        return;
    }
    
    let html = '';
    recent.forEach(sale => {
        const product = sale.product_name || 'Unknown';
        const store = sale.store_name || 'Unknown';
        const date = formatDate(sale.sale_date);
        
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
    if (!container) return;
    
    if (!allStoresData || !Array.isArray(allStoresData) || allStoresData.length === 0) {
        container.innerHTML = '<p class="text-muted">No stores available</p>';
        return;
    }
    
    let html = '';
    allStoresData.forEach(store => {
        // Count sales for this store
        const storeCount = (allSalesData || []).filter(s => s.store_id == store.id).length;
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
    if (!container) return;
    
    if (!allDeliveriesData || !Array.isArray(allDeliveriesData)) {
        container.innerHTML = '<p class="text-muted">No pending deliveries</p>';
        return;
    }
    
    // Filter pending deliveries
    const pending = allDeliveriesData.filter(d => d.status === 'pending').slice(0, 5);
    
    if (pending.length === 0) {
        container.innerHTML = '<p class="text-muted">No pending deliveries</p>';
        return;
    }
    
    let html = '';
    pending.forEach(delivery => {
        const product = delivery.product_name || 'Unknown';
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

// ================== DASHBOARD FUNCTIONS ==================
let dashboardData = {
    fromDate: null,
    toDate: null
};

function loadDashboard() {
    // Get date filters
    const fromDate = document.getElementById('dashboardDateFrom').value;
    const toDate = document.getElementById('dashboardDateTo').value;

    // Load all data first
    Promise.all([
        fetch(`${API_BASE}api_sales.php?action=all`).then(r => {
            if (!r.ok) throw new Error('Sales API error');
            return r.text().then(text => {
                console.log('Sales response:', text);
                return text ? JSON.parse(text) : { data: [] };
            });
        }),
        fetch(`${API_BASE}api_deliveries.php?action=all`).then(r => {
            if (!r.ok) throw new Error('Deliveries API error');
            return r.text().then(text => {
                console.log('Deliveries response:', text);
                return text ? JSON.parse(text) : { data: [] };
            });
        })
    ]).then(([salesRes, deliveriesRes]) => {
        let salesData = salesRes.data || [];
        let deliveriesData = deliveriesRes.data || [];

        // Filter by date range if specified
        if (fromDate) {
            salesData = salesData.filter(s => new Date(s.sale_date) >= new Date(fromDate));
            deliveriesData = deliveriesData.filter(d => new Date(d.delivery_date) >= new Date(fromDate));
        }
        if (toDate) {
            salesData = salesData.filter(s => new Date(s.sale_date) <= new Date(toDate));
            deliveriesData = deliveriesData.filter(d => new Date(d.delivery_date) <= new Date(toDate));
        }

        dashboardData.fromDate = fromDate;
        dashboardData.toDate = toDate;

        console.log('Dashboard Sales Data:', salesData);
        console.log('Dashboard Deliveries Data:', deliveriesData);

        // Update all dashboard sections
        updateDashboardMetrics(salesData, deliveriesData);
        updateDashboardTopProducts(salesData);
        updateDashboardTopProductsQty(salesData);
        updateDashboardSalesByCategory(salesData);
        updateDashboardDeliveryStats(deliveriesData);
        updateDashboardSalesByStore(salesData);
    }).catch(error => {
        console.error('Error loading dashboard:', error);
        console.error('API_BASE:', API_BASE);
        // Show empty state instead of alert
        document.getElementById('dashTotalSales').textContent = '₱0.00';
        document.getElementById('dashTotalTransactions').textContent = '0';
        document.getElementById('dashTotalQuantity').textContent = '0 kg';
        document.getElementById('dashAvgOrderValue').textContent = '₱0.00';
    });
}

function resetDashboardFilters() {
    document.getElementById('dashboardDateFrom').value = '';
    document.getElementById('dashboardDateTo').value = '';
    loadDashboard();
}

function updateDashboardMetrics(salesData, deliveriesData) {
    const totalSales = salesData.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);
    const totalTransactions = salesData.length;
    const totalQuantity = salesData.reduce((sum, s) => sum + (parseFloat(s.quantity) || 0), 0);
    const avgOrderValue = totalTransactions > 0 ? totalSales / totalTransactions : 0;

    document.getElementById('dashTotalSales').textContent = '₱' + totalSales.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('dashTotalTransactions').textContent = totalTransactions;
    document.getElementById('dashTotalQuantity').textContent = formatQuantity(totalQuantity) + ' kg';
    document.getElementById('dashAvgOrderValue').textContent = '₱' + avgOrderValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function updateDashboardTopProducts(salesData) {
    // Group by product and sum amounts
    const productMap = {};
    salesData.forEach(sale => {
        const productId = sale.product_id || sale.product_name || 'Unknown';
        if (!productMap[productId]) {
            productMap[productId] = {
                name: sale.product_name || 'Unknown',
                amount: 0,
                count: 0
            };
        }
        productMap[productId].amount += parseFloat(sale.amount) || 0;
        productMap[productId].count++;
    });

    // Sort by amount and get top 5
    const topProducts = Object.values(productMap)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

    let html = '<table class="dashboard-mini-table"><tbody>';
    topProducts.forEach((prod, index) => {
        html += `<tr>
            <td style="font-weight: 600; color: #7c3aed;">${index + 1}.</td>
            <td>${prod.name}</td>
            <td style="text-align: right; font-weight: 600;">₱${prod.amount.toFixed(2)}</td>
            <td style="text-align: center; color: #6b7280;">(${prod.count}x)</td>
        </tr>`;
    });
    html += '</tbody></table>';

    if (topProducts.length === 0) {
        html = '<p class="text-muted">No sales data available</p>';
    }

    document.getElementById('dashTopProducts').innerHTML = html;
}

function updateDashboardTopProductsQty(salesData) {
    // Group by product and sum quantities
    const productMap = {};
    salesData.forEach(sale => {
        const productId = sale.product_id || sale.product_name || 'Unknown';
        if (!productMap[productId]) {
            productMap[productId] = {
                name: sale.product_name || 'Unknown',
                quantity: 0,
                transactions: 0
            };
        }
        productMap[productId].quantity += parseFloat(sale.quantity) || 0;
        productMap[productId].transactions++;
    });

    // Sort by quantity and get top 5
    const topProducts = Object.values(productMap)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

    let html = '<table class="dashboard-mini-table"><tbody>';
    topProducts.forEach((prod, index) => {
        html += `<tr>
            <td style="font-weight: 600; color: #7c3aed;">${index + 1}.</td>
            <td>${prod.name}</td>
            <td style="text-align: right; font-weight: 600;">${prod.formatQuantity(quantity)} kg</td>
            <td style="text-align: center; color: #6b7280;">(${prod.transactions}x)</td>
        </tr>`;
    });
    html += '</tbody></table>';

    if (topProducts.length === 0) {
        html = '<p class="text-muted">No sales data available</p>';
    }

    document.getElementById('dashTopProductsQty').innerHTML = html;
}

function updateDashboardSalesByCategory(salesData) {
    // Group by category
    const categoryMap = {};
    salesData.forEach(sale => {
        const category = sale.category || 'Other';
        if (!categoryMap[category]) {
            categoryMap[category] = {
                amount: 0,
                quantity: 0,
                count: 0
            };
        }
        categoryMap[category].amount += parseFloat(sale.amount) || 0;
        categoryMap[category].quantity += parseFloat(sale.quantity) || 0;
        categoryMap[category].count++;
    });

    // Sort by amount
    const categories = Object.entries(categoryMap)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.amount - a.amount);

    let html = '<table class="dashboard-mini-table"><tbody>';
    categories.forEach(cat => {
        html += `<tr>
            <td style="font-weight: 600;">${cat.name}</td>
            <td style="text-align: right; font-weight: 600;">₱${cat.amount.toFixed(2)}</td>
            <td style="text-align: right; color: #6b7280;">${cat.formatQuantity(quantity)} kg</td>
        </tr>`;
    });
    html += '</tbody></table>';

    if (categories.length === 0) {
        html = '<p class="text-muted">No sales data available</p>';
    }

    document.getElementById('dashSalesByCategory').innerHTML = html;
}

function updateDashboardDeliveryStats(deliveriesData) {
    const total = deliveriesData.length;
    const completed = deliveriesData.filter(d => d.status === 'completed').length;
    const pending = deliveriesData.filter(d => d.status === 'pending').length;
    const returned = deliveriesData.filter(d => d.status === 'returned').length;

    document.getElementById('dashTotalDeliveries').textContent = total;
    document.getElementById('dashCompletedDeliveries').textContent = completed;
    document.getElementById('dashPendingDeliveries').textContent = pending;
    document.getElementById('dashReturnedDeliveries').textContent = returned;
}

function updateDashboardSalesByStore(salesData) {
    // Group by store
    const storeMap = {};
    salesData.forEach(sale => {
        const storeId = sale.store_id || 'Unknown';
        const storeName = sale.store_name || `Store ${storeId}`;
        
        if (!storeMap[storeId]) {
            storeMap[storeId] = {
                name: storeName,
                amount: 0,
                quantity: 0,
                count: 0
            };
        }
        storeMap[storeId].amount += parseFloat(sale.amount) || 0;
        storeMap[storeId].quantity += parseFloat(sale.quantity) || 0;
        storeMap[storeId].count++;
    });

    // Sort by amount
    const stores = Object.values(storeMap)
        .sort((a, b) => b.amount - a.amount);

    let html = '<table class="dashboard-mini-table"><tbody>';
    stores.forEach(store => {
        html += `<tr>
            <td style="font-weight: 600;">🏪 ${store.name}</td>
            <td style="text-align: right; font-weight: 600;">₱${store.amount.toFixed(2)}</td>
            <td style="text-align: right; color: #6b7280;">${store.formatQuantity(quantity)} kg</td>
        </tr>`;
    });
    html += '</tbody></table>';

    if (stores.length === 0) {
        html = '<p class="text-muted">No sales data available</p>';
    }

    document.getElementById('dashSalesByStore').innerHTML = html;
}

// ================== ANALYTICS DETAIL MODALS ==================
let summaryAllSalesData = [];
let summaryAllDeliveriesData = [];

function showSalesDetailModal(filterType) {
    const month = document.getElementById('summaryMonth').value;
    
    if (!month) {
        showNotification('Please select a month first', 'warning');
        return;
    }

    // Fetch sales data for the month
    fetch(`${API_BASE}api_sales.php?action=monthly_summary&month=${month}`)
        .then(r => r.text().then(text => text ? JSON.parse(text) : { data: [] }))
        .then(result => {
            let salesData = result.data || [];
            
            // Apply filter
            if (filterType === 'all') {
                document.getElementById('salesDetailTitle').textContent = 'All Sales';
            } else if (filterType === 'quantity') {
                document.getElementById('salesDetailTitle').textContent = 'Sales by Quantity';
            } else if (filterType === 'HERBS' || filterType === 'CROPS') {
                document.getElementById('salesDetailTitle').textContent = `${filterType} Sales`;
                salesData = salesData.filter(s => s.category === filterType);
            }

            displaySalesDetailTable(salesData);
            document.getElementById('salesDetailModal').classList.add('active');
        })
        .catch(error => console.error('Error loading sales details:', error));
}

function displaySalesDetailTable(salesData) {
    const tbody = document.getElementById('salesDetailTable');
    tbody.innerHTML = '';

    if (salesData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No sales found</td></tr>';
        return;
    }

    salesData.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.product_name}</td>
            <td><span class="status-badge" style="background-color: ${sale.category === 'HERBS' ? '#d1f2eb' : sale.category === 'CROPS' ? '#fdeaa8' : '#dbeafe'}; color: #000;">${sale.category}</span></td>
            <td>${sale.store_name}</td>
            <td>${parseFloat(sale.total_quantity || 0).toFixed(2)}</td>
            <td>₱${parseFloat(sale.total_amount || 0).toFixed(2)}</td>
            <td>${formatDate(sale.sale_date || new Date().toISOString().split('T')[0])}</td>
        `;
        tbody.appendChild(row);
    });
}

function closeSalesDetailModal() {
    document.getElementById('salesDetailModal').classList.remove('active');
}

function showDeliveryDetailModal(filterType) {
    const month = document.getElementById('summaryMonth').value;
    
    if (!month) {
        showNotification('Please select a month first', 'warning');
        return;
    }

    // Fetch all deliveries and filter
    fetch(`${API_BASE}api_deliveries.php?action=all`)
        .then(r => r.text().then(text => text ? JSON.parse(text) : { data: [] }))
        .then(result => {
            let deliveriesData = result.data || [];
            
            // Filter by month
            deliveriesData = deliveriesData.filter(d => {
                const deliveryMonth = d.delivery_date.substring(0, 7);
                return deliveryMonth === month;
            });

            // Apply status filter
            if (filterType === 'completed') {
                document.getElementById('deliveryDetailTitle').textContent = 'Completed Deliveries';
                deliveriesData = deliveriesData.filter(d => d.status === 'completed');
            } else if (filterType === 'all') {
                document.getElementById('deliveryDetailTitle').textContent = 'All Deliveries';
            }

            displayDeliveryDetailTable(deliveriesData);
            document.getElementById('deliveryDetailModal').classList.add('active');
        })
        .catch(error => console.error('Error loading delivery details:', error));
}

function displayDeliveryDetailTable(deliveriesData) {
    const tbody = document.getElementById('deliveryDetailTable');
    tbody.innerHTML = '';

    if (deliveriesData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No deliveries found</td></tr>';
        return;
    }

    deliveriesData.forEach(delivery => {
        const statusClass = `status-${delivery.status}`;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${delivery.product_name}</td>
            <td>${delivery.store_name}</td>
            <td>${delivery.receiver}</td>
            <td>${formatQuantity(delivery.quantity)}</td>
            <td><span class="status-badge ${statusClass}">${delivery.status.toUpperCase()}</span></td>
            <td>${formatDate(delivery.delivery_date)}</td>
        `;
        tbody.appendChild(row);
    });
}

function closeDeliveryDetailModal() {
    document.getElementById('deliveryDetailModal').classList.remove('active');
}

function showReturnedProductsModal() {
    const month = document.getElementById('summaryMonth').value;
    
    if (!month) {
        showNotification('Please select a month first', 'warning');
        return;
    }

    // Fetch all deliveries and get returned ones
    fetch(`${API_BASE}api_deliveries.php?action=all`)
        .then(r => r.text().then(text => text ? JSON.parse(text) : { data: [] }))
        .then(result => {
            let deliveriesData = result.data || [];
            
            // Filter by month and status
            deliveriesData = deliveriesData.filter(d => {
                const deliveryMonth = d.delivery_date.substring(0, 7);
                return deliveryMonth === month && d.status === 'returned';
            });

            // Also get sales data for calculating remaining products
            return fetch(`${API_BASE}api_sales.php?action=all`)
                .then(r => r.text().then(text => text ? JSON.parse(text) : { data: [] }))
                .then(salesResult => {
                    let salesData = salesResult.data || [];
                    displayReturnedProductsTable(deliveriesData, salesData, month);
                });
        })
        .catch(error => console.error('Error loading returned products:', error));

    document.getElementById('returnedProductsModal').classList.add('active');
}

function displayReturnedProductsTable(returnedDeliveries, allSales, month) {
    const tbody = document.getElementById('returnedProductsTable');
    tbody.innerHTML = '';

    if (returnedDeliveries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No returned products found</td></tr>';
        return;
    }

    // Group returned products
    const returnedMap = {};
    returnedDeliveries.forEach(delivery => {
        const key = delivery.product_id;
        if (!returnedMap[key]) {
            returnedMap[key] = {
                name: delivery.product_name,
                returned_quantity: 0
            };
        }
        returnedMap[key].returned_quantity += parseFloat(delivery.quantity);
    });

    // Calculate product left (total delivered - returned - sold in the same month)
    const productLeftMap = {};
    allSales.forEach(sale => {
        if (sale.sale_date.substring(0, 7) === month) {
            const key = sale.product_id;
            if (!productLeftMap[key]) {
                productLeftMap[key] = 0;
            }
            productLeftMap[key] += parseFloat(sale.quantity);
        }
    });

    // Display in table
    Object.values(returnedMap).forEach(item => {
        const productLeft = productLeftMap[item.id] || 0;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.returned_formatQuantity(quantity)}</td>
            <td>${productLeft.toFixed(2)}</td>
            <td>${formatDate(new Date().toISOString().split('T')[0])}</td>
        `;
        tbody.appendChild(row);
    });
}

function closeReturnedProductsModal() {
    document.getElementById('returnedProductsModal').classList.remove('active');
}

// ================== SALES MANAGEMENT FUNCTIONS ==================

async function loadSalesManagement() {
    try {
        // Load sales first
        const salesResponse = await fetch(`${API_BASE}api_sales.php?action=all`);
        const salesResult = await salesResponse.json();
        if (!salesResult.success) {
            throw new Error('Failed to load sales data');
        }

        // Load deliveries
        const deliveriesResponse = await fetch(`${API_BASE}api_deliveries.php?action=all`);
        const deliveriesResult = await deliveriesResponse.json();
        if (!deliveriesResult.success) {
            throw new Error('Failed to load deliveries data');
        }

        // Initialize pagination with sales data
        initializeSalesManagementPagination(salesResult.data || [], deliveriesResult.data || []);
    } catch (error) {
        console.error('Error loading sales management:', error);
        showNotification('Error loading sales management data', 'error');
    }
}


function displaySalesManagementTable(sales, deliveries) {
    const tbody = document.getElementById('salesManagementTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (sales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center">No sales recorded</td></tr>';
        return;
    }

    // Create a map of deliveries for quick lookup
    const deliveryMap = {};
    deliveries.forEach(delivery => {
        const key = `${delivery.product_id}_${delivery.store_id}`;
        if (!deliveryMap[key]) {
            deliveryMap[key] = [];
        }
        deliveryMap[key].push(delivery);
    });

    sales.forEach(sale => {
        // Calculate remaining quantity and get actual deliveries for this day
        let remainingQty = parseFloat(sale.quantity) || 0;
        let actualDeliveries = 0;
        let deliveredDate = 'N/A';
        const deliveryKey = `${sale.product_id}_${sale.store_id}`;
        const saleDate = sale.sale_date.substring(0, 10); // Get just the date part YYYY-MM-DD
        
        // Find deliveries for this product and store that match the sale date
        if (deliveryMap[deliveryKey]) {
            const deliveriesForProduct = deliveryMap[deliveryKey];
            let totalDelivered = 0;
            
            // Get the original delivery quantity on the same day as the sale
            deliveriesForProduct.forEach(d => {
                const deliveryDate = d.delivery_date.substring(0, 10);
                if (deliveryDate === saleDate) {
                    // Show the original delivery quantity (not deducted)
                    actualDeliveries += parseFloat(d.quantity) || 0;
                    deliveredDate = formatDate(d.delivery_date);
                }
                totalDelivered += parseFloat(d.quantity) || 0;
            });
            
            // Calculate total sold for this product and store
            let totalSold = 0;
            sales.forEach(s => {
                if (s.product_id == sale.product_id && s.store_id == sale.store_id) {
                    totalSold += parseFloat(s.quantity) || 0;
                }
            });
            
            remainingQty = totalDelivered - totalSold;
            if (remainingQty < 0) remainingQty = 0;
        }

        console.log(`Sale ${sale.id}: Quantity=${sale.quantity}, Actual Deliveries=${actualDeliveries}, Remaining=${remainingQty}`);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.product_name}</td>
            <td><span class="status-badge" style="background-color: ${sale.category === 'HERBS' ? '#d1f2eb' : '#fdeaa8'}; color: #000;">${sale.category}</span></td>
            <td>${sale.store_name}</td>
            <td>${formatQuantity(sale.quantity)}</td>
            <td>₱${parseFloat(sale.amount).toFixed(2)}</td>
            <td>${remainingQty.toFixed(2)}</td>
            <td>${actualDeliveries > 0 ? actualDeliveries.toFixed(2) : '-'}</td>
            <td>${deliveredDate}</td>
            <td>${formatDate(sale.sale_date)}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editSale(${sale.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteSale(${sale.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

let filteredSalesManagementData = [];

function applySalesManagementFilters() {
    const dateFrom = document.getElementById('filterSalesManagementDateFrom')?.value;
    const dateTo = document.getElementById('filterSalesManagementDateTo')?.value;
    const category = document.getElementById('filterSalesManagementCategory')?.value;

    if (!dateFrom || !dateTo) {
        showNotification('Please select both from and to dates', 'warning');
        return;
    }

    filteredSalesManagementData = allSalesData.filter(sale => {
        const saleDate = new Date(sale.sale_date);
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        
        let matchDate = saleDate >= fromDate && saleDate <= toDate;
        let matchCategory = !category || sale.category === category;
        
        return matchDate && matchCategory;
    });

    if (filteredSalesManagementData.length === 0) {
        showNotification('No sales found for the selected filters', 'info');
    }

    // Use pagination with filtered data
    initializeSalesManagementPagination(filteredSalesManagementData, allDeliveriesData);
}


function resetSalesManagementFilters() {
    document.getElementById('filterSalesManagementDateFrom').value = '';
    document.getElementById('filterSalesManagementDateTo').value = '';
    document.getElementById('filterSalesManagementCategory').value = '';
    
    loadSalesManagement();
}

function printSalesManagement() {
    const printWindow = window.open('', '', 'height=600,width=800');
    
    const table = document.getElementById('salesManagementTable');
    const tableHTML = `
        <html>
            <head>
                <title>Sales Management Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #4CAF50; color: white; }
                    tr:nth-child(even) { background-color: #f2f2f2; }
                    h2 { color: #333; }
                </style>
            </head>
            <body>
                <h2>Sales Management Report</h2>
                <p>Generated on: ${new Date().toLocaleString()}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Store</th>
                            <th>Quantity (kg)</th>
                            <th>Amount</th>
                            <th>Remaining Qty (kg)</th>
                            <th>Delivered Date</th>
                            <th>Sale Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${table.innerHTML}
                    </tbody>
                </table>
            </body>
        </html>
    `;
    
    printWindow.document.write(tableHTML);
    printWindow.document.close();
    printWindow.print();
}

// ================== PAGINATION SYSTEM ==================
const ITEMS_PER_PAGE = 20;
const PRODUCTS_PER_PAGE = 15;

// Products Pagination Variables
let productsCurrentPage = 1;
let productsTotalPages = 1;
let productsDisplayData = [];

// Sales Management Pagination Variables
let salesManagementCurrentPage = 1;
let salesManagementTotalPages = 1;
let salesManagementDisplayData = [];

// Deliveries Pagination Variables
let deliveriesCurrentPage = 1;
let deliveriesTotalPages = 1;
let deliveriesDisplayData = [];

// ================== SALES MANAGEMENT PAGINATION ==================
function initializeSalesManagementPagination(data, deliveries) {
    salesManagementDisplayData = data;
    salesManagementCurrentPage = 1;
    salesManagementTotalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    // Store deliveries globally for pagination
    window.salesManagementDeliveries = deliveries;
    displaySalesManagementTableWithPagination(data, deliveries);
    updateSalesManagementPaginationControls();
}

function displaySalesManagementTableWithPagination(sales, deliveries) {
    const startIndex = (salesManagementCurrentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageData = salesManagementDisplayData.slice(startIndex, endIndex);
    
    const tbody = document.getElementById('salesManagementTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (pageData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">No sales recorded</td></tr>';
        return;
    }

    // Use stored deliveries or the parameter
    const allDeliveries = window.salesManagementDeliveries || deliveries || allDeliveriesData || [];

    // Create a map of deliveries for quick lookup
    const deliveryMap = {};
    allDeliveries.forEach(delivery => {
        const key = `${delivery.product_id}_${delivery.store_id}`;
        if (!deliveryMap[key]) {
            deliveryMap[key] = [];
        }
        deliveryMap[key].push(delivery);
    });

    pageData.forEach(sale => {
        let actualDeliveries = 0;
        let deliveredDate = 'N/A';
        const deliveryKey = `${sale.product_id}_${sale.store_id}`;
        
        // Get ALL deliveries for this product and store
        if (deliveryMap[deliveryKey]) {
            const deliveriesForProduct = deliveryMap[deliveryKey];
            
            // Sum all delivered quantities for this product/store
            deliveriesForProduct.forEach(d => {
                actualDeliveries += parseFloat(d.quantity) || 0;
                if (deliveredDate === 'N/A') {
                    deliveredDate = formatDate(d.delivery_date);
                }
            });
        }
        
        // Calculate total sold for this product and store (across ALL sales)
        let totalSold = 0;
        allSalesData.forEach(s => {
            if (s.product_id == sale.product_id && s.store_id == sale.store_id) {
                totalSold += parseFloat(s.quantity) || 0;
            }
        });
        
        // Calculate remaining: actual delivered - total sold
        let remainingQty = actualDeliveries - totalSold;
        if (remainingQty < 0) remainingQty = 0;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.product_name}</td>
            <td><span class="status-badge" style="background-color: ${sale.category === 'HERBS' ? '#d1f2eb' : '#fdeaa8'}; color: #000;">${sale.category}</span></td>
            <td>${sale.store_name}</td>
            <td>${formatQuantity(sale.quantity)}</td>
            <td>₱${parseFloat(sale.amount).toFixed(2)}</td>
            <td>${remainingQty.toFixed(2)}</td>
            <td>${actualDeliveries > 0 ? actualDeliveries.toFixed(2) : '-'}</td>
            <td>${formatDate(sale.sale_date)}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editSale(${sale.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteSale(${sale.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateSalesManagementPaginationControls() {
    const startIndex = (salesManagementCurrentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, salesManagementDisplayData.length);
    
    document.getElementById('salesManagementPaginationInfo').textContent = 
        `Showing ${startIndex + 1}-${endIndex} of ${salesManagementDisplayData.length} transactions`;
    
    // Update previous button
    const prevBtn = document.getElementById('salesManagementPrevBtn');
    if (prevBtn) {
        prevBtn.disabled = salesManagementCurrentPage === 1;
    }
    
    // Update next button
    const nextBtn = document.getElementById('salesManagementNextBtn');
    if (nextBtn) {
        nextBtn.disabled = salesManagementCurrentPage === salesManagementTotalPages;
    }
    
    // Generate page numbers
    const pageNumbersContainer = document.getElementById('salesManagementPageNumbers');
    if (pageNumbersContainer) {
        pageNumbersContainer.innerHTML = '';
        
        for (let i = 1; i <= salesManagementTotalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'page-btn';
            if (i === salesManagementCurrentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.textContent = i;
            pageBtn.onclick = () => goToSalesManagementPage(i);
            pageNumbersContainer.appendChild(pageBtn);
        }
    }
}

function previousSalesManagementPage() {
    if (salesManagementCurrentPage > 1) {
        salesManagementCurrentPage--;
        displaySalesManagementTableWithPagination(salesManagementDisplayData, allDeliveriesData);
        updateSalesManagementPaginationControls();
        window.scrollTo(0, 0);
    }
}

function nextSalesManagementPage() {
    if (salesManagementCurrentPage < salesManagementTotalPages) {
        salesManagementCurrentPage++;
        displaySalesManagementTableWithPagination(salesManagementDisplayData, allDeliveriesData);
        updateSalesManagementPaginationControls();
        window.scrollTo(0, 0);
    }
}

function goToSalesManagementPage(pageNumber) {
    salesManagementCurrentPage = pageNumber;
    displaySalesManagementTableWithPagination(salesManagementDisplayData, allDeliveriesData);
    updateSalesManagementPaginationControls();
    window.scrollTo(0, 0);
}

// ================== DELIVERIES PAGINATION ==================
function initializeDeliveriesPagination(data) {
    deliveriesDisplayData = data;
    deliveriesCurrentPage = 1;
    deliveriesTotalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    displayDeliveriesTableWithPagination(data);
    updateDeliveriesPaginationControls();
}

function displayDeliveriesTableWithPagination(deliveries) {
    const startIndex = (deliveriesCurrentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageData = deliveriesDisplayData.slice(startIndex, endIndex);
    
    const tbody = document.getElementById('deliveriesTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (pageData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">No deliveries recorded</td></tr>';
        return;
    }

    const categoryColors = {
        'HERBS': { color: '#d1f2eb', icon: '🌿' },
        'CROPS': { color: '#fdeaa8', icon: '🌾' },
        'FRUITS': { color: '#dbeafe', icon: '🍎' },
        'BASKET/BAGS': { color: '#e0d5ff', icon: '🧺' },
        'DEHYDRATED PRODUCT': { color: '#fef3c7', icon: '🏜️' }
    };

    pageData.forEach(delivery => {
        // Calculate sold quantity for this delivery
        let soldQuantity = 0;
        const deliveryProductId = parseInt(delivery.product_id);
        const deliveryStoreId = parseInt(delivery.store_id);
        
        if (allSalesData && allSalesData.length > 0) {
            allSalesData.forEach(sale => {
                const saleProductId = parseInt(sale.product_id);
                const saleStoreId = parseInt(sale.store_id);
                
                if (saleProductId === deliveryProductId && saleStoreId === deliveryStoreId) {
                    soldQuantity += parseFloat(sale.quantity) || 0;
                }
            });
        }

        const categoryInfo = categoryColors[delivery.category] || { color: '#f3f4f6', icon: '📦' };
        const statusClass = `status-${delivery.status}`;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${delivery.product_name}</td>
            <td><span class="status-badge" style="background-color: ${categoryInfo.color}; color: #000;">${categoryInfo.icon} ${delivery.category}</span></td>
            <td>${delivery.store_name}</td>
            <td>${delivery.receiver}</td>
            <td>${formatQuantity(delivery.quantity)}</td>
            <td>${formatQuantity(soldQuantity)}</td>
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

function updateDeliveriesPaginationControls() {
    const startIndex = (deliveriesCurrentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, deliveriesDisplayData.length);
    
    document.getElementById('deliveriesPaginationInfo').textContent = 
        `Showing ${startIndex + 1}-${endIndex} of ${deliveriesDisplayData.length} transactions`;
    
    // Update previous button
    const prevBtn = document.getElementById('deliveriesPrevBtn');
    if (prevBtn) {
        prevBtn.disabled = deliveriesCurrentPage === 1;
    }
    
    // Update next button
    const nextBtn = document.getElementById('deliveriesNextBtn');
    if (nextBtn) {
        nextBtn.disabled = deliveriesCurrentPage === deliveriesTotalPages;
    }
    
    // Generate page numbers
    const pageNumbersContainer = document.getElementById('deliveriesPageNumbers');
    if (pageNumbersContainer) {
        pageNumbersContainer.innerHTML = '';
        
        for (let i = 1; i <= deliveriesTotalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'page-btn';
            if (i === deliveriesCurrentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.textContent = i;
            pageBtn.onclick = () => goToDeliveriesPage(i);
            pageNumbersContainer.appendChild(pageBtn);
        }
    }
}

function previousDeliveriesPage() {
    if (deliveriesCurrentPage > 1) {
        deliveriesCurrentPage--;
        displayDeliveriesTableWithPagination(deliveriesDisplayData);
        updateDeliveriesPaginationControls();
        window.scrollTo(0, 0);
    }
}

function nextDeliveriesPage() {
    if (deliveriesCurrentPage < deliveriesTotalPages) {
        deliveriesCurrentPage++;
        displayDeliveriesTableWithPagination(deliveriesDisplayData);
        updateDeliveriesPaginationControls();
        window.scrollTo(0, 0);
    }
}

function goToDeliveriesPage(pageNumber) {
    deliveriesCurrentPage = pageNumber;
    displayDeliveriesTableWithPagination(deliveriesDisplayData);
    updateDeliveriesPaginationControls();
    window.scrollTo(0, 0);
}

// ================== END PAGINATION SYSTEM ==================


