// store.js - STORE page only. Three small features. Prices are written in the HTML, not here.

// ----- Feature 1: category filter buttons -----
const filterButtons = document.querySelectorAll(".filter-btn");
const products = document.querySelectorAll(".product");
const resultCount = document.getElementById("result-count");

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // move the red "active" style to the clicked button
    filterButtons.forEach(function (b) { b.classList.remove("active"); });
    button.classList.add("active");

    // show only products that have the matching class (e.g. class="product jerseys new")
    const filter = button.dataset.filter;
    let shown = 0;
    products.forEach(function (product) {
      if (filter === "all" || product.classList.contains(filter)) {
        product.classList.remove("hidden");
        shown++;
      } else {
        product.classList.add("hidden");
      }
    });
    resultCount.textContent = shown + " products";
  });
});

// ----- Feature 2: basket counter (just counts clicks, no prices) -----
const basketCount = document.getElementById("basket-count");
const addButtons = document.querySelectorAll(".add-btn");
let items = 0;

addButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    items = items + 1;
    basketCount.textContent = items;

    button.textContent = "Added ✔";
    setTimeout(function () { button.textContent = "Add to basket"; }, 1000);
  });
});

// ----- Feature 3: heart (wishlist) button -----
const hearts = document.querySelectorAll(".heart");

hearts.forEach(function (heart) {
  heart.addEventListener("click", function () {
    heart.classList.toggle("liked");
    heart.textContent = heart.classList.contains("liked") ? "♥" : "♡";
  });
});
