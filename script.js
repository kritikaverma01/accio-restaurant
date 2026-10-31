
const API_URL = "./food.json";

let menuItems = [];
let cart = [];

// ======================================
// 1. getMenu()
// ======================================

async function getMenu() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Unable to fetch food menu");
    }

    menuItems = await response.json();

    displayFoodItems();

    return menuItems;

  } catch (error) {
    console.error("Menu Error:", error);

    const container = document.getElementById("foodContainer");

    if (container) {
      container.textContent = "Failed to load menu.";
    }

    throw error;
  }
}

// ======================================
// Display Food Items
// ======================================

function displayFoodItems(items = menuItems) {
  const container = document.getElementById("foodContainer");

  if (!container) return;

  container.innerHTML = "";

  const isLanding = !document.getElementById("placeOrderBtn");

  const displayItems = isLanding ? items.slice(0, 3) : items;

  displayItems.forEach((item) => {

    const card = document.createElement("div");
    card.className = "food-card";

    const img = document.createElement("img");
    img.src = item.imgSrc;
    img.alt = item.name;
    img.loading = "lazy";

    const details = document.createElement("div");
    details.className = "food-details";

    const info = document.createElement("div");

    const name = document.createElement("h4");
    name.textContent = item.name;

    const price = document.createElement("p");
    price.textContent = `$${Number(item.price).toFixed(2)}`;

    info.append(name, price);
    details.appendChild(info);

    if (!isLanding) {
      const button = document.createElement("button");

      button.className = "add-btn";
      button.textContent = "+";
      button.setAttribute("aria-label", `Add ${item.name}`);

      button.addEventListener("click", () => {
        addToCart(item);
      });

      details.appendChild(button);
    }

    card.append(img, details);
    container.appendChild(card);
  });
}

// ======================================
// Add to Cart
// ======================================

function addToCart(item) {
  cart.push(item);

  updateCart();

}

function updateCart() {

  const count = document.getElementById("cartCount");
  const total = document.getElementById("cartTotal");

  if (count) {
    count.textContent = cart.length;
  }

  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  if (total) {
    total.textContent = cartTotal.toFixed(2);
  }
}

// ======================================
// 2. TakeOrder()
// ======================================

function TakeOrder() {

  return new Promise((resolve, reject) => {

    setTimeout(() => {

      try {

        if (menuItems.length < 3) {
          throw new Error("Not enough menu items");
        }

        const burgers = menuItems.filter(item =>
          item.name.toLowerCase().includes("burger")
        );

        let availableItems = burgers;

        // Fallback because supplied JSON
        // contains only one burger.
        if (availableItems.length < 3) {
          availableItems = menuItems;
        }

        const shuffled = [...availableItems].sort(
          () => Math.random() - 0.5
        );

        const selectedItems = shuffled.slice(0, 3);

        const order = {
          items: selectedItems
        };

        console.log("Order Taken:", order);

        resolve(order);

      } catch (error) {
        reject(error);
      }

    }, 2500);

  });
}

// ======================================
// 3. orderPrep()
// ======================================

function orderPrep() {

  return new Promise((resolve) => {

    setTimeout(() => {

      const result = {
        order_status: true,
        paid: false
      };

      console.log("Order Prepared:", result);

      resolve(result);

    }, 1500);

  });
}

// ======================================
// 4. payOrder()
// ======================================

function payOrder() {

  return new Promise((resolve) => {

    setTimeout(() => {

      const result = {
        order_status: true,
        paid: true
      };

      console.log("Payment Successful:", result);

      resolve(result);

    }, 1000);

  });
}

// ======================================
// 5. thankyouFnc()
// ======================================

function thankyouFnc() {

  alert("Thank you for eating with us today!");

}

// ======================================
// Promise Chaining using Async/Await
// ======================================

async function startOrderProcess() {

  const message = document.getElementById("orderMessage");
  const button = document.getElementById("placeOrderBtn");

  try {

    if (button) {
      button.disabled = true;
      button.textContent = "Processing...";
    }

    if (message) {
      message.textContent = "Taking your order...";
    }

    // First Promise
    const order = await TakeOrder();

    console.log("Your Order:", order);

    if (message) {
      message.textContent = "Preparing your food...";
    }

    // Second Promise
    const preparation = await orderPrep();

    if (preparation.order_status === true) {

      if (message) {
        message.textContent = "Food prepared. Processing payment...";
      }

      // Third Promise
      const payment = await payOrder();

      if (payment.paid === true) {

        if (message) {
          message.textContent = "Payment successful!";
        }

        // Fourth Function
        thankyouFnc();

        cart = [];
        updateCart();

      }

    }

  } catch (error) {

    console.error("Order Error:", error);

    if (message) {
      message.textContent = "Order failed. Please try again.";
    }

    alert("Something went wrong. Please try again.");

  } finally {

    if (button) {
      button.disabled = false;
      button.textContent = "Place Order";
    }

  }

}

// ======================================
// Search Functionality
// ======================================

const searchInput = document.getElementById("searchInput");

if (searchInput) {

  searchInput.addEventListener("input", (event) => {

    const searchValue = event.target.value.toLowerCase();

    const filteredItems = menuItems.filter(item =>
      item.name.toLowerCase().includes(searchValue)
    );

    displayFoodItems(filteredItems);

  });

}

// ======================================
// Place Order Button
// ======================================

const placeOrderBtn = document.getElementById("placeOrderBtn");

if (placeOrderBtn) {

  placeOrderBtn.addEventListener("click", () => {

    if (cart.length === 0) {
      alert("Please add food items to your cart first!");
      return;
    }

    startOrderProcess();

  });

}

// ======================================
// Run on Page Load
// ======================================

document.addEventListener("DOMContentLoaded", () => {

  getMenu().catch(error => {
    console.error("Initialization failed:", error);
  });

});
