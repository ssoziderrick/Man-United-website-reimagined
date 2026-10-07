// store.js - STORE page only.
// Four small features:
//   1. filter buttons   2. basket count + total price   3. clear basket   4. heart buttons
// The prices are written in the HTML (e.g. "Ugx 200,000"). JS reads them from there.


// =====================================================
// FEATURE 1: FILTER BUTTONS
// (these only do something if filter buttons are on the page)
// =====================================================

// find the things we need on the page
const filterButtons = document.querySelectorAll(".filter-btn");
const products = document.querySelectorAll(".product");
const resultCount = document.getElementById("result-count");

// go through every filter button, one by one
for (let i = 0; i < filterButtons.length; i++) {

  // when this button is clicked, run the code inside
  filterButtons[i].addEventListener("click", function () {

    // step 1: take the "active" class off ALL the buttons
    for (let j = 0; j < filterButtons.length; j++) {
      filterButtons[j].classList.remove("active");
    }

    // step 2: put "active" only on the button that was clicked
    filterButtons[i].classList.add("active");

    // step 3: read which category the button stands for (data-filter="jerseys")
    const filter = filterButtons[i].dataset.filter;

    // step 4: go through every product and show it or hide it
    let shown = 0;
    for (let k = 0; k < products.length; k++) {
      // a product has classes like: class="product jerseys new"
      if (filter === "all" || products[k].classList.contains(filter)) {
        products[k].classList.remove("hidden");   // show it
        shown = shown + 1;
      } else {
        products[k].classList.add("hidden");      // hide it
      }
    }

    // step 5: update the "12 products" text
    resultCount.textContent = shown + " products";
  });
}


// =====================================================
// FEATURE 2: BASKET COUNT + TOTAL PRICE
// =====================================================

// find the things we need on the page
const basketCount = document.getElementById("basket-count");
const basketTotal = document.getElementById("basket-total");
const addButtons = document.querySelectorAll(".add-btn");

// two numbers that remember what is in the basket
let items = 0;   // how many things were added
let total = 0;   // the total price (in Ugx)

// this function updates the numbers on the screen
function updateBasket() {
  basketCount.textContent = items;

  // the "if" is just in case the total box is missing from the HTML
  if (basketTotal !== null) {
    basketTotal.textContent = "Ugx " + total.toLocaleString();
    // toLocaleString() adds the commas, e.g. 320000 becomes 320,000
  }
}

// go through every "Add to basket" button
for (let i = 0; i < addButtons.length; i++) {

  addButtons[i].addEventListener("click", function () {

    // step 1: find the product card this button belongs to
    // (closest() looks upwards until it finds an element with class "product")
    const card = addButtons[i].closest(".product");

    // step 2: inside that card, find the price text, e.g. "Ugx 200,000"
    const priceText = card.querySelector(".now").textContent;

    // step 3: turn the text into a real number
    // remove the "ugx" word and the commas, so "Ugx 200,000" becomes " 200000"
    const cleanText = priceText.toLowerCase().replace("ugx", "").replaceAll(",", "");
    const price = Number(cleanText);   // Number() turns the text into a number: 200000

    // step 4: add to the count and the total
    items = items + 1;
    total = total + price;

    // step 5: show the new numbers
    updateBasket();

    // step 6: change the button text for 1 second, then change it back
    addButtons[i].textContent = "Added ✔";
    setTimeout(function () {
      addButtons[i].textContent = "Add to basket";
    }, 1000);
  });
}


// =====================================================
// FEATURE 3: CLEAR BASKET BUTTON
// =====================================================

const clearButton = document.getElementById("clear-basket");

// the "if" is just in case the button is missing from the HTML
if (clearButton !== null) {
  clearButton.addEventListener("click", function () {
    items = 0;
    total = 0;
    updateBasket();
  });
}


// =====================================================
// FEATURE 4: HEART (WISHLIST) BUTTONS
// =====================================================

const hearts = document.querySelectorAll(".heart");

for (let i = 0; i < hearts.length; i++) {

  hearts[i].addEventListener("click", function () {

    // toggle = add the class if it is not there, remove it if it is
    hearts[i].classList.toggle("liked");

    // change the symbol: empty heart or full heart
    if (hearts[i].classList.contains("liked")) {
      hearts[i].textContent = "♥";
    } else {
      hearts[i].textContent = "♡";
    }
  });
}