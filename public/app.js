/* =============================================
   MEDICAL INVENTORY STORE - JAVASCRIPT
   Club Ambassadeurs VESOS
   With Icon Customization Guide
   ============================================= */
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
    import { getDatabase, ref, set, get, onValue, update } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

    // ⚠️ REPLACE WITH YOUR FIREBASE CONFIG
    // Get this from Firebase Console > Project Settings > Your Apps

  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBWx4Vpy5HtZA18XF0mm6l-KvvujzINo2I",
    authDomain: "med-inv-sos.firebaseapp.com",
    databaseURL: "https://med-inv-sos-default-rtdb.firebaseio.com",
    projectId: "med-inv-sos",
    storageBucket: "med-inv-sos.firebasestorage.app",
    messagingSenderId: "85885489518",
    appId: "1:85885489518:web:adde2872cba63b8cbd717f"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);


    // Initialize Firebase
    let app, database;
    let productsData = {};

    try {
        app = initializeApp(firebaseConfig);
        database = getDatabase(app);
        document.getElementById('firebase-status').textContent = '✓ Connecté à la base de données';
        loadProducts();
    } catch (error) {
        document.getElementById('firebase-status').textContent = '⚠️ Configuration Firebase requise';
        document.getElementById('loading').innerHTML = `
            <h3>Configuration Required</h3>
            <p>Please add your Firebase configuration to the code.</p>
            <p style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
                1. Create a Firebase project at <a href="https://console.firebase.google.com" target="_blank">console.firebase.google.com</a><br>
                2. Enable Realtime Database<br>
                3. Copy your config and paste it in the code
            </p>
        `;
    }


/* =============================================
   HOW TO CHANGE PRODUCT ICONS
   =============================================
   
   Each product category has its own icon shown when
   there's no product image. To change these icons:
   
   1. Find the getCategoryIcon() function below
   2. Replace the SVG path with your desired icon
   
   Where to get SVG icons:
   - https://heroicons.com (copy the path data)
   - https://feathericons.com
   - https://iconoir.com
   - https://lucide.dev
   
   Example: To change the medication icon to a pill:
   
   case 'medication':
       return '<path d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/>';
   
   ============================================= */


// ============================================
// SECTION 1: CATEGORY ICONS
// Change the SVG paths here to customize icons
// ============================================

function getCategoryIcon(category) {
    switch(category) {
        // 💊 MEDICATION ICON - Pill capsule
        case 'medication':
            return '<path d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/>';
        
        // 🏥 MEDICAL EQUIPMENT ICON - First Aid Cross
        case 'medical':
            return '<path d="M12 4v16m8-8H4"/>';
        
        // 🧴 HYGIENE ICON - Droplet/Clean
        case 'hygiene':
            return '<path d="M12 21.5c-3.5 0-6.5-2.5-6.5-6.5 0-4.5 6.5-11 6.5-11s6.5 6.5 6.5 11c0 4-3 6.5-6.5 6.5z"/>';
        
        // 📦 LOGISTICS ICON - Box/Package
        case 'logistics':
            return '<path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>';
        
        // Default circle icon
        default:
            return '<circle cx="12" cy="12" r="10"/>';
    }
}


// ============================================
// SECTION 2: PRODUCT DATA
// Add/modify products here
// To add product images, set the 'image' field
// ============================================

const products = [
    // ===========================================
    // MEDICATIONS (131 items from Excel)
    // ===========================================
    
    // ===========================================
    // MEDICAL EQUIPMENT, HYGIENE & LOGISTICS (48 items)
    // ===========================================
    { id: 1, name: "Coton Hydrophile", unit: "25g", quantity: 4, type: "Matériel medical", category: "medical", partner: null, remarks: null, brand: "BANDLUX" },
    { id: 2, name: "couches bébé", unit: null, quantity: 16, type: "Matériel medical", category: "medical", partner: "Para Moon", remarks: null, brand: "Best Baby" },
    { id: 3, name: "lingette", unit: "1 paquet", quantity: 72, type: "Matériel medical", category: "medical", partner: "Para Moon", remarks: null, brand: "Baby pure" },
    { id: 4, name: "pansement prédécoupées", unit: null, quantity: 3, type: "Matériel medical", category: "medical", partner: "Para Moon", remarks: null, brand: "MegaPlast" },
    { id: 5, name: "pansement à découpé", unit: null, quantity: 1, type: "Matériel medical", category: "medical", partner: "Para Moon", remarks: null, brand: "MegaPlast" },
    { id: 6, name: "gants", unit: "1 paquet", quantity: 100, type: "Matériel medical", category: "medical", partner: "Para Moon", remarks: null, brand: "SkinG" },
    { id: 7, name: "masque", unit: "1 paquet", quantity: 50, type: "Matériel medical", category: "medical", partner: "Para Moon", remarks: null, brand: "Face Mask" },
    { id: 8, name: "bandages", unit: "1 sac", quantity: 12, type: "Matériel medical", category: "medical", partner: "Para Moon", remarks: null },
    { id: 9, name: "compresses stérile (petit format)", unit: "5 paquets", quantity: 100, type: "Matériel medical", category: "medical", partner: "Para Moon", remarks: null, brand: "Megacomp" },
    { id: 10, name: "abaisse langue", unit: "5 paquets", quantity: 500, type: "Matériel medical", category: "medical", partner: "Para Moon", remarks: null, brand: "medhave" },
    { id: 11, name: "bandelettes glycémie", unit: "1 paquet", quantity: 100, type: "Matériel medical", category: "medical", partner: "Para Moon", remarks: null, brand: "Bionime" },
    { id: 12, name: "thermométres", unit: null, quantity: 2, type: "Matériel medical", category: "medical", partner: "Para Moon", remarks: null, brand: "Accutherm" },
    { id: 13, name: "déambulateur", unit: null, quantity: 1, type: "Matériel medical", category: "medical", partner: "As para", remarks: null },
    { id: 14, name: "Cake", unit: "1 paquet", quantity: 50, type: "Matériel logistics", category: "logistics", partner: null, remarks: null, brand: "TOM" },
    { id: 15, name: "Jus", unit: "30*125 cl", quantity: 30, type: "Matériel logistics", category: "logistics", partner: null, remarks: null, brand: "JUGO KIDS" },
    { id: 16, name: "couches bébé", unit: "5", quantity: 0, type: "Matériel hygiene", category: "hygiene", partner: "médical Santé Service", remarks: "taille 4", brand: "Giggle" },
    { id: 17, name: "couches bébé", unit: "12", quantity: 0, type: "Matériel hygiene", category: "hygiene", partner: "médical Santé Service", remarks: "taille 1", brand: "LILAS CONFORT MAX ACTIF" },
    { id: 18, name: "couches bébé", unit: "5", quantity: 0, type: "Matériel hygiene", category: "hygiene", partner: "médical Santé Service", remarks: "taille 4", brand: "LILAS CONFORT MAX ACTIF" },
    { id: 19, name: "gel hydralcolique", unit: "125ml", quantity: 50, type: "Matériel hygiene", category: "hygiene", partner: "médical Santé Service", remarks: null, brand: "young health antivirus +" },
    { id: 20, name: "tensiométre", unit: "hm60", quantity: 1, type: "Matériel medical", category: "medical", partner: "médical Santé Service", remarks: "poignet viscor hm60", brand: "viscor" },
    { id: 21, name: "lingette", unit: "24 paquet", quantity: 72, type: "Matériel hygiene", category: "hygiene", partner: "médical Santé Service", remarks: null, brand: "Babirose" },
    { id: 22, name: "bandages", unit: "N,C 5 CM *3 M", quantity: 100, type: "Matériel medical", category: "medical", partner: "médical Santé Service", remarks: null, brand: "BANDLUX" },
    { id: 23, name: "Bandages", unit: "10 cm *3M", quantity: 24, type: "Matériel medical", category: "medical", partner: "médical Santé Service", remarks: null, brand: "baNDLUX" },
    { id: 24, name: "GLUCOMETRE", unit: "GM 550", quantity: 1, type: "Matériel medical", category: "medical", partner: "médical Santé Service", remarks: "coffret promotionelle", brand: "Bionime" },
    { id: 25, name: "abaisse langue", unit: "3", quantity: 100, type: "Matériel medical", category: "medical", partner: "médical Santé Service", remarks: null },
    { id: 26, name: "couches bébé", unit: "5 paquets", quantity: 0, type: "Matériel hygiene", category: "hygiene", partner: "médical Santé Service", remarks: "taille 5", brand: "LILAS CONFORT MAX ACTIF" },
    { id: 27, name: "couches bébé", unit: "5 paquets", quantity: 0, type: "Matériel hygiene", category: "hygiene", partner: "médical Santé Service", remarks: "taille 3", brand: "LILAS CONFORT MAX ACTIF" },
    { id: 28, name: "couches bébé", unit: "4 paquets", quantity: 0, type: "Matériel hygiene", category: "hygiene", partner: "médical Santé Service", remarks: "taille 6", brand: "Giggle" },
    { id: 29, name: "couches bébé", unit: "2 paquets", quantity: 0, type: "Matériel hygiene", category: "hygiene", partner: "médical Santé Service", remarks: "taille 5", brand: "Giggle" },
    { id: 30, name: "couches bébé", unit: "5 paquets", quantity: 0, type: "Matériel hygiene", category: "hygiene", partner: "médical Santé Service", remarks: "taille 3", brand: "Giggle" },
    { id: 31, name: "glucomètre", unit: null, quantity: 1, type: "Matériel medical", category: "medical", partner: null, remarks: "+50 bandelette +10 LANCETs", brand: "accu-check" },
    { id: 32, name: "glucomètre", unit: null, quantity: 1, type: "Matériel medical", category: "medical", partner: null, remarks: "+7 bandelette +10 LANCETs", brand: "on call plus" },
    { id: 33, name: "glucomètre", unit: null, quantity: 1, type: "Matériel medical", category: "medical", partner: null, remarks: "+100 banelettes", brand: "on call vivid" },
    { id: 34, name: "thermométres", unit: null, quantity: 1, type: "Matériel medical", category: "medical", partner: "HERMES", remarks: null, brand: "THERMOPLUS" },
    { id: 35, name: "tensiométre", unit: null, quantity: 1, type: "Matériel medical", category: "medical", partner: null, remarks: null },
    { id: 36, name: "compresses non stériles", unit: null, quantity: 100, type: "Matériel medical", category: "medical", partner: null, remarks: null },
    { id: 37, name: "masque", unit: "1 paquet", quantity: 50, type: "Matériel medical", category: "medical", partner: null, remarks: null },
    { id: 38, name: "cake", unit: "3 paquets", quantity: 108, type: "Matériel logistics", category: "logistics", partner: null, remarks: null, brand: "SAIDA" },
    { id: 39, name: "jus", unit: "2 paquets", quantity: 12, type: "Matériel logistics", category: "logistics", partner: null, remarks: null, brand: "TROPICO" },
    { id: 40, name: "masque", unit: "2", quantity: 50, type: "Matériel medical", category: "medical", partner: null, remarks: null, brand: "BAIY ERKANG" },
    { id: 41, name: "COMPRESSES CHIRURGICALES", unit: "1", quantity: 100, type: "Matériel medical", category: "medical", partner: null, remarks: null, brand: "MEGA" },
    { id: 42, name: "masque", unit: "1", quantity: 40, type: "Matériel medical", category: "medical", partner: null, remarks: null },
    { id: 43, name: "glucomètre", unit: null, quantity: 2, type: "Matériel medical", category: "medical", partner: "HERMES", remarks: "+20 bandelette +35 LANCETs", brand: "on call plus" },
    { id: 44, name: "cotton", unit: "500g", quantity: 0, type: "Matériel medical", category: "medical", partner: "médical Santé Service", remarks: null, brand: "bandLUX" },
    { id: 45, name: "lancets", unit: null, quantity: 0, type: "Matériel medical", category: "medical", partner: "taha", remarks: "72 piéces", brand: "accu-check" },
    { id: 46, name: "lancets", unit: null, quantity: 0, type: "Matériel medical", category: "medical", partner: "taha", remarks: "200 lancets", brand: "microlet" },
    { id: 47, name: "perfuseur", unit: null, quantity: 2, type: "Matériel medical", category: "medical", partner: "taha", remarks: null, brand: "inflow set" },
    { id: 48, name: "seringue", unit: null, quantity: 2, type: "Matériel medical", category: "medical", partner: "taha", remarks: null },
];

// ============================================
// SECTION 3: APPLICATION STATE
// ============================================

let currentFilter = 'all';
let currentCategory = 'all';
let searchTerm = '';
let selectedProduct = null;


// ============================================
// SECTION 4: INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateStats();
    renderProducts();
    setupEventListeners();
    createModal();
    createNotificationContainer();
});


// ============================================
// SECTION 5: DARK MODE
// ============================================

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    showNotification(
        newTheme === 'dark' ? 'Mode Sombre Activé' : 'Mode Clair Activé',
        `L'interface est maintenant en mode ${newTheme === 'dark' ? 'sombre' : 'clair'}`,
        'info'
    );
}


// ============================================
// SECTION 6: STATISTICS
// ============================================

function updateStats() {
    const total = products.length;
    const inStock = products.filter(p => getStockStatus(p.quantity) === 'in-stock').length;
    const lowStock = products.filter(p => getStockStatus(p.quantity) === 'low-stock').length;
    const outStock = products.filter(p => getStockStatus(p.quantity) === 'out-of-stock').length;

    animateCounter('total-products', total);
    animateCounter('in-stock-count', inStock);
    animateCounter('low-stock-count', lowStock);
    animateCounter('out-stock-count', outStock);

    document.getElementById('filter-all-count').textContent = total;
    document.getElementById('filter-instock-count').textContent = inStock;
    document.getElementById('filter-lowstock-count').textContent = lowStock;
    document.getElementById('filter-outstock-count').textContent = outStock;
}

function animateCounter(elementId, target) {
    const element = document.getElementById(elementId);
    const duration = 1200; // Slower, smoother
    const start = parseInt(element.textContent) || 0;
    const startTime = performance.now();
    
    // Easing function for smooth deceleration
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
    
    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        
        const current = Math.round(start + (target - start) * easedProgress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };
    
    requestAnimationFrame(animate);
}


// ============================================
// SECTION 7: HELPER FUNCTIONS
// ============================================

function getStockStatus(quantity) {
    if (!quantity || quantity === 0) return 'out-of-stock';
    if (quantity <= 3) return 'low-stock';
    return 'in-stock';
}

function getStockLabel(status) {
    switch(status) {
        case 'in-stock': return 'En Stock';
        case 'low-stock': return 'Stock Faible';
        case 'out-of-stock': return 'Rupture';
    }
}

function getCategoryLabel(category) {
    switch(category) {
        case 'medication': return 'Médicament';
        case 'medical': return 'Matériel Médical';
        case 'hygiene': return 'Hygiène';
        case 'logistics': return 'Logistique';
        default: return category;
    }
}


// ============================================
// SECTION 8: FILTERING
// ============================================

function filterProducts() {
    return products.filter(product => {
        const searchMatch = searchTerm === '' || 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.type && product.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (product.partner && product.partner.toLowerCase().includes(searchTerm.toLowerCase()));

        const stockStatus = getStockStatus(product.quantity);
        const stockMatch = currentFilter === 'all' || stockStatus === currentFilter;
        const categoryMatch = currentCategory === 'all' || product.category === currentCategory;

        return searchMatch && stockMatch && categoryMatch;
    });
}


// ============================================
// SECTION 9: RENDERING
// ============================================

function renderProducts() {
    const grid = document.getElementById('products-grid');
    const emptyState = document.getElementById('empty-state');
    const filtered = filterProducts();

    if (filtered.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    emptyState.style.display = 'none';

    grid.innerHTML = filtered.map((product, index) => {
        const stockStatus = getStockStatus(product.quantity);
        const stockLabel = getStockLabel(stockStatus);
        
        return `
            <div class="product-card" data-id="${product.id}" style="transition-delay: ${index * 0.05}s">
                <div class="product-image">
                    <div class="product-image-placeholder">
                        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                            ${getCategoryIcon(product.category)}
                        </svg>
                    </div>
                </div>
                <div class="product-content">
                    <div class="product-header">
                        <span class="product-type ${product.category}">${getCategoryLabel(product.category)}</span>
                        <div class="stock-badge ${stockStatus}">
                            <span class="dot"></span>
                            ${stockLabel}
                        </div>
                    </div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-meta">
                        ${product.unit ? `
                            <div class="meta-item">
                                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                                ${product.unit}
                            </div>
                        ` : ''}
                        ${product.brand ? `
                            <div class="meta-item">
                                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                ${product.brand}
                            </div>
                        ` : ''}
                    </div>
                    ${product.partner ? `
                        <div class="partner-badge">
                            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            ${product.partner}
                        </div>
                    ` : ''}
                    ${product.remarks ? `
                        <div class="remarks ${product.expired ? 'expired' : ''}">
                            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            ${product.remarks}
                        </div>
                    ` : ''}
                    <div class="product-footer">
                        <div class="quantity-display">
                            <span class="quantity-value">${product.quantity || 0}</span>
                            <span class="quantity-unit">unités</span>
                        </div>
                        <div class="product-actions">
                            <button class="action-btn view-btn" title="Voir détails" data-id="${product.id}">
                                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                            </button>
                            <button class="action-btn edit-btn" title="Modifier quantité" data-id="${product.id}">
                                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Animate cards with smooth stagger
    setTimeout(() => {
        document.querySelectorAll('.product-card').forEach((card, index) => {
            setTimeout(() => card.classList.add('visible'), index * 80);
        });
    }, 50);

    // Add click handlers
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openProductModal(parseInt(btn.dataset.id));
        });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            editProductQuantity(parseInt(btn.dataset.id));
        });
    });
}


// ============================================
// SECTION 10: MODAL SYSTEM
// ============================================

function createModal() {
    const modalHTML = `
        <div class="modal-overlay" id="modal-overlay">
            <div class="modal" id="product-modal">
                <div class="modal-header">
                    <h2 id="modal-title">Détails du Produit</h2>
                    <button class="modal-close" id="modal-close">
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body" id="modal-body"></div>
                <div class="modal-footer">
                    <button class="modal-btn modal-btn-secondary" id="modal-close-btn">Fermer</button>
                    <button class="modal-btn modal-btn-primary" id="modal-edit-btn">
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="16" height="16">
                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        Modifier
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') closeModal();
    });
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    document.getElementById('modal-edit-btn').addEventListener('click', () => {
        if (selectedProduct) {
            closeModal();
            editProductQuantity(selectedProduct.id);
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    selectedProduct = product;
    const stockStatus = getStockStatus(product.quantity);
    const stockLabel = getStockLabel(stockStatus);
    
    document.getElementById('modal-title').textContent = product.name;
    
    document.getElementById('modal-body').innerHTML = `
        <div class="modal-image">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                ${getCategoryIcon(product.category)}
            </svg>
        </div>
        <div class="modal-details">
            <div class="detail-row">
                <span class="detail-label">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/></svg>
                    Catégorie
                </span>
                <span class="detail-value">${getCategoryLabel(product.category)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Statut
                </span>
                <span class="detail-value stock-badge ${stockStatus}">
                    <span class="dot"></span>
                    ${stockLabel}
                </span>
            </div>
            <div class="detail-row">
                <span class="detail-label">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    Quantité
                </span>
                <span class="detail-value">${product.quantity || 0} unités</span>
            </div>
            ${product.unit ? `<div class="detail-row"><span class="detail-label">Dosage</span><span class="detail-value">${product.unit}</span></div>` : ''}
            ${product.type ? `<div class="detail-row"><span class="detail-label">Type</span><span class="detail-value">${product.type}</span></div>` : ''}
            ${product.brand ? `<div class="detail-row"><span class="detail-label">Marque</span><span class="detail-value">${product.brand}</span></div>` : ''}
            ${product.partner ? `<div class="detail-row"><span class="detail-label">Partenaire</span><span class="detail-value">${product.partner}</span></div>` : ''}
            ${product.remarks ? `<div class="detail-row"><span class="detail-label">Remarques</span><span class="detail-value">${product.remarks}</span></div>` : ''}
        </div>
    `;
    
    document.getElementById('modal-overlay').classList.add('active');
    showNotification('Produit Consulté', `Affichage de "${product.name}"`, 'info');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    selectedProduct = null;
}


// ============================================
// SECTION 11: EDIT FUNCTIONALITY
// ============================================

function editProductQuantity(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const newQuantity = prompt(`Modifier la quantité de "${product.name}"\nQuantité actuelle: ${product.quantity}\n\nNouvelle quantité:`, product.quantity);
    
    if (newQuantity !== null && !isNaN(newQuantity)) {
        const oldQuantity = product.quantity;
        product.quantity = parseInt(newQuantity);
        
        updateStats();
        renderProducts();
        
        const change = product.quantity - oldQuantity;
        const changeText = change > 0 ? `+${change}` : change;
        
        showNotification(
            'Stock Modifié',
            `"${product.name}" : ${oldQuantity} → ${product.quantity} (${changeText})`,
            change >= 0 ? 'success' : 'warning'
        );
    }
}


// ============================================
// SECTION 12: NOTIFICATIONS
// ============================================

function createNotificationContainer() {
    const container = document.createElement('div');
    container.className = 'notification-container';
    container.id = 'notification-container';
    document.body.appendChild(container);
}

function showNotification(title, message, type = 'info') {
    const container = document.getElementById('notification-container');
    const id = Date.now();
    
    const icons = {
        success: '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
        warning: '<path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>',
        error: '<path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
        info: '<path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    };
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.id = `notification-${id}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">${icons[type]}</svg>
        </div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="dismissNotification(${id})">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div class="notification-progress"></div>
    `;
    
    container.appendChild(notification);
    requestAnimationFrame(() => notification.classList.add('show'));
    setTimeout(() => dismissNotification(id), 4000);
}

function dismissNotification(id) {
    const notification = document.getElementById(`notification-${id}`);
    if (notification) {
        notification.classList.remove('show');
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 400);
    }
}


// ============================================
// SECTION 13: EVENT LISTENERS
// ============================================

function setupEventListeners() {
    let searchTimeout;
    document.getElementById('search-input').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchTerm = e.target.value;
            renderProducts();
            if (searchTerm) {
                const count = filterProducts().length;
                showNotification('Recherche', `${count} produit(s) trouvé(s)`, count > 0 ? 'info' : 'warning');
            }
        }, 300);
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderProducts();
        });
    });

    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            renderProducts();
        });
    });

    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
}


// ============================================
// SECTION 14: EXPORT
// ============================================

function exportData() {
    const filtered = filterProducts();
    
    const csv = [
        ['ID', 'Nom', 'Unité', 'Quantité', 'Type', 'Catégorie', 'Marque', 'Partenaire', 'Remarques', 'Statut'].join(','),
        ...filtered.map(p => [
            p.id,
            `"${p.name}"`,
            `"${p.unit || ''}"`,
            p.quantity || 0,
            `"${p.type || ''}"`,
            `"${getCategoryLabel(p.category)}"`,
            `"${p.brand || ''}"`,
            `"${p.partner || ''}"`,
            `"${p.remarks || ''}"`,
            `"${getStockLabel(getStockStatus(p.quantity))}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventaire_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showNotification('Export Réussi', `${filtered.length} produits exportés`, 'success');
}