"use strict";

import {fetchData} from "./api.js";
import {$skeletonCard, cardQueries} from "./global.js";

/* Accordion */
const $accordions = document.querySelectorAll("[data-accordion]");
const initAccordion = function ($element) {
  const $button = $element.querySelector("[data-accordion-btn]");
  let isExpanded = false;
  $button.addEventListener("click", function () {
    isExpanded = !isExpanded;
    this.setAttribute("aria-expanded", isExpanded);
  });
};
for (const $accordion of $accordions) initAccordion($accordion);

// Filter bar toggle for mobile screen
const $filterBar = document.querySelector("[data-filter-bar]");
const $filterTogglers = document.querySelectorAll("[data-filter-toggler]");
const $overlay = document.querySelector("[data-overlay]");

addEventOnElements($filterTogglers, "click", function () {
  $filterBar.classList.toggle("active");
  $overlay.classList.toggle("active");
  const bodyOverflow = document.body.style.overflow;
  document.body.style.overflow = bodyOverflow === "hidden" ? "visible" : "hidden";
});

// Filter submit and clear
const $filterSubmit = document.querySelector("[data-filter-submit]");
const $filterClear = document.querySelector("[data-filter-clear]");
const $filterSearch = document.querySelector("input[type='search']");

$filterSubmit.addEventListener("click", function () {
  const searchValue = $filterSearch.value.trim();
  const newUrl = new URL(window.location.href);

  // Clear all filter parameters
  const filterKeys = ["s", "c", "a", "i", "f"];
  filterKeys.forEach(key => newUrl.searchParams.delete(key));

  if (searchValue) {
    // If search term exists, only set 's' param, ignore all filters
    newUrl.searchParams.set("s", searchValue);
  } else {
    // Else, get only one value per filter type (first checked input per type)
    const seenFilters = {};
    const $filterCheckboxes = $filterBar.querySelectorAll("input:checked");

    for (const $checkbox of $filterCheckboxes) {
      const key = $checkbox.closest("[data-filter]").dataset.filter;
      if (!seenFilters[key]) {
        seenFilters[key] = true;

        if (key === "category") newUrl.searchParams.set("c", $checkbox.value);
        else if (key === "cuisine") newUrl.searchParams.set("a", $checkbox.value);
        else if (key === "ingredient") newUrl.searchParams.set("i", $checkbox.value);
      }
    }

    const activeLetter = document.querySelector(".alphabet-btn.active");
    if (activeLetter) newUrl.searchParams.set("f", activeLetter.dataset.letter);
  }

  // Navigate to the updated URL
  window.location.href = newUrl.toString();
});





document.querySelectorAll(".alphabet-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".alphabet-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

$filterSearch.addEventListener("keydown", e => {
  if (e.key === "Enter") $filterSubmit.click();
});

$filterClear.addEventListener("click", function () {
  const $filterCheckboxes = $filterBar.querySelectorAll("input:checked");
  $filterCheckboxes?.forEach(elem => elem.checked = false);
  $filterSearch.value = "";
});

const queryStr = window.location.search.slice(1);
const queries = queryStr ? queryStr.split("&").map(i => i.split("=")) : [];
const $filterCount = document.querySelector("[data-filter-count]");
if (queries.length) {
  $filterCount.style.display = "block";
  $filterCount.innerHTML = queries.length;
} else {
  $filterCount.style.display = "none";
}

queries.forEach(i => {
  if (i[0] === "q") {
    $filterSearch.value = decodeURIComponent(i[1]);
  } else {
    const el = $filterBar.querySelector(`[value="${decodeURIComponent(i[1])}"]`);
    if (el) el.checked = true;
  }
});

$filterClear.addEventListener("click", function () {
  const $filterCheckboxes = $filterBar.querySelectorAll("input:checked");
  $filterCheckboxes.forEach(elem => elem.checked = false);
  $filterSearch.value = "";
  document.querySelectorAll(".alphabet-btn").forEach(b => b.classList.remove("active"));
  $filterCount.style.display = "none";
  window.location = "/recipes.html";
});

const $filterBtn = document.querySelector("[data-filter-btn]");
window.addEventListener("scroll", e => {
  $filterBtn.classList[window.scrollY >= 120 ? "add" : "remove"]("active");
});

const $gridList = document.querySelector("[data-grid-list]");
const $loadMore = document.querySelector("[data-load-more]");

const CONTAINER_MAX_WIDTH = 1200;
const CONTAINER_MAX_CARD = 6;
const PAGE_SIZE = 6;
let allMeals = [];
let currentPage = 0;
let requestedBefore = false;

function renderNextMeals() {
  const start = currentPage * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const mealsToRender = allMeals.slice(start, end);

  if (!mealsToRender.length) return;

  mealsToRender.forEach((item, index) => {
    const {
      strMealThumb: image,
      strMeal: title,
      idMeal
    } = item;

    const isSaved = window.localStorage.getItem(`cookio-recipe${idMeal}`);
    const $card = document.createElement("div");
    $card.classList.add("card");
    $card.style.animationDelay = `${100 * index}ms`;
    $card.innerHTML = `
      <figure class="card-media img-holder">
        <img src="${image}" alt="${title}" width="195" height="195" loading="lazy" class="img-cover">
      </figure>
      <div class="card-body">
        <h3 class="title-small">
          <a href="./detail.html?id=${idMeal}" class="card-link">${title ?? "Untitled"}</a>
        </h3>
        <div class="meta-wrapper">
          <div class="meta-item">
            <span class="material-symbols-outlined">schedule</span>
            <span class="label-medium">~</span>
          </div>
          <button class="icon-btn has-state ${isSaved ? "saved" : "removed"}"
                  aria-label="Add to saved recipes"
                  onclick="saveRecipe(this, '${idMeal}')">
            <span class="material-symbols-outlined bookmark-add">bookmark_add</span>
            <span class="material-symbols-outlined bookmark">bookmark</span>
          </button>
        </div>
      </div>`;

    $gridList.appendChild($card);
  });

  currentPage++;
}

(async function handleQueryFetch() {
  $gridList.innerHTML = $skeletonCard.repeat(12);
  requestedBefore = false;

  const queryStr = window.location.search.slice(1);
  const queries = queryStr ? queryStr.split("&").map(i => i.split("=")) : [];

  let apiUrl = "";

  if (!queries.length) {
    apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=Breakfast`;
  } else {
    let filterFound = false;

    for (const [key, value] of queries) {
      if (filterFound) break;

      if (key === "s") {
        apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`;
        filterFound = true;
      } else if (key === "c") {
        apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${value}`;
        filterFound = true;
      } else if (key === "a") {
        apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${value}`;
        filterFound = true;
      } else if (key === "i") {
        apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${value}`;
        filterFound = true;
      } else if (key === "f") {
        apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?f=${value}`;
        filterFound = true;
      }
    }
  }

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    $gridList.innerHTML = "";
    if (data.meals?.length) {
      allMeals = data.meals;
      currentPage = 0;
      renderNextMeals();
    } else {
      $loadMore.innerHTML = `<p class="body-medium info-text">No recipe found</p>`;
    }
  } catch (err) {
    $gridList.innerHTML = "<p class='body-medium info-text'>Failed to load recipes.</p>";
    console.error("Fetch error:", err);
  }
})();


window.addEventListener("scroll", async () => {
  if (
    $loadMore.getBoundingClientRect().top < window.innerHeight &&
    !requestedBefore && currentPage * PAGE_SIZE < allMeals.length
    ) {
    requestedBefore = true;
    $loadMore.innerHTML = $skeletonCard.repeat(
      Math.round(($loadMore.clientWidth / CONTAINER_MAX_WIDTH) * CONTAINER_MAX_CARD)
    );
    await new Promise(resolve => setTimeout(resolve, 500));
    renderNextMeals();
    $loadMore.innerHTML = "";
    requestedBefore = false;
  }

  if(currentPage * PAGE_SIZE >= allMeals.length) {
   $loadMore.innerHTML = "<p class='body-medium info-text'>No more recipes</p>";
  }

});




