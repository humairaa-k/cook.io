

"use strict";

/**
 * Import
 */

 import{ fetchData} from "./api.js";
 import { $skeletonCard, cardQueries } from "./global.js";
 //import { getTime } from "./module.js";

 /** HOME PAGE SEARCH  */

// node elements              //did spelling mistake that caused error
const $searchField = document.querySelector("[data-search-field]");
const $searchBtn = document.querySelector("[data-search-btn]");

 $searchBtn.addEventListener('click' ,() => {
    if( $searchBtn.value)window.location = `/recipes.html?q=${$searchField.value} `;
 });
 //q is the key of the query parameter,q = the search term passed in the URL to show specific results on the next page.

 /** search submit when press "enter" key  */
  $searchField.addEventListener("keydown", e => {
    if(e.key === "Enter")$searchBtn.click();
  })


  /** tab panel navigation */

  //Nodelist
  const $tabBtns = document.querySelectorAll("[data-tab-btn]");
  const $tabPanel = document.querySelectorAll("[data-tab-panel]");

  //nodeElement
  // ✅ Get the first tab panel and store it as the last active one (initially)
    // ✅ Get the first tab button and store it as the last active one (initially)
  let [$lastActiveTabPanel] = $tabPanel;
  let [$lastActiveTabBtn] = $tabBtns;

  addEventOnElements($tabBtns, "click", function(){
    $lastActiveTabPanel.setAttribute("hidden", "");
    $lastActiveTabBtn.setAttribute("aria-selected",false);
    $lastActiveTabBtn.setAttribute("tabindex", -1);

    const $currentTabPanel = document.querySelector(`#${this.getAttribute("aria-controls")}`);
        $currentTabPanel.removeAttribute("hidden");
        this.setAttribute("aria-selected", true);
        this.setAttribute("tabindex",0);

        $lastActiveTabPanel = $currentTabPanel;
        $lastActiveTabBtn = this;
        //load content for the new tab
        addTabContent(this, $currentTabPanel);
  });


// 🔁 Add a click event to all tab buttons using the helper function
  // 🔒 Hide the currently active tab panel by adding the 'hidden' attribute
  // ♿ Mark the previously selected tab button as unselected (for screen readers)
  // 🚫 Remove keyboard focus from the old tab (so only the active one is tabbable)
  // 🧠 Get the ID of the panel that this clicked tab controls (via 'aria-controls')
  // 💡 Use that ID to find the matching panel in the DOM
    // 👁️ Show the new panel by removing the 'hidden' attribute
  // ✅ Mark the clicked tab button as selected (accessibility support)
  // ⌨️ Make the new active tab button keyboard-focusable
  // 🔄 Update the reference for the next click (track the new active tab and panel)

//   🧠 Tip to Remember:
// This code enables a fully accessible tab system, ensuring:
// Only one tab and panel are active at a time
// Keyboard users can navigate it
// Screen readers understand which tab and content are active

// NAVIGATE TAB WITH ARROW KEY

addEventOnElements($tabBtns, 'keydown', function (e){
  
const $nextElement = this.nextElementSibling;
const $previousElement = this.previousElementSibling;

 if(e.key === "ArrowRight" && $nextElement){
  this.setAttribute("tabIndex",-1);
  $nextElement.setAttribute("tabIndex",0);
  $nextElement.focus();

 }else if(e.key === "ArrowLeft" && $previousElement){
  this.setAttribute("tabIndex",-1);
  $previousElement.setAttribute("tabIndex",0);
  $previousElement.focus();

 }else if(e.key === "Tab"){
   this.setAttribute("tabindex", -1);
   $lastActiveTabBtn.setAttribute("tabindex",0)
  }

 });

 //triggers animation 
 window.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add("animate");
    }, i * 100); // delay each card by 100ms
  });
});


/**
 * WORK WITH API
 * fetch data for tab content
 */

// 🍽️ Meal type → API category mapping
const mealTimeCategoryMap = {
  breakfast: 'Breakfast',
  lunch: 'Chicken',
  dinner: 'Beef',
  snack: 'Miscellaneous',
  teatime: 'Dessert'
};

const addTabContent = ($currentTabBtn, $currentTabPanel) => {
  
  const $gridList = document.createElement("div");
  $gridList.classList.add("grid-list");

  $currentTabPanel.innerHTML = `  
   <div class="grid-list">
     ${$skeletonCard.repeat(12)}
   </div>`;

    // 👇 Inject meal time map here:
  const tabName = $currentTabBtn.textContent.trim().toLowerCase();
  const category = mealTimeCategoryMap[tabName] || "Beef"; // fallback to Beef

  
  fetchData([`filter.php?c=${category}`], function (data) {
    $currentTabPanel.innerHTML = "";
    const results = data.meals || [];

    for (let i = 0; i < Math.min(12, results.length); i++) {
      const recipe = results[i];
      if (!recipe) continue;

      const id = recipe.idMeal;
      const title = recipe.strMeal;
      const image = recipe.strMealThumb;

      const isSaved = window.localStorage.getItem(`cookio-recipe${id}`);

      const $card = document.createElement("div");
      $card.classList.add("card");
      $card.style.animationDelay = `${100 * i}ms`;

      $card.innerHTML = `
        <figure class="card-media img-holder">
          <img src="${image}" alt="${title}" width="195" height="195" loading="lazy" class="img-cover">
        </figure>

        <div class="card-body">
          <h3 class="title-small">
           <a href="./detail.html?id=${id}" class="card-link">${title ?? "Untitled"}</a>
            
          </h3>

          <div class="meta-wrapper">
            <div class="meta-item">
              <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
              <span class="label-medium">~</span>
            </div>

            <button class="icon-btn has-state ${isSaved ? "saved" : "removed"}"
            aria-label="Add to saved recipes"onclick="saveRecipe(this, '${id}')">

              <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
              <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
            </button>
          </div>
        </div>
      `;

      $gridList.appendChild($card);
    }

    $currentTabPanel.appendChild($gridList);
    $currentTabPanel.innerHTML += `
      <a href="./recipes.html?mealType=${$currentTabBtn.textContent.trim().toLowerCase()}" class="btn btn-secondary label-large has-state">
        Show more
      </a>
    `;
  }
);

}
// Call your tab rendering function
addTabContent($lastActiveTabBtn, $lastActiveTabPanel);


/**
 * Fetch data for slider card
 **/

let /*{array}*/ cuisineType = ["Italian", "French"];

const /*{nodelist}*/ $sliderSections = document.querySelectorAll("[data-slider-section]");

for (const [index, $sliderSection] of $sliderSections.entries()) {
  const cuisine = cuisineType[index];
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${cuisine}`;
  const $sliderWrapper = $sliderSection.querySelector("[data-slider-wrapper]");

  // Set skeleton cards (placeholders)
  $sliderWrapper.innerHTML = `<li class="slider__item">${$skeletonCard}</li>`.repeat(10);

  // Optional: update section title dynamically
  const titleEl = $sliderSection.querySelector(".section-title");
  if (titleEl) titleEl.textContent = `Latest ${cuisine} Recipes`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      $sliderWrapper.innerHTML = "";
      const meals = data.meals || [];

      if (!meals.length) {
        $sliderWrapper.innerHTML = `<li class="slider__item">No recipes found for ${cuisine}</li>`;
        return;
      }

      meals.forEach((meal) => {
        const { strMealThumb: image, strMeal: title, idMeal: id } = meal;
        const isSaved = window.localStorage.getItem(`cookio-recipe${id}`);
        const $sliderItem = document.createElement("li");
        $sliderItem.classList.add("slider__item");
        $sliderItem.innerHTML = `
          <div class="card">
            <figure class="card-media img-holder">
              <img src="${image}" alt="${title}" width="195" height="195" loading="lazy" class="img-cover">
            </figure>
            <div class="card-body">
              <h3 class="title-small">
               <a href="./detail.html?id=${id}" class="card-link">${title ?? "Untitled"}</a>
              </h3>
              <div class="meta-wrapper">
                <div class="meta-item">
                  <span class="material-symbols-outlined">schedule</span>
                  <span class="label-medium">~</span>
                </div>
                <button class="icon-btn has-state ${isSaved ? "saved" : "removed"}"
                        aria-label="Add to saved recipes"
                        onclick="saveRecipe(this, '${id}')">
                  <span class="material-symbols-outlined bookmark-add">bookmark_add</span>
                  <span class="material-symbols-outlined bookmark">bookmark</span>
                </button>
              </div>
            </div>
          </div>`;
        $sliderWrapper.appendChild($sliderItem);
      });

      // Add "Show More" link
      $sliderWrapper.innerHTML += `
        <li class="slider__item" data-slider-item>
        <a href="./recipes.html?a=${encodeURIComponent(cuisine)}"class="load-more-card has-state">
            <span class="label-large">Show more</span>
            <span class="material-symbols-outlined" aria-hidden="true">navigate_next</span>
          </a>
        </li>`;
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      $sliderWrapper.innerHTML = `<li class="slider__item">Failed to load recipes.</li>`;
    });
}

//search bar 
const $searchForm = document.querySelector("[data-search-form]");
//const $searchField = document.querySelector("[data-search-field]");
//const $searchBtn = document.querySelector("[data-search-btn]");

// Submit on button click
$searchBtn?.addEventListener("click", () => {
  const query = $searchField.value.trim();
  if (query) {
    window.location.href = `./recipes.html?s=${encodeURIComponent(query)}`;
  }
});

// Submit on Enter key
$searchField?.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent form submission if inside a <form>
    $searchBtn.click();
  }
});


