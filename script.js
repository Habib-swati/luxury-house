/* ===== Luxury House - main JavaScript (beginner level) ===== */

/* 1. Mobile menu open / close */
function toggleMenu() {
  var menu = document.getElementById("menu-list");
  if (menu) { menu.classList.toggle("show"); }
}

/* 2. Show a message inside a box */
function showMessage(boxId, text, type) {
  var box = document.getElementById(boxId);
  box.innerHTML = text;
  box.className = "message " + type;
}

/* ---------------- LOGIN / SIGNUP ---------------- */
function showLoginForm() {
  document.getElementById("login-form").classList.remove("hidden");
  document.getElementById("signup-form").classList.add("hidden");
  document.getElementById("tab-login").classList.add("active");
  document.getElementById("tab-signup").classList.remove("active");
}

function showSignupForm() {
  document.getElementById("signup-form").classList.remove("hidden");
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("tab-signup").classList.add("active");
  document.getElementById("tab-login").classList.remove("active");
}

function doSignup(event) {
  event.preventDefault();

  var name = document.getElementById("signup-name").value;
  var email = document.getElementById("signup-email").value;
  var pass = document.getElementById("signup-password").value;
  var pass2 = document.getElementById("signup-password2").value;

  if (name === "" || email === "" || pass === "") {
    showMessage("auth-message", "Please fill all the fields.", "error");
    return;
  }
  if (pass.length < 6) {
    showMessage("auth-message", "Password must be at least 6 characters.", "error");
    return;
  }
  if (pass !== pass2) {
    showMessage("auth-message", "The two passwords do not match.", "error");
    return;
  }

  // Frontend only: we save the user in the browser storage
  var user = { name: name, email: email, password: pass };
  localStorage.setItem("lh_user", JSON.stringify(user));

  showMessage("auth-message", "Account created. You can login now, " + name + "!", "success");
  document.getElementById("signup-form").reset();
}

function doLogin(event) {
  event.preventDefault();

  var email = document.getElementById("login-email").value;
  var pass = document.getElementById("login-password").value;
  var saved = localStorage.getItem("lh_user");

  if (saved === null) {
    showMessage("auth-message", "No account found. Please sign up first.", "error");
    return;
  }

  var user = JSON.parse(saved);
  if (user.email === email && user.password === pass) {
    localStorage.setItem("lh_logged_in", user.name);
    showMessage("auth-message", "Welcome back, " + user.name + "!", "success");
  } else {
    showMessage("auth-message", "Wrong email or password.", "error");
  }
}

function doLogout() {
  localStorage.removeItem("lh_logged_in");
  showMessage("auth-message", "You are logged out.", "success");
}

/* ---------------- PRODUCTS ---------------- */
function filterProducts(category) {
  var cards = document.getElementsByClassName("card");
  for (var i = 0; i < cards.length; i++) {
    var cardType = cards[i].getAttribute("data-type");
    if (category === "all" || cardType === category) {
      cards[i].style.display = "block";
    } else {
      cards[i].style.display = "none";
    }
  }
}

function orderProduct(name, price) {
  localStorage.setItem("lh_product", name);
  localStorage.setItem("lh_price", price);
  window.location.href = "order.html";
}

/* ---------------- ORDER FORM ---------------- */
function fillOrderProduct() {
  var product = localStorage.getItem("lh_product");
  var select = document.getElementById("order-product");
  if (product !== null && select !== null) { select.value = product; }
  updateTotal();
}

var PRICES = {
  "Walnut Carved Door": 45000,
  "Oak Timber Window": 18000,
  "Teak Dining Table": 65000,
  "Sheesham Wood Plank (per sq ft)": 900
};

function updateTotal() {
  var select = document.getElementById("order-product");
  var qtyInput = document.getElementById("order-qty");
  var totalBox = document.getElementById("order-total");
  if (!select || !qtyInput || !totalBox) { return; }

  var price = PRICES[select.value] || 0; 
  var qty = parseInt(qtyInput.value, 10);
  if (isNaN(qty) || qty < 1) { qty = 1; }
  totalBox.innerHTML = "Total: Rs " + price * qty;
}

function placeOrder(event) {
  event.preventDefault();

  var name = document.getElementById("order-name").value;
  var phone = document.getElementById("order-phone").value;
  var address = document.getElementById("order-address").value;
  var product = document.getElementById("order-product").value;
  var qty = document.getElementById("order-qty").value;

  if (name === "" || phone === "" || address === "") {
    showMessage("order-message", "Please fill your name, phone and address.", "error");
    return;
  }
  if (phone.length < 7) {
    showMessage("order-message", "Please write a correct phone number.", "error");
    return;
  }

  var total = (PRICES[product] || 0) * parseInt(qty, 10);
  showMessage(
    "order-message",
    "Thank you " + name + "! Your order for " + qty + " x " + product +
      " (Rs " + total + ") is received. We will call you on " + phone + ".",
    "success"
  );
  document.getElementById("order-form").reset();
  updateTotal();
}

/* ---------------- CUSTOMER LOCATION ---------------- */
function findMyLocation() {
  var box = document.getElementById("location-message");
  if (!navigator.geolocation) {
    box.innerHTML = "Your browser does not support location.";
    box.className = "message error";
    return;
  }

  box.innerHTML = "Finding your location...";
  box.className = "message";

  navigator.geolocation.getCurrentPosition(
    function (position) {
      var lat = position.coords.latitude.toFixed(4);
      var lon = position.coords.longitude.toFixed(4);
      box.innerHTML =
        "Your location: " + lat + ", " + lon +
        '<br><a href="https://www.google.com/maps?q=' + lat + "," + lon +
        '" target="_blank">Open in Google Maps</a>';
      box.className = "message success";
    },
    function () {
      box.innerHTML = "Location permission was not given.";
      box.className = "message error";
    }
  );
}
