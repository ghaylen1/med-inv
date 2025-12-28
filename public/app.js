/* =============================================
   MEDICAL INVENTORY - JAVASCRIPT
   Club Ambassadeurs VESOS
   ============================================= */

// API URL
const API_URL = '/.netlify/functions/products';

// State
let products = [];
let filteredProducts = [];
let currentFilter = 'all';
let searchQuery = '';
let currentProductId = null;

// =============================================
// INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', init);

function init() {
    loadProducts();
    setupEventListeners();
    initTheme();
}

// =============================================
// API FUNCTIONS
// =============================================
async function loadProducts() {
    showLoading(true);
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (data.success) {
            products = data.products;
            applyFilters();
            updateStats();
        } else {
            toast('Erreur de chargement', 'error');
        }
    } catch (err) {
        console.error(err);
        toast('Erreur de connexion', 'error');
    } finally {
        showLoading(false);
    }
}

async function createProduct(data) {
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) {
            products.push(result.product);
            applyFilters();
            updateStats();
            toast('Produit ajouté', 'success');
            return true;
        }
        toast(result.error || 'Erreur', 'error');
        return false;
    } catch (err) {
        toast('Erreur de connexion', 'error');
        return false;
    }
}

async function updateProduct(id, data) {
    try {
        const res = await fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...data })
        });
        const result = await res.json();
        if (result.success) {
            const idx = products.findIndex(p => p.id === id);
            if (idx !== -1) products[idx] = result.product;
            applyFilters();
            updateStats();
            toast('Produit mis à jour', 'success');
            return true;
        }
        toast(result.error || 'Erreur', 'error');
        return false;
    } catch (err) {
        toast('Erreur de connexion', 'error');
        return false;
    }
}

async function deleteProduct(id) {
    try {
        const res = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
            products = products.filter(p => p.id !== id);
            applyFilters();
            updateStats();
            toast('Produit supprimé', 'success');
            return true;
        }
        toast(result.error || 'Erreur', 'error');
        return false;
    } catch (err) {
        toast('Erreur de connexion', 'error');
        return false;
    }
}

// =============================================
// UI FUNCTIONS
// =============================================
function showLoading(show) {
    document.getElementById('loading').classList.toggle('active', show);
    document.getElementById('productsGrid').style.display = show ? 'none' : 'grid';
}

function applyFilters() {
    filteredProducts = products.filter(p => {
        const matchesFilter = currentFilter === 'all' || p.category === currentFilter;
        const matchesSearch = !searchQuery || 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.partner && p.partner.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });
    renderProducts();
    updateProductCount();
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const empty = document.getElementById('emptyState');
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = '';
        empty.classList.add('active');
        return;
    }
    
    empty.classList.remove('active');
    
    grid.innerHTML = filteredProducts.map((p, i) => `
        <div class="product-card" style="animation-delay: ${i * 0.05}s">
            <div class="card-header">
                <span class="category-badge ${p.category}">${getCategoryLabel(p.category)}</span>
                <span class="stock-badge ${getStockClass(p.quantity)}">
                    <span class="dot"></span>
                    ${getStockLabel(p.quantity)}
                </span>
            </div>
            <div class="card-body">
                <h3 class="product-name">${p.name}</h3>
                <div class="product-meta">
                    ${p.unit ? `<span class="meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>${p.unit}</span>` : ''}
                    ${p.brand ? `<span class="meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>${p.brand}</span>` : ''}
                </div>
                ${p.partner ? `<div class="product-partner"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>${p.partner}</div>` : ''}
            </div>
            <div class="card-footer">
                <div class="quantity-display">
                    <span class="quantity-value">${p.quantity}</span>
                    <span class="quantity-unit">unités</span>
                </div>
                <div class="card-actions">
                    <button class="action-btn" onclick="openDetailModal(${p.id})" title="Voir détails">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </button>
                    <button class="action-btn" onclick="openQtyModal(${p.id})" title="Modifier quantité">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    const total = products.length;
    const inStock = products.filter(p => p.quantity > 5).length;
    const low = products.filter(p => p.quantity > 0 && p.quantity <= 5).length;
    const out = products.filter(p => p.quantity === 0).length;
    
    animateValue('statTotal', total);
    animateValue('statInStock', inStock);
    animateValue('statLow', low);
    animateValue('statOut', out);
}

function animateValue(id, value) {
    const el = document.getElementById(id);
    const start = parseInt(el.textContent) || 0;
    const duration = 500;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.round(start + (value - start) * easeOutCubic(progress));
        el.textContent = current;
        if (progress < 1) requestAnimationFrame(update);
    }
    
    requestAnimationFrame(update);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function updateProductCount() {
    document.getElementById('productCount').textContent = 
        `${filteredProducts.length} produit${filteredProducts.length !== 1 ? 's' : ''}`;
}

// =============================================
// HELPERS
// =============================================
function getCategoryLabel(cat) {
    const labels = { medical: 'Médical', hygiene: 'Hygiène', logistics: 'Logistique' };
    return labels[cat] || cat;
}

function getCategoryIcon(cat) {
    const icons = {
        medical: '<path d="M12 4v16m8-8H4"/>',
        hygiene: '<path d="M12 21.5c-3.5 0-6.5-2.5-6.5-6.5 0-4.5 6.5-11 6.5-11s6.5 6.5 6.5 11c0 4-3 6.5-6.5 6.5z"/>',
        logistics: '<path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>'
    };
    return icons[cat] || '<circle cx="12" cy="12" r="10"/>';
}

function getStockClass(qty) {
    if (qty === 0) return 'out-stock';
    if (qty <= 5) return 'low-stock';
    return 'in-stock';
}

function getStockLabel(qty) {
    if (qty === 0) return 'Rupture';
    if (qty <= 5) return 'Stock faible';
    return 'En stock';
}

// =============================================
// MODALS
// =============================================
function openModal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow = '';
}

function openDetailModal(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    
    currentProductId = id;
    
    document.getElementById('detailHeader').innerHTML = `
        <div class="detail-icon ${p.category}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${getCategoryIcon(p.category)}</svg>
        </div>
        <h2 class="detail-name">${p.name}</h2>
        <span class="stock-badge ${getStockClass(p.quantity)}">
            <span class="dot"></span>
            ${getStockLabel(p.quantity)}
        </span>
    `;
    
    document.getElementById('detailContent').innerHTML = `
        <div class="detail-row"><span class="detail-label">Catégorie</span><span class="detail-value">${getCategoryLabel(p.category)}</span></div>
        <div class="detail-row"><span class="detail-label">Quantité</span><span class="detail-value">${p.quantity} unités</span></div>
        ${p.unit ? `<div class="detail-row"><span class="detail-label">Unité</span><span class="detail-value">${p.unit}</span></div>` : ''}
        ${p.type ? `<div class="detail-row"><span class="detail-label">Type</span><span class="detail-value">${p.type}</span></div>` : ''}
        ${p.brand ? `<div class="detail-row"><span class="detail-label">Marque</span><span class="detail-value">${p.brand}</span></div>` : ''}
        ${p.partner ? `<div class="detail-row"><span class="detail-label">Partenaire</span><span class="detail-value">${p.partner}</span></div>` : ''}
        ${p.remarks ? `<div class="detail-row"><span class="detail-label">Remarques</span><span class="detail-value">${p.remarks}</span></div>` : ''}
    `;
    
    openModal('detailModal');
}

function openFormModal(product = null) {
    document.getElementById('formTitle').textContent = product ? 'Modifier le produit' : 'Ajouter un produit';
    document.getElementById('formId').value = product ? product.id : '';
    document.getElementById('formName').value = product ? product.name : '';
    document.getElementById('formCategory').value = product ? product.category : 'medical';
    document.getElementById('formQuantity').value = product ? product.quantity : 0;
    document.getElementById('formUnit').value = product?.unit || '';
    document.getElementById('formBrand').value = product?.brand || '';
    document.getElementById('formType').value = product?.type || '';
    document.getElementById('formPartner').value = product?.partner || '';
    document.getElementById('formRemarks').value = product?.remarks || '';
    
    openModal('formModal');
}

function openQtyModal(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    
    currentProductId = id;
    document.getElementById('qtyName').textContent = p.name;
    document.getElementById('qtyInput').value = p.quantity;
    openModal('qtyModal');
}

// =============================================
// EVENT LISTENERS
// =============================================
function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        clearBtn.classList.toggle('visible', searchQuery.length > 0);
        applyFilters();
    });
    
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearBtn.classList.remove('visible');
        applyFilters();
    });
    
    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            applyFilters();
        });
    });
    
    // Header buttons
    document.getElementById('addProductBtn').addEventListener('click', () => openFormModal());
    document.getElementById('exportBtn').addEventListener('click', exportCSV);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Modal close buttons
    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.dataset.close));
    });
    
    // Modal overlays
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal(overlay.id);
        });
    });
    
    // Detail modal buttons
    document.getElementById('btnEdit').addEventListener('click', () => {
        closeModal('detailModal');
        const p = products.find(x => x.id === currentProductId);
        openFormModal(p);
    });
    
    document.getElementById('btnDelete').addEventListener('click', async () => {
        if (confirm('Supprimer ce produit ?')) {
            await deleteProduct(currentProductId);
            closeModal('detailModal');
        }
    });
    
    // Form submit
    document.getElementById('formSubmit').addEventListener('click', async () => {
        const form = document.getElementById('productForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const data = {
            name: document.getElementById('formName').value.trim(),
            category: document.getElementById('formCategory').value,
            quantity: parseInt(document.getElementById('formQuantity').value) || 0,
            unit: document.getElementById('formUnit').value.trim() || null,
            brand: document.getElementById('formBrand').value.trim() || null,
            type: document.getElementById('formType').value.trim() || null,
            partner: document.getElementById('formPartner').value.trim() || null,
            remarks: document.getElementById('formRemarks').value.trim() || null
        };
        
        const id = document.getElementById('formId').value;
        const success = id ? await updateProduct(parseInt(id), data) : await createProduct(data);
        
        if (success) closeModal('formModal');
    });
    
    // Quantity modal
    document.getElementById('qtyMinus').addEventListener('click', () => {
        const input = document.getElementById('qtyInput');
        input.value = Math.max(0, parseInt(input.value) - 1);
    });
    
    document.getElementById('qtyPlus').addEventListener('click', () => {
        const input = document.getElementById('qtyInput');
        input.value = parseInt(input.value) + 1;
    });
    
    document.getElementById('qtySave').addEventListener('click', async () => {
        const qty = parseInt(document.getElementById('qtyInput').value) || 0;
        const success = await updateProduct(currentProductId, { quantity: qty });
        if (success) closeModal('qtyModal');
    });
    
    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
        }
    });
}

// =============================================
// THEME
// =============================================
function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// =============================================
// EXPORT
// =============================================
function exportCSV() {
    const headers = ['ID', 'Nom', 'Catégorie', 'Quantité', 'Unité', 'Type', 'Marque', 'Partenaire', 'Remarques'];
    const rows = filteredProducts.map(p => [
        p.id, p.name, getCategoryLabel(p.category), p.quantity,
        p.unit || '', p.type || '', p.brand || '', p.partner || '', p.remarks || ''
    ]);
    
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventaire_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast('Export réussi', 'success');
}

// =============================================
// TOAST NOTIFICATIONS
// =============================================
function toast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const icons = {
        success: '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
        error: '<path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
        warning: '<path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>',
        info: '<path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    };
    
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icons[type]}</svg>
        <span>${message}</span>
        <button class="toast-close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
    `;
    
    el.querySelector('.toast-close').addEventListener('click', () => removeToast(el));
    container.appendChild(el);
    
    setTimeout(() => removeToast(el), 4000);
}

function removeToast(el) {
    if (!el.parentNode) return;
    el.classList.add('removing');
    setTimeout(() => el.remove(), 300);
}
