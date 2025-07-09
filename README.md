# 🍽️ Cooki.io - Recipe Explorer

A responsive recipe browser web app built with **HTML, SCSS, JavaScript**, and powered by **TheMealDB API**.  
Users can explore recipes by **category, cuisine, ingredient**, alphabetically, or by **search**.

---

## 🚀 Features

- 🔍 Search meals by name
- 🥗 Filter by:
  - Category
  - Cuisine (Area)
  - Main Ingredient
  - First letter (A-Z)
- 📱 Mobile-friendly filter sidebar
- 💾 Save recipes to bookmarks (using localStorage)
- 🕹️ Lazy loading (infinite scroll)
- 🧪 Skeleton loading animation
- 🌙 Light/Dark theme toggle

---

## ⚠️ Limitations

- The **cooking time feature** is included in code design, but **TheMealDB API does not provide actual cooking/prep time**, so that data is not displayed.
- "Diet Preference" buttons like Vegan/Gluten-Free are UI-only for now and disabled — future enhancement planned.

---

## 📁 Folder Structure

📁 cooki.io/
├── index.html
├── recipes.html
├── detail.html
├── saved-recipes.html
└── assets/
    ├── css/
    │   ├── style.css
    │   ├── abstracts/
    │   ├── base/
    │   ├── components/
    │   ├── layout/
    │   └── pages/
    ├── js/
    │   ├── api.js
    │   ├── global.js
    │   ├── home.js
    │   ├── recipes.js
    │   ├── details.js
    │   ├── theme.js
    │   ├── theme.js
    │   └── saved_recipes.js
    └── images/
        └── (icons, logos, food images, etc.)

## 🧱 SCSS Structure

Follows a modular SCSS architecture using folders:

- `abstracts/` – Variables, mixins, functions
- `base/` – Reset, typography, base styles
- `components/` – UI components (buttons, cards, etc.)
- `layout/` – Header, footer, layout grid
- `pages/` – Page-specific styles like `home.scss`, `recipes.scss`

---

## 🚧 Future Improvements

- 🥑 Diet filters (e.g., Vegan, Gluten-Free) — UI exists, functionality coming soon!
- 📝 Pagination controls (instead of infinite scroll)
- 📦 Backend for saving user preferences or meal ratings
- 🔐 Login/registration system

---

## 💡 How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/humairaa-k/cooki.io.git

2. Open the project folder in your code editor (like VS Code).

3. Open index.html or recipes.html with Live Server, or drag the HTML file into your browser.


👩‍💻 Author
Made with 💜 by Humairaa K.
