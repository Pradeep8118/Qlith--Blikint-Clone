function closePopup() {
  document.getElementById("authPopup").style.display = "none";
}

function switchToSignup() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "block";
  document.getElementById("showSignup").classList.add("active");
  document.getElementById("showLogin").classList.remove("active");
  hideError();
}

function switchToLogin() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("showLogin").classList.add("active");
  document.getElementById("showSignup").classList.remove("active");
  hideError();
}

function togglePassword(fieldId, icon) {
  const field = document.getElementById(fieldId);
  if (field.type === "password") {
    field.type = "text";
    icon.textContent = "🙈";
  } else {
    field.type = "password";
    icon.textContent = "👁️";
  }
}

function showError(msg) {
  const err = document.getElementById("errorMessage");
  err.textContent = msg;
  err.classList.add("show");
}

function hideError() {
  const err = document.getElementById("errorMessage");
  err.classList.remove("show");
  err.textContent = "";
}

// Handle login
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  hideError();

  const mob = document.getElementById("loginMobile").value.trim();
  const pwd = document.getElementById("loginPassword").value.trim();
  const users = JSON.parse(localStorage.getItem("users") || "{}");

  if (users[mob] && users[mob] === pwd) {
    alert("Login successful!");
    closePopup();
  } else {
    showError("Invalid mobile number or password.");
  }
});

// Handle signup
document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();
  hideError();

  const mob = document.getElementById("signupMobile").value.trim();
  const pwd = document.getElementById("signupPassword").value.trim();
  let users = JSON.parse(localStorage.getItem("users") || "{}");

  if (users[mob]) {
    showError("Mobile number already registered.");
  } else {
    users[mob] = pwd;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! You can now log in.");
    switchToLogin();
  }
});

// Forgot Password
function forgotPassword() {
  hideError();
  const mob = prompt("Enter your registered mobile number:");
  if (!mob) return;

  let users = JSON.parse(localStorage.getItem("users") || "{}");

  if (users[mob]) {
    const newPwd = prompt("Enter your new password:");
    if (newPwd) {
      users[mob] = newPwd;
      localStorage.setItem("users", JSON.stringify(users));
      alert("Password updated successfully.");
    }
  } else {
    alert("Mobile number not found.");
  }
}
