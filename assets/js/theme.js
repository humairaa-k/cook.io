/**
 * @license MIT
 * @author codewithsadee <mohammadsadee24@gmail.com>
 * @copyright codewithsadee 2023
 */

"use strict";

const $HTML = document.documentElement;    // Shortcut: Access root HTML element
// Check if user's system prefers dark mode (true/false)
const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;//watchMedia is a builtin browser api

 if(sessionStorage.getItem("theme")){
  $HTML.dataset.theme = sessionStorage.getItem("theme");
 }else{
    $HTML.dataset.theme = isDark? 'dark':'light';
 }

//sessionStorage stores data for the duration of the page session (until the tab or browser is closed).
//getItem is a method of the sessionStorage (or localStorage) Web Storage API that retrieves the value associated with a given key.

 let isPressed = false;  //false means not pressed
 const changeTheme = function () {
 isPressed = isPressed ?false : true;    //toggler
 this.setAttribute("aria-pressed", isPressed); // Updates accessibility state for screen readers to indicate if the toggle button is pressed (true) or not (false)
 $HTML.setAttribute("data-theme", ($HTML.dataset.theme === "light") ?'dark':'light');
 sessionStorage.setItem("theme",$HTML.dataset.theme) //to store the color even when refreshed
 }


 window.addEventListener('load', () => { //makes sure the button works if the page is fully load
  const $themeBtn = document.querySelector('[data-theme-btn]'); //nodeElement
  $themeBtn.addEventListener('click',changeTheme);
 })