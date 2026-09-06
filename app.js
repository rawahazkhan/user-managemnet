// Minimal & Clean Authentication, Dashboard & Products Controller

const VALID_USERS = {
  admin: { password: "admin123", role: "Administrator", name: "System Admin" },
  user: { password: "user123", role: "Standard User", name: "Demo User" }
};

// Initial Products Data
let products = [
  {
    id: "prod-1",
    name: "Ultra-Wide Gaming Monitor 34\"",
    category: "Electronics",
    price: 599.99,
    stock: 12,
    status: "In Stock",
    icon: "🖥️"
  },
  {
    id: "prod-2",
    name: "Noise-Cancelling Wireless Headphones",
    category: "Accessories",
    price: 199.99,
    stock: 34,
    status: "In Stock",
    icon: "🎧"
  },
  {
    id: "prod-3",
    name: "Ergonomic Mechanical Keyboard",
    category: "Accessories",
    price: 129.50,
    stock: 8,
    status: "In Stock",
    icon: "⌨️"
  },
  {
    id: "prod-4",
    name: "Enterprise Cloud Suite License",
    category: "Software",
    price: 49.00,
    stock: 100,
    status: "In Stock",
    icon: "☁️"
  },
  {
    id: "prod-5",
    name: "USB-C Multi-Port Hub Pro",
    category: "Electronics",
    price: 45.00,
    stock: 3,
    status: "Low Stock",
    icon: "🔌"
  },
  {
    id: "prod-6",
    name: "Smart LED Desk Lamp with Wireless Charging",
    category: "Office",
    price: 39.99,
    stock: 0,
    status: "Out of Stock",
    icon: "💡"
  }
];

// DOM Elements - Authentication & Shell
const loginView = document.getElementById("login-view");
const dashboardView = document.getElementById("dashboard-view");
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const togglePasswordBtn = document.getElementById("toggle-password");
const errorBanner = document.getElementById("error-banner");
const errorMessage = document.getElementById("error-message");
const logoutBtn = document.getElementById("logout-btn");

// DOM Elements - Dashboard Shell
const dashboardUsername = document.getElementById("dashboard-username");
const welcomeUserName = document.getElementById("welcome-user-name");
const navAvatar = document.getElementById("nav-avatar");
const userRole = document.getElementById("user-role");
const sessionCounter = document.getElementById("session-counter");
const sessionTimestamp = document.getElementById("session-timestamp");

// DOM Elements - Tabs
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanes = document.querySelectorAll(".tab-pane");

// DOM Elements - Products
const productsGrid = document.getElementById("products-grid");
const productsEmptyState = document.getElementById("products-empty-state");
const productSearchInput = document.getElementById("product-search-input");
const categoryFilter = document.getElementById("category-filter");
const productCountBadge = document.getElementById("product-count-badge");
const statTotalProducts = document.getElementById("stat-total-products");
const summaryTotalProducts = document.getElementById("summary-total-products");
const summaryInStock = document.getElementById("summary-in-stock");
const summaryLowStock = document.getElementById("summary-low-stock");

// DOM Elements - Add Product Modal
const openAddProductBtn = document.getElementById("open-add-product-btn");
const addProductModal = document.getElementById("add-product-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const cancelModalBtn = document.getElementById("cancel-modal-btn");
const addProductForm = document.getElementById("add-product-form");
const quickViewProductsBtn = document.getElementById("quick-view-products-btn");
const quickAddProductBtn = document.getElementById("quick-add-product-btn");

let sessionInterval = null;

// ====================
// INITIALIZATION
// ====================
document.addEventListener("DOMContentLoaded", () => {
  initEventListeners();
  loadSavedProducts();
  checkExistingSession();
});

function initEventListeners() {
  // Auth Listeners
  loginForm.addEventListener("submit", handleLogin);
  logoutBtn.addEventListener("click", handleLogout);
  
  togglePasswordBtn.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    togglePasswordBtn.textContent = isPassword ? "🙈" : "👁️";
  });

  usernameInput.addEventListener("input", hideError);
  passwordInput.addEventListener("input", hideError);

  // Tab Switching Listeners
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTabId = btn.getAttribute("data-tab");
      switchTab(targetTabId);
      
      // Render reports when reports tab is clicked
      if (targetTabId === "tab-reports") {
        setTimeout(() => {
          renderAllReports();
        }, 50);
      }
    });
  });

  // Quick Action Buttons on Overview
  if (quickViewProductsBtn) {
    quickViewProductsBtn.addEventListener("click", () => switchTab("tab-products"));
  }
  if (quickAddProductBtn) {
    quickAddProductBtn.addEventListener("click", () => {
      switchTab("tab-products");
      openModal();
    });
  }

  // Products Search & Filter Listeners
  if (productSearchInput) {
    productSearchInput.addEventListener("input", filterAndRenderProducts);
  }
  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterAndRenderProducts);
  }

  // Modal Listeners
  if (openAddProductBtn) {
    openAddProductBtn.addEventListener("click", openModal);
  }
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }
  if (cancelModalBtn) {
    cancelModalBtn.addEventListener("click", closeModal);
  }
  if (addProductModal) {
    addProductModal.addEventListener("click", (e) => {
      if (e.target === addProductModal) closeModal();
    });
  }
  if (addProductForm) {
    addProductForm.addEventListener("submit", handleAddProduct);
  }
}

// ====================
// AUTHENTICATION LOGIC
// ====================
function checkExistingSession() {
  const session = getSession();
  if (session) {
    showDashboard(session);
  } else {
    showLogin();
  }
}

function handleLogin(e) {
  e.preventDefault();
  
  const username = usernameInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (!username || !password) {
    showError("Please enter both username and password.");
    return;
  }

  const user = VALID_USERS[username];

  if (user && user.password === password) {
    const sessionData = {
      username: username,
      name: user.name,
      role: user.role,
      loginTime: Date.now()
    };
    saveSession(sessionData);
    showDashboard(sessionData);
  } else {
    showError("Invalid username or password. Use demo: admin / admin123");
  }
}

function handleLogout() {
  clearSession();
  loginForm.reset();
  hideError();
  showLogin();
}

function showDashboard(session) {
  loginView.classList.add("hidden");
  dashboardView.classList.remove("hidden");

  dashboardUsername.textContent = session.name;
  welcomeUserName.textContent = session.name;
  userRole.textContent = session.role;
  navAvatar.textContent = session.name.charAt(0).toUpperCase();

  const loginDate = new Date(session.loginTime);
  sessionTimestamp.textContent = `Logged in: ${loginDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

  startSessionCounter(session.loginTime);

  // Initialize tabs & products view
  switchTab("tab-overview");
  renderProducts(products);
}

function showLogin() {
  stopSessionCounter();
  dashboardView.classList.add("hidden");
  loginView.classList.remove("hidden");
  usernameInput.focus();
}

function showError(message) {
  errorMessage.textContent = message;
  errorBanner.classList.remove("hidden");
}

function hideError() {
  if (!errorBanner.classList.contains("hidden")) {
    errorBanner.classList.add("hidden");
  }
}

function saveSession(data) {
  sessionStorage.setItem("user_session", JSON.stringify(data));
}

function getSession() {
  try {
    const raw = sessionStorage.getItem("user_session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearSession() {
  sessionStorage.removeItem("user_session");
}

function startSessionCounter(startTime) {
  stopSessionCounter();
  
  const updateTimer = () => {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    sessionCounter.textContent = `${mins}m ${secs}s`;
  };

  updateTimer();
  sessionInterval = setInterval(updateTimer, 1000);
}

function stopSessionCounter() {
  if (sessionInterval) {
    clearInterval(sessionInterval);
    sessionInterval = null;
  }
}

// ====================
// TAB NAVIGATION
// ====================
function switchTab(targetTabId) {
  tabButtons.forEach((btn) => {
    const isTarget = btn.getAttribute("data-tab") === targetTabId;
    btn.classList.toggle("active", isTarget);
    btn.setAttribute("aria-selected", isTarget ? "true" : "false");
  });

  tabPanes.forEach((pane) => {
    if (pane.id === targetTabId) {
      pane.classList.remove("hidden");
    } else {
      pane.classList.add("hidden");
    }
  });
}

// ====================
// PRODUCTS CONTROLLER
// ====================
function getCategoryIcon(category) {
  switch (category) {
    case "Electronics": return "🖥️";
    case "Accessories": return "🎧";
    case "Software": return "☁️";
    case "Office": return "💡";
    default: return "📦";
  }
}

function getStatusClass(status) {
  if (status === "In Stock") return "stock-in";
  if (status === "Low Stock") return "stock-low";
  return "stock-out";
}

function renderProducts(itemsToRender) {
  if (!productsGrid) return;
  productsGrid.innerHTML = "";

  if (itemsToRender.length === 0) {
    productsEmptyState.classList.remove("hidden");
    productsGrid.classList.add("hidden");
  } else {
    productsEmptyState.classList.add("hidden");
    productsGrid.classList.remove("hidden");

    itemsToRender.forEach((prod) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div>
          <div class="product-card-top">
            <div class="product-icon-wrap">${prod.icon || getCategoryIcon(prod.category)}</div>
            <span class="stock-badge ${getStatusClass(prod.status)}">${prod.status}</span>
          </div>
          <span class="product-category-tag">${escapeHtml(prod.category)}</span>
          <h3 class="product-name">${escapeHtml(prod.name)}</h3>
        </div>
        <div class="product-card-bottom">
          <div>
            <div class="product-price">$${Number(prod.price).toFixed(2)}</div>
            <span class="product-stock-qty">${prod.stock} units available</span>
          </div>
          <div class="product-actions">
            <button class="btn-delete-product" title="Delete Product" onclick="deleteProduct('${prod.id}')">
              🗑️
            </button>
          </div>
        </div>
      `;
      productsGrid.appendChild(card);
    });
  }

  updateMetrics();
}

function filterAndRenderProducts() {
  const query = (productSearchInput ? productSearchInput.value : "").trim().toLowerCase();
  const selectedCategory = categoryFilter ? categoryFilter.value : "all";

  const filtered = products.filter((p) => {
    const matchesQuery = p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  renderProducts(filtered);
}

function updateMetrics() {
  const total = products.length;
  const inStock = products.filter((p) => p.status === "In Stock").length;
  const lowOrOut = products.filter((p) => p.status === "Low Stock" || p.status === "Out of Stock").length;

  if (productCountBadge) productCountBadge.textContent = total;
  if (statTotalProducts) statTotalProducts.textContent = total;
  if (summaryTotalProducts) summaryTotalProducts.textContent = total;
  if (summaryInStock) summaryInStock.textContent = inStock;
  if (summaryLowStock) summaryLowStock.textContent = lowOrOut;
}

function handleAddProduct(e) {
  e.preventDefault();

  const nameInput = document.getElementById("prod-name");
  const catInput = document.getElementById("prod-category");
  const priceInput = document.getElementById("prod-price");
  const stockInput = document.getElementById("prod-stock");
  const statusInput = document.getElementById("prod-status");

  const newProduct = {
    id: "prod-" + Date.now(),
    name: nameInput.value.trim(),
    category: catInput.value,
    price: parseFloat(priceInput.value),
    stock: parseInt(stockInput.value, 10),
    status: statusInput.value,
    icon: getCategoryIcon(catInput.value)
  };

  products.unshift(newProduct);
  saveProducts();
  closeModal();

  if (productSearchInput) productSearchInput.value = "";
  if (categoryFilter) categoryFilter.value = "all";

  filterAndRenderProducts();
}

window.deleteProduct = function (id) {
  if (confirm("Are you sure you want to delete this product?")) {
    products = products.filter((p) => p.id !== id);
    saveProducts();
    filterAndRenderProducts();
  }
};

function openModal() {
  if (addProductForm) addProductForm.reset();
  if (addProductModal) addProductModal.classList.remove("hidden");
  const firstInput = document.getElementById("prod-name");
  if (firstInput) firstInput.focus();
}

function closeModal() {
  if (addProductModal) addProductModal.classList.add("hidden");
}

function saveProducts() {
  try {
    localStorage.setItem("user_products", JSON.stringify(products));
  } catch (err) {
    console.error("Failed to save products to localStorage:", err);
  }
}

function loadSavedProducts() {
  try {
    const saved = localStorage.getItem("user_products");
    if (saved) {
      products = JSON.parse(saved);
    }
  } catch (err) {
    console.error("Failed to load products from localStorage:", err);
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ====================
// REPORTS CONTROLLER
// ====================

// DOM Elements - Reports
const salesTableBody = document.getElementById("sales-table-body");
const totalSalesValue = document.getElementById("total-sales-value");
const topProductName = document.getElementById("top-product-name");
const totalRevenueValue = document.getElementById("total-revenue-value");
const avgOrderValue = document.getElementById("avg-order-value");
const priceRange = document.getElementById("price-range");
const plRevenue = document.getElementById("pl-revenue");
const plExpenses = document.getElementById("pl-expenses");
const plProfit = document.getElementById("pl-profit");
const plMargin = document.getElementById("pl-margin");

function calculateSalesMetrics() {
  if (products.length === 0) {
    return {
      totalUnits: 0,
      topProduct: null,
      salesByProduct: []
    };
  }

  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const topProduct = products.reduce((max, p) => 
    p.stock > (max?.stock || 0) ? p : max
  );

  const salesByProduct = products
    .sort((a, b) => b.stock - a.stock)
    .map(p => ({
      name: p.name,
      category: p.category,
      stock: p.stock,
      price: p.price,
      value: p.stock * p.price
    }));

  return {
    totalUnits,
    topProduct: topProduct.name,
    salesByProduct
  };
}

function calculateRevenueMetrics() {
  if (products.length === 0) {
    return {
      totalRevenue: 0,
      avgOrderValue: 0,
      minPrice: 0,
      maxPrice: 0
    };
  }

  const totalRevenue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
  const avgOrderValue = products.reduce((sum, p) => sum + p.price, 0) / products.length;
  const prices = products.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return {
    totalRevenue,
    avgOrderValue,
    minPrice,
    maxPrice
  };
}

function calculateProfitLoss() {
  const { totalRevenue } = calculateRevenueMetrics();
  const operatingCostPercentage = 0.20; // 20% operating costs
  const expenses = totalRevenue * operatingCostPercentage;
  const profit = totalRevenue - expenses;
  const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  return {
    revenue: totalRevenue,
    expenses,
    profit,
    margin
  };
}

function renderSalesReport() {
  const metrics = calculateSalesMetrics();

  // Update top level metrics
  if (totalSalesValue) {
    totalSalesValue.textContent = metrics.totalUnits.toLocaleString();
  }
  if (topProductName) {
    topProductName.textContent = metrics.topProduct || "—";
  }

  // Render sales table
  if (salesTableBody) {
    salesTableBody.innerHTML = "";

    if (metrics.salesByProduct.length > 0) {
      metrics.salesByProduct.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${escapeHtml(item.name)}</td>
          <td><span class="table-category">${escapeHtml(item.category)}</span></td>
          <td>${item.stock}</td>
          <td><span class="table-price">$${item.price.toFixed(2)}</span></td>
          <td><span class="table-value">$${item.value.toFixed(2)}</span></td>
        `;
        salesTableBody.appendChild(row);
      });
    } else {
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = `<td colspan="5" style="text-align: center; padding: 20px; color: var(--text-muted);">No products available</td>`;
      salesTableBody.appendChild(emptyRow);
    }
  }
}

function renderRevenueReport() {
  const metrics = calculateRevenueMetrics();

  if (totalRevenueValue) {
    totalRevenueValue.textContent = `$${metrics.totalRevenue.toFixed(2)}`;
  }

  if (avgOrderValue) {
    avgOrderValue.textContent = `$${metrics.avgOrderValue.toFixed(2)}`;
  }

  if (priceRange) {
    priceRange.textContent = `$${metrics.minPrice.toFixed(0)} - $${metrics.maxPrice.toFixed(2)}`;
  }
}

function renderProfitLossReport() {
  const pl = calculateProfitLoss();

  if (plRevenue) {
    plRevenue.textContent = `$${pl.revenue.toFixed(2)}`;
  }

  if (plExpenses) {
    plExpenses.textContent = `$${pl.expenses.toFixed(2)}`;
  }

  if (plProfit) {
    plProfit.textContent = `$${pl.profit.toFixed(2)}`;
  }

  if (plMargin) {
    plMargin.textContent = `${pl.margin.toFixed(1)}%`;
  }
}

function renderAllReports() {
  renderSalesReport();
  renderRevenueReport();
  renderProfitLossReport();
}
