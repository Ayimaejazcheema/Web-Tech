// ==========================================
// MIDTERM TASK 3 - LIVE SEARCH AND PRICE SORT
// Roll Number: FA24-BCS-025
// Premium Threshold: Rs. 2500
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  // GET HTML ELEMENTS
  const productSection = document.querySelector(".product-section");
  const searchInput = document.getElementById("product-search");
  const sortButton = document.getElementById("sort-price");
  const noResults = document.getElementById("no-results");

  const hotSection = document.getElementById("hot-coffees");
  const coldSection = document.getElementById("cold-coffees");

  // GET ALL EXISTING PRODUCT CARDS
  const cards = Array.from(productSection.querySelectorAll(".filter-item"));

  // CREATE ONE COMMON GRID FOR ALL EXISTING CARDS
  const productGrid = document.createElement("div");
  productGrid.id = "product-grid";
  productGrid.className = "row g-4";

  // MOVE EXISTING CARDS INTO THE COMMON GRID
  cards.forEach(function (card) {
    productGrid.appendChild(card);
  });

  // REMOVE THE OLD EMPTY PRODUCT ROWS
  productSection
    .querySelectorAll("#hot-coffees .row, #cold-coffees .row")
    .forEach(function (row) {
      row.remove();
    });

  // PLACE COMMON GRID AFTER PRODUCT HEADINGS
  coldSection.insertAdjacentElement("afterend", productGrid);

  // PREMIUM PRICE LIMIT
  const premiumThreshold = 2500;

  // READ PRICE DIRECTLY FROM EACH PRODUCT CARD
  function getPrice(card) {
    const priceElement = card.querySelector(".product-info strong");

    if (!priceElement) {
      return 0;
    }

    return parseFloat(priceElement.textContent.replace(/[^\d.]/g, "")) || 0;
  }

  // ADD PREMIUM LABELS WHEN PAGE LOADS
  cards.forEach(function (card) {
    const price = getPrice(card);

    if (price > premiumThreshold) {
      const productInfo = card.querySelector(".product-info");

      const premiumLabel = document.createElement("span");

      premiumLabel.className = "premium-label";
      premiumLabel.textContent = "Premium";

      productInfo.appendChild(premiumLabel);
    }
  });

  // GET SELECTED CATEGORY
  function getSelectedCategory() {
    const selectedRadio = document.querySelector(
      'input[name="category"]:checked',
    );

    if (!selectedRadio || selectedRadio.id === "filter-all") {
      return null;
    }

    const categories = {
      "filter-hot": "category-hot",
      "filter-milk": "category-milk",
      "filter-iced": "category-iced",
      "filter-flavoured": "category-flavoured",
    };

    return categories[selectedRadio.id] || null;
  }

  // LIVE SEARCH AND CATEGORY FILTER
  function filterProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const selectedCategory = getSelectedCategory();

    let matchingProducts = 0;

    cards.forEach(function (card) {
      // GET PRODUCT NAME
      const nameElement = card.querySelector(".product-info h3 a");

      const productName = nameElement
        ? nameElement.textContent.trim().toLowerCase()
        : "";

      // CHECK SEARCH MATCH
      const matchesSearch = productName.includes(searchTerm);

      // CHECK CATEGORY MATCH
      const matchesCategory =
        !selectedCategory || card.classList.contains(selectedCategory);

      // COUNT PRODUCTS MATCHING BOTH CONDITIONS
      if (matchesSearch && matchesCategory) {
        matchingProducts++;
      }

      // HIDE ONLY NONMATCHING SEARCH RESULTS
      card.classList.toggle("search-hidden", !matchesSearch);
    });

    // SHOW OR HIDE NO RESULTS MESSAGE
    const noProductsFound = matchingProducts === 0;

    noResults.hidden = !noProductsFound;

    // HIDE PRODUCT HEADINGS AND GRID WHEN NO MATCH EXISTS
    hotSection.hidden = noProductsFound;
    coldSection.hidden = noProductsFound;
    productGrid.hidden = noProductsFound;
  }

  // SEARCH EVENT
  searchInput.addEventListener("input", filterProducts);

  // CATEGORY FILTER EVENTS
  document.querySelectorAll('input[name="category"]').forEach(function (radio) {
    radio.addEventListener("change", filterProducts);
  });

  // PRICE SORTING
  let ascending = true;

  sortButton.addEventListener("click", function () {
    // COPY EXISTING CARD REFERENCES
    const sortedCards = [...cards];

    // SORT USING PRICE FROM EXISTING HTML
    sortedCards.sort(function (a, b) {
      const priceA = getPrice(a);
      const priceB = getPrice(b);

      if (ascending) {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });

    // MOVE EXISTING CARDS USING APPENDCHILD
    sortedCards.forEach(function (card) {
      productGrid.appendChild(card);
    });

    // UPDATE BUTTON TEXT FOR NEXT CLICK
    if (ascending) {
      sortButton.textContent = "Sort by price: High to Low";
    } else {
      sortButton.textContent = "Sort by price: Low to High";
    }

    // ALTERNATE SORTING ORDER
    ascending = !ascending;

    // KEEP SEARCH AND CATEGORY FILTERS WORKING
    filterProducts();
  });

  // INITIAL FILTER STATE
  filterProducts();
});
