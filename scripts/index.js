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

    // Map pour garder la version originale du texte (première occurrence)
    const originalCaseMap = new Map();

    recipesList.forEach(recipe => {
        recipe.ingredients.forEach(ing => {
            const normalizedIngredient = ing.ingredient.toLowerCase();
            if (!originalCaseMap.has(normalizedIngredient)) {
                originalCaseMap.set(normalizedIngredient, ing.ingredient);
            }
            ingredientSet.add(normalizedIngredient);
        });

        const normalizedAppliance = recipe.appliance.toLowerCase();
        if (!originalCaseMap.has(normalizedAppliance)) {
            originalCaseMap.set(normalizedAppliance, recipe.appliance);
        }
        applianceSet.add(normalizedAppliance);

        recipe.ustensils.forEach(ust => {
            const normalizedUstensil = ust.toLowerCase();
            if (!originalCaseMap.has(normalizedUstensil)) {
                originalCaseMap.set(normalizedUstensil, ust);
            }
            ustensilSet.add(normalizedUstensil);
        });
    });

    // Conversion des Sets en tableaux triés avec la casse d'origine
    const sortedIngredients = Array.from(ingredientSet)
        .sort()
        .map(item => originalCaseMap.get(item));
    const sortedAppliances = Array.from(applianceSet)
        .sort()
        .map(item => originalCaseMap.get(item));
    const sortedUstensils = Array.from(ustensilSet)
        .sort()
        .map(item => originalCaseMap.get(item));

    populateSelect('ingredient-filter', sortedIngredients, 'Ingrédient');
    populateSelect('appliance-filter', sortedAppliances, 'Appareil');
    populateSelect('ustensil-filter', sortedUstensils, 'Ustensiles');
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