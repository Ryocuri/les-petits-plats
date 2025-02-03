import { recipes } from "./recipes.js"; // Assure-toi que recipes.js utilise `export const recipes = [...]`

document.addEventListener("DOMContentLoaded", () => {
    displayRecipes(recipes);
    setupSearch();
});

function displayRecipes(recipesToDisplay) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";
    recipesToDisplay.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.innerHTML = `
            <img src="assets/images/${recipe.image}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
            <p><strong>Temps:</strong> ${recipe.time} min</p>
            <p>${recipe.description}</p>
        `;
        resultsContainer.appendChild(recipeCard);
    });
}

function setupSearch() {
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filteredRecipes = recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(query) ||
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(query))
        );
        displayRecipes(filteredRecipes);
    });
}
