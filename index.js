const scrollContainer = document.getElementById('categoryScroll');

function scrollLeft() {
  scrollContainer.scrollBy({ left: -200, behavior: 'smooth' });
}

function scrollRight() {
  scrollContainer.scrollBy({ left: 200, behavior: 'smooth' });
}















// --- CART MANAGEMENT FUNCTIONS ---
function getCart() {
  return JSON.parse(localStorage.getItem('cartItems')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cartItems', JSON.stringify(cart));
}

// Add product to cart
function addToCart(id, name, price) {
  const cart = getCart();
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  saveCart(cart);
  updateCartUI();
}

// Remove item from cart
function removeFromCart(id) {
  let cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
  updateCartUI();
}

// Change quantity
function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(item => item.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty < 1) removeFromCart(id);
  else saveCart(cart);
  updateCartUI();
}

// --- CART UI RENDERING ---
function updateCartUI() {
  const cart = getCart();
  const container = document.getElementById('cartItemsContainer');
  container.innerHTML = '';
  document.getElementById('cartCount').innerText = cart.reduce((acc, item) => acc + item.qty, 0);

  if (cart.length === 0) {
    document.getElementById('emptyCartMessage').classList.remove('hidden');
    document.getElementById('checkoutBtn').classList.add('hidden');
    return;
  }

  document.getElementById('emptyCartMessage').classList.add('hidden');
  document.getElementById('checkoutBtn').classList.remove('hidden');

  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center py-2 border-b';

    div.innerHTML = `
      <div>
        <p class="font-medium">${item.name}</p>
        <p class="text-gray-500 text-sm">₹${item.price} × ${item.qty} = ₹${item.price * item.qty}</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="px-2 bg-gray-200 rounded" onclick="changeQty(${item.id}, -1)">−</button>
        <span>${item.qty}</span>
        <button class="px-2 bg-gray-200 rounded" onclick="changeQty(${item.id}, 1)">＋</button>
        <button class="ml-4 text-red-500 text-sm" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// --- CART TOGGLE ---
function toggleCart() {
  document.getElementById('cartModal').classList.toggle('hidden');
}

// Event listeners
document.getElementById('floatingCartBtn').addEventListener('click', toggleCart);
window.addEventListener('load', updateCartUI);