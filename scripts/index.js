import { recipes as rawRecipes } from "./recipes.js";
import { displayRecipes } from "./utils/display.js";
import { setupSearch } from "./utils/search.js";
import { Recipe } from "./models/Recipe.js";

const recipes = rawRecipes.map(r => new Recipe(r.id, r.name, r.servings, r.time, r.description, r.image, r.ingredients, r.appliance, r.ustensils));

document.addEventListener("DOMContentLoaded", () => {
    displayRecipes(recipes);
    setupSearch(recipes);
    populateFilters(recipes);
});

// Fonction pour générer les options des filtres dynamiquement
function populateFilters(recipesList) {
    const ingredientSet = new Set();
    const applianceSet = new Set();
    const ustensilSet = new Set();

    recipesList.forEach(recipe => {
        recipe.ingredients.forEach(ing => ingredientSet.add(ing.ingredient));
        applianceSet.add(recipe.appliance);
        recipe.ustensils.forEach(ust => ustensilSet.add(ust));
    });

    // On passe maintenant la valeur par défaut souhaitée en second paramètre
    populateSelect('ingredient-filter', ingredientSet, 'Ingrédient');
    populateSelect('appliance-filter', applianceSet, 'Appareil');
    populateSelect('ustensil-filter', ustensilSet, 'Ustensiles');
}

// Fonction modifiée pour accepter le texte par défaut
function populateSelect(selectId, values, defaultText) {
    const select = document.getElementById(selectId);
    select.innerHTML = `<option value="">${defaultText}</option>`;
    values.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });
}