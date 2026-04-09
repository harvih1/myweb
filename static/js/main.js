// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// ===== CART SIDEBAR ELEMENTS (declared early so addToCart can use them) =====
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');

// ===== CART STATE =====
let cart = JSON.parse(localStorage.getItem('luxbags_cart') || '[]');

function saveCart() {
  localStorage.setItem('luxbags_cart', JSON.stringify(cart));
}

function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cartCount').textContent = total;
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = 'block';

  container.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <div class="cart-item-top">
          <span class="cart-item-name">${item.name}</span>
          <button class="remove-item" data-id="${item.id}" title="Remove item">✕</button>
        </div>
        <div class="cart-item-unit-price">$${parseFloat(item.price).toFixed(2)} each</div>
        <div class="cart-item-bottom">
          <div class="cart-item-qty">
            <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
          </div>
          <span class="cart-item-line-total">$${(item.price * item.qty).toFixed(2)}</span>
        </div>
      </div>
    </div>
  `).join('');

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 80 ? 0 : 5.99;
  const total = subtotal + shipping;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('cartItemCount', itemCount);
  set('cartSubtotal', `$${subtotal.toFixed(2)}`);
  set('cartShipping', shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`);
  set('cartTotal', `$${total.toFixed(2)}`);

  const note = document.getElementById('cartShippingNote');
  if (note) {
    note.textContent = subtotal >= 80
      ? '🎉 You qualify for free shipping!'
      : `Add $${(80 - subtotal).toFixed(2)} more for free shipping`;
  }
}

function addToCart(id, name, price, image) {
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price: parseFloat(price), image: image || '', qty: 1 });
  }
  saveCart();
  updateCartCount();
  renderCart();
  openCartSidebar();
  showToast(`"${name}" added to cart!`);
}

// Cart event delegation
const cartItemsEl = document.getElementById('cartItems');
if (cartItemsEl) {
  cartItemsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.qty-btn, .remove-item');
    if (!btn) return;
    const id = parseInt(btn.dataset.id);
    if (btn.classList.contains('remove-item')) {
      cart = cart.filter(i => i.id !== id);
    } else if (btn.classList.contains('qty-btn')) {
      const item = cart.find(i => i.id === id);
      if (item) {
        btn.dataset.action === 'inc' ? item.qty++ : item.qty--;
        if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
      }
    }
    saveCart();
    updateCartCount();
    renderCart();
  });
}

// ===== CART SIDEBAR TOGGLE =====
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');

function openCartSidebar() {
  cartSidebar && cartSidebar.classList.add('open');
  cartOverlay && cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCartSidebar() {
  cartSidebar && cartSidebar.classList.remove('open');
  cartOverlay && cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

cartBtn && cartBtn.addEventListener('click', openCartSidebar);
closeCart && closeCart.addEventListener('click', closeCartSidebar);
cartOverlay && cartOverlay.addEventListener('click', closeCartSidebar);

// ===== ADD TO CART BUTTONS =====
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-to-cart, .quick-add');
  if (!btn) return;
  const { id, name, price } = btn.dataset;
  // Try to get image from the product card
  const card = btn.closest('.product-card');
  const image = card ? card.querySelector('img').src : '';
  addToCart(parseInt(id), name, price, image);
});

// ===== FILTER TABS =====
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    productCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      if (match) {
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'fadeIn 0.3s ease';
      }
    });
  });
});

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ===== INIT =====
updateCartCount();
renderCart();

// Fade-in animation
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`;
document.head.appendChild(style);