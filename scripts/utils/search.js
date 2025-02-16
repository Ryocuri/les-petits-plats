import { displayRecipes } from "./display.js";

export function setupSearch(recipes) {
    document.getElementById("search").addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 3) {
            displayRecipes(recipes);
            return;
        }

        displayRecipes(recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(query) ||
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(query))
        ));
    });
}