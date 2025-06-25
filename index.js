// --- CATEGORY SCROLLING ---
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

function removeFromCart(id) {
  let cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
  updateCartUI();
}

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
  const cartCountElem = document.getElementById('cartCount');
  const emptyMsg = document.getElementById('emptyCartMessage');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (cartCountElem) {
    cartCountElem.innerText = cart.reduce((acc, item) => acc + item.qty, 0);
  }

  if (!container) return;

  container.innerHTML = '';

  if (cart.length === 0) {
    if (emptyMsg) emptyMsg.classList.remove('hidden');
    if (checkoutBtn) checkoutBtn.classList.add('hidden');
    return;
  }

  if (emptyMsg) emptyMsg.classList.add('hidden');
  if (checkoutBtn) checkoutBtn.classList.remove('hidden');

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

// --- NAVBAR AUTH FUNCTION ---
function updateNavbarAuth() {
  const user = localStorage.getItem('loggedInUser');
  const userMobile = localStorage.getItem("userMobile") || "0000000000";
  const navRight = document.getElementById('navRight');

  if (!navRight) return;

  navRight.innerHTML = `
    <button id="floatingCartBtn" class="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200">
      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M3 3h2l.4 2M7 13h14l-1.35 6.7a1 1 0 01-.98.8H6.33a1 1 0 01-.98-.8L4 6H2" />
      </svg>
      <span class="text-sm font-medium text-gray-800">My Cart</span>
      <span id="cartCount" class="ml-1 text-sm text-green-700 font-semibold">(0)</span>
    </button>

    ${user ? `
      <div class="relative ml-4" id="dropdownWrapper">
        <button onclick="document.getElementById('accountDropdown').classList.toggle('hidden')"
          class="flex items-center gap-1 text-sm text-gray-700 hover:text-green-600">
          Account
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div id="accountDropdown"
          class="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl p-4 text-sm hidden z-50 space-y-2">
          <div class="font-semibold text-gray-800 border-b pb-2">${userMobile}</div>
          <a href="my-order.html" class="block hover:text-green-600">My Orders</a>
          <a href="#" class="block hover:text-green-600">Saved Addresses</a>
          <a href="#" class="block hover:text-green-600">E-Gift Cards</a>
          <a href="#" class="block hover:text-green-600">FAQ’s</a>
          <a href="#" class="block hover:text-green-600">Account Privacy</a>
          <button id="logoutBtn" class="text-red-500 hover:text-red-600 w-full text-left mt-1">Log Out</button>
        </div>
      </div>
    ` : `
      <a href="Login.html" class="text-sm font-medium text-gray-700 hover:text-green-600 ml-4">Login</a>
    `}
  `;

  // Cart button
  document.getElementById('floatingCartBtn')?.addEventListener('click', toggleCart);

  // Logout handler
  setTimeout(() => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', showLogoutModal);

    }
  }, 0);
}


function showLogoutModal() {
  document.getElementById('logoutModal').classList.remove('hidden');
}

function closeLogoutModal() {
  document.getElementById('logoutModal').classList.add('hidden');
}

function confirmLogout() {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('userName');
  localStorage.removeItem('userMobile');
  localStorage.removeItem('userImage');
  localStorage.removeItem('cartItems'); // clear cart on logout
  window.location.href = "index.html";
}

// function confirmLogout() {
//   localStorage.clear();
//   // window.location.href = "login.html"; // Adjust if your login page is named differently
// }

function logoutUser() {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('userName');
  localStorage.removeItem('userMobile');
  localStorage.removeItem('userImage');
  localStorage.removeItem('cartItems');
  updateNavbarAuth();
  window.location.href = "index.html";
}

// --- CART TOGGLE ---
function toggleCart() {
  document.getElementById('cartModal')?.classList.toggle('hidden');
}

// --- PROFILE TOGGLE ---
function toggleProfile() {
  const profileModal = document.getElementById('profileModal');
  if (profileModal) {
    const name = localStorage.getItem('userName') || 'Not set';
    const mobile = localStorage.getItem('userMobile') || 'Not available';
    document.getElementById('profileName').textContent = name;
    document.getElementById('profileMobile').textContent = mobile;

    profileModal.classList.toggle('hidden');
  }
}

function toggleProfileDropdown() {
  const dropdown = document.getElementById('profileDropdown');
  dropdown?.classList.toggle('hidden');
}

window.addEventListener("click", function (e) {
  const wrapper = document.getElementById("dropdownWrapper");
  const dropdown = document.getElementById("accountDropdown");
  if (wrapper && dropdown && !wrapper.contains(e.target)) {
    dropdown.classList.add("hidden");
  }
});



// --- INIT ---
window.addEventListener('load', () => {
  updateCartUI();
  updateNavbarAuth();
});
