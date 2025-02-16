import { displayRecipes } from "./display.js";

export function setupSearch(recipes) {
    const searchInput = document.getElementById("search");
    const ingredientFilter = document.getElementById("ingredient-filter");
    const applianceFilter = document.getElementById("appliance-filter");
    const ustensilFilter = document.getElementById("ustensil-filter");

    // Fonction pour effectuer la recherche avec tous les critères
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        const selectedIngredient = ingredientFilter.value.toLowerCase();
        const selectedAppliance = applianceFilter.value.toLowerCase();
        const selectedUstensil = ustensilFilter.value.toLowerCase();

        let filteredRecipes = recipes;

        // Filtre par texte (si plus de 3 caractères)
        if (query.length >= 3) {
            filteredRecipes = filteredRecipes.filter(recipe =>
                recipe.name.toLowerCase().includes(query) ||
                recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(query))
            );
        }

        // Filtre par ingrédient
        if (selectedIngredient) {
            filteredRecipes = filteredRecipes.filter(recipe =>
                recipe.ingredients.some(ing =>
                    ing.ingredient.toLowerCase() === selectedIngredient
                )
            );
        }

        // Filtre par appareil
        if (selectedAppliance) {
            filteredRecipes = filteredRecipes.filter(recipe =>
                recipe.appliance.toLowerCase() === selectedAppliance
            );
        }

        // Filtre par ustensile
        if (selectedUstensil) {
            filteredRecipes = filteredRecipes.filter(recipe =>
                recipe.ustensils.some(ust =>
                    ust.toLowerCase() === selectedUstensil
                )
            );
        }

        displayRecipes(filteredRecipes);
    }

    // Écouteurs d'événements
    searchInput.addEventListener("input", performSearch);
    ingredientFilter.addEventListener("change", performSearch);
    applianceFilter.addEventListener("change", performSearch);
    ustensilFilter.addEventListener("change", performSearch);
}