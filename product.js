// --- CART MANAGEMENT FUNCTIONS ---
function getCart() {
  return JSON.parse(localStorage.getItem('cartItems')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cartItems', JSON.stringify(cart));
}

// Show dynamic toast notification
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2000);
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

  // Show dynamic toast
  showToast(`${name} added to the cart`);
}

// Remove item from cart
function removeFromCart(id) {
  let cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
  updateCartUI();
}

// Change item quantity
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

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const itemTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryCharge = 25;
  const handlingCharge = 2;
  const grandTotal = itemTotal + deliveryCharge + handlingCharge;

  document.getElementById('cartCount').innerText = cartCount;
  document.getElementById('cartItemCount').innerText = `${cartCount} item${cartCount > 1 ? 's' : ''}`;
  document.getElementById('itemTotal').innerText = itemTotal;
  document.getElementById('deliveryCharge').innerText = deliveryCharge;
  document.getElementById('handlingCharge').innerText = handlingCharge;
  document.getElementById('grandTotal').innerText = grandTotal;

  if (cart.length === 0) {
    document.getElementById('emptyCartMessage').classList.remove('hidden');
    document.getElementById('checkoutBtn').classList.add('hidden');
    document.getElementById('billSection').classList.add('hidden');
    return;
  }

  document.getElementById('emptyCartMessage').classList.add('hidden');
  document.getElementById('checkoutBtn').classList.remove('hidden');
  document.getElementById('billSection').classList.remove('hidden');

  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center border-b pb-3 mb-3';

    div.innerHTML = `
      <div>
        <p class="text-sm font-medium">${item.name}</p>
        <p class="text-xs text-gray-500">₹${item.price} × ${item.qty} = ₹${item.price * item.qty}</p>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="changeQty(${item.id}, -1)" class="px-2 bg-gray-200 text-lg rounded">−</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${item.id}, 1)" class="px-2 bg-gray-200 text-lg rounded">＋</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// function placeOrder() {
//   const user = localStorage.getItem("loggedInUser");
//   if (!user) {
//     alert("⚠️ Please log in to place an order.");
//     window.location.href = "login.html";
//     return;
//   }

//   const cart = getCart();
//   if (cart.length === 0) {
//     alert("🛒 Your cart is empty.");
//     return;
//   }

//   const order = {
//     id: "ORD" + Date.now(),
//     date: new Date().toLocaleString(),
//     items: cart,
//     total: cart.reduce((sum, item) => sum + item.qty * item.price, 0)
//   };

//   // Get existing orders
//   const existingOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];
//   existingOrders.push(order);
//   localStorage.setItem("orderHistory", JSON.stringify(existingOrders));

//   // Clear cart
//   localStorage.removeItem("cartItems");
//   updateCartUI();

//   alert("✅ Order placed successfully!");
//   window.location.href = "my-order.html"; // Optional redirect
// }



// --- CART TOGGLE ---
function toggleCart() {
  document.getElementById('cartModal').classList.toggle('hidden');
}

// --- EVENT LISTENERS ---
document.getElementById('floatingCartBtn').addEventListener('click', toggleCart);
window.addEventListener('load', updateCartUI);

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".open-cart-btn").forEach(btn => {
    btn.addEventListener("click", toggleCart);
  });
});