"use strict";

/**
 * Import
 */
import { fetchData } from "./api.js";

/**
 * Render data
 */
document.addEventListener("DOMContentLoaded", () => {
  const $detailContainer = document.querySelector("[data-detail-container]");

  // ✅ Get meal ID after DOM is loaded
  const mealId = new URLSearchParams(window.location.search).get("id");
  console.log("Meal ID from URL:", mealId);

  if (!mealId) {
    console.warn("❌ No meal ID found in URL");
    $detailContainer.innerHTML = `<p class='body-medium info-text'>No meal ID provided</p>`;
    return;
  }


fetchData([`lookup.php?i=${mealId}`], data => {
    if (!data.meals || data.meals.length === 0) {
      console.warn("❌ No meal found!");
      $detailContainer.innerHTML = `<p class='body-medium info-text'>No recipe found.</p>`;
      return;
    }

    const meal = data.meals[0];

    const {
      idMeal,
      strMeal: title,
      strMealThumb: image,
      strCategory: category,
      strArea: area,
      strInstructions: instructions,
      strTags,
      strYoutube: youtube,
      strSource: source
    } = meal;

    // Set page title
    document.title = `${title} - Cookio`;

    // Generate ingredients list
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${ingredient} - ${measure}`);
      }
    }

    const tags = strTags ? strTags.split(",").map(tag => tag.trim()) : [];

    let tagElements = "";
    let ingredientItems = "";

    const isSaved = window.localStorage.getItem(`cookio-recipe${idMeal}`);

    tags.forEach(tag => {
      tagElements += `<a href="./recipes.html?s=${encodeURIComponent(tag)}" class="filter-chip label-large has-state">${tag}</a>
`;
    });

    ingredients.forEach(item => {
      ingredientItems += `<li class="ingr-item">${item}</li>`;
    });

    $detailContainer.innerHTML = `
      <figure class="detail-banner img-holder">
        <img src="${image}" alt="${title}" width="600" height="400" class="img-cover">
      </figure>

      <div class="detail-content">
        <div class="title-wrapper">
          <h1 class="display-small">${title ?? "Untitled"}</h1>

          <button class="btn btn-secondary has-icon has-state ${isSaved ? "saved" : "removed"}" onclick="saveRecipe(this, '${idMeal}')">
            <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
            <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
            <span class="label-large save-text">Save</span>
            <span class="label-large unsaved-text">Unsaved</span>
          </button>
        </div>

        <div class="detail-author label-large">
          <span class="span">Category:</span> ${category}
        </div>

        <div class="detail-stats">
          <div class="stats-item">
            <span class="display-medium">${ingredients.length}</span>
            <span class="label-medium">Ingredients</span>
          </div>
          <div class="stats-item">
            <span class="display-medium">${area}</span>
            <span class="label-medium">Cuisine</span>
          </div>
          <div class="stats-item">
            <span class="display-medium">${category}</span>
            <span class="label-medium">Category</span>
          </div>
        </div>

        ${tagElements ? `<div class="tag-list">${tagElements}</div>` : ""}

        <h2 class="title-medium ingr-title">
          Ingredients
          <span class="label-medium">for 1 serving</span>
        </h2>

        <ul class="body-large ingr-list">${ingredientItems}</ul>

        <h2 class="title-medium">Instructions</h2>
        <p class="body-large">${instructions}</p>

        ${youtube ? `<a href="${youtube}" target="_blank" class="external-link">Watch on YouTube</a>` : ""}

      </div>
    `;
  });
});

