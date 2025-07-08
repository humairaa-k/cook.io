"use strict";

window.ACCESS_POINT = "https://www.themealdb.com/api/json/v1/1/search.php";
// const API_KEY = "2e132a593b5245be8aa8bfabc5458edc";
// const TYPE = "public";

/**
 * @param {Array} queries - query array, e.g. ["s=chicken"]
 * @param {Function} successCallback - callback on success
 */
const ACCESS_POINT = "https://www.themealdb.com/api/json/v1/1/";

export const fetchData = async function (queries, successCallback) {
  console.log("fetchData called with:", queries);
  const query = queries?.join("&");
  
  // ✅ If it's already got 'php' in the query, don't add "?"
  const url = query.includes(".php") ? `${ACCESS_POINT}${query}` : `${ACCESS_POINT}?${query}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    const data = await response.json();
    successCallback(data);
  } catch (err) {
    console.error(err.message);
  }
};


//This function is designed to build a query string from an array of parameters and then prepare it for a fetch request by encoding special characters.
  
