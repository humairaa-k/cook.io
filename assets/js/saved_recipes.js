"use strict";

/**
* Import
*/

const /*{Array}*/ savedRecipes = Object.keys(window.localStorage).filter(item => {
  return item.startsWith("cookio-recipe");
});

const /*{nodeElement}*/ $savedRecipeContainer = document.querySelector("[data-saved-recipe-container]");

if (!$savedRecipeContainer) {
  console.error("Element with [data-saved-recipe-container] not found in DOM");
} else {
  $savedRecipeContainer.innerHTML = `<h2 class="headline-small section-title">All Saved Recipes</h2>`;

  const /*{nodeElement}*/ $gridList = document.createElement("div");
  $gridList.classList.add("grid-list");

  if (savedRecipes.length) {
    savedRecipes.forEach((key, index) => {
      try {
        const raw = JSON.parse(window.localStorage.getItem(key));
        const parsed = raw.meals ? raw.meals[0] : raw; // ✅ Fix: unwrap meals array if present

        if (!parsed || !parsed.strMeal || !parsed.strMealThumb || !parsed.idMeal) {
          console.warn(`Invalid data for key: ${key}`);
          return;
        }

        const {
          strMealThumb: image,
          strMeal: title,
          idMeal
        } = parsed;

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
                <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
                <span class="label-medium">~</span>
              </div>

              <button class="icon-btn has-state ${isSaved ? "saved" : "removed"}"
                aria-label="Add to saved recipes"
                onclick="saveRecipe(this, '${idMeal}')">

                <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
                <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
              </button>
            </div>
          </div>
        `;

        $gridList.appendChild($card);
      } catch (err) {
        console.error(`Error parsing localStorage item for key ${key}:`, err);
      }
    });

    $savedRecipeContainer.appendChild($gridList);
  } else {
    $savedRecipeContainer.innerHTML += `<p>No saved recipes found.</p>`;
  }
}




