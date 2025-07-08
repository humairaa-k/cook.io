
"use strict";

import { fetchData } from "./api.js";

/**
 * Add an event listener to multiple elements.
 * @param {*} $elements NodeList
 * @param {*} eventType event type string
 * @param {*} callback callback function
 */
window.addEventOnElements = ($elements, eventType, callback) => {
  for (const $element of $elements) {
    $element.addEventListener(eventType, callback);
  }
};

// ✅ Optional default query for TheMealDB
export const cardQueries = [
  ["s", "chicken"] // Default search term
];



 //skeleton card

 export const $skeletonCard = ` 
  <div class="card skeleton-card">
                     <div class="skeleton card-banner"></div>
                     
                     <div class="card-body">
                        <div class="skeleton card-title"></div>
                          <div class="skeleton card-text"></div>  
                     </div>
                   
               </div>`;

const ROOT = "https://www.themealdb.com/api/json/v1/1";

window.saveRecipe = function (element, recipeId) {
  const key = `cookio-recipe${recipeId}`;
  const isSaved = window.localStorage.getItem(key);

  const previousAccessPoint = window.ACCESS_POINT;
  window.ACCESS_POINT = `${ROOT}/lookup.php`;

  if (!isSaved) {
    // Save the recipe
    fetchData([`lookup.php?i=${recipeId}`], function (data) {
      window.localStorage.setItem(key, JSON.stringify(data));
      element.classList.add("saved");
      element.classList.remove("removed");
      showNotification("Added to recipe book");

      //console.log(`✅ Saved recipe ${recipeId}`);
    });
  } else {
    // Unsave the recipe
    window.localStorage.removeItem(key);
    element.classList.remove("saved");
    element.classList.add("removed");
    showNotification("Removed from recipe book");

    //console.log(`❌ Removed recipe ${recipeId}`);
  }

  window.ACCESS_POINT = previousAccessPoint;

  // 🧠 Show currently saved recipes (filtered from all keys)
  const savedKeys = Object.keys(localStorage).filter(k => k.startsWith("cookio-recipe"));
  console.log("📦 Saved list:", savedKeys);
};

 const /*{NodeElement}*/ $snackbarContainer = document.createElement("div");
 $snackbarContainer.classList.add("snackbar-container");
 document.body.appendChild($snackbarContainer);

 function showNotification(message) {
  const /*{nodeElement}*/ $snackbar = document.createElement("div");
  $snackbar.classList.add("snackbar");
  $snackbar.innerHTML= ` 
       <p class="body-medium">${message}</p>`;
       $snackbarContainer.appendChild($snackbar);
       $snackbar.addEventListener("animationend", e => 
         $snackbarContainer.removeChild($snackbar));
 }


 



  
 