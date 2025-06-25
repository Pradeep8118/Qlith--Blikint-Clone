function closePopup(redirect = false) {
  document.getElementById("authPopup").style.display = "none";
  if (redirect) {
    window.location.href = "index.html"; // Homepage or change as needed
  }
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

// ✅ Handle Login
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  hideError();

  const mobile = document.getElementById("loginMobile").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const users = JSON.parse(localStorage.getItem("users") || "{}");

  if (users[mobile] && users[mobile] === password) {
    localStorage.setItem("loggedInUser", mobile);
    localStorage.setItem("userName", localStorage.getItem(`userName-${mobile}`) || "John Doe");
    localStorage.setItem("userMobile", mobile);

    // ✅ Redirect to homepage — navbar will update there
    window.location.href = "index.html";
  } else {
    showError("Invalid mobile number or password.");
  }
});


// ✅ Handle Signup
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

    // You could collect name during signup later
    localStorage.setItem(`userName-${mob}`, "John Doe"); // optional default

    alert("Signup successful! You can now log in.");
    switchToLogin();
  }
});

// ✅ Forgot Password Flow
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
