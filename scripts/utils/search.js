import { displayRecipes } from "./display.js";

export function performSearch(recipes, query, selectedIngredients, selectedAppliances, selectedUstensils) {
    let filteredRecipes = recipes;

    // Filtre par texte (si plus de 3 caractères)
    if (query.length >= 3) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.name.toLowerCase().includes(query) ||
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(query)) ||
            recipe.description.toLowerCase().includes(query)
        );
    }

    // Filtre par ingrédients
    if (selectedIngredients.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            selectedIngredients.every(selectedIng =>
                recipe.ingredients.some(ing =>
                    ing.ingredient.toLowerCase() === selectedIng.toLowerCase()
                )
            )
        );
    }

    // Filtre par appareils
    if (selectedAppliances.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            selectedAppliances.some(selectedApp =>
                recipe.appliance.toLowerCase() === selectedApp.toLowerCase()
            )
        );
    }

    // Filtre par ustensiles
    if (selectedUstensils.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            selectedUstensils.every(selectedUst =>
                recipe.ustensils.some(ust =>
                    ust.toLowerCase() === selectedUst.toLowerCase()
                )
            )
        );
    }

    displayRecipes(filteredRecipes);
}