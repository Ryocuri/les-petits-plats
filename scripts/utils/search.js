import { displayRecipes } from "./display.js";
import { NormalizableItem } from "../models/NormalizableItem.js";

export function performSearch(recipes, query, selectedIngredients, selectedAppliances, selectedUstensils) {
    // Commencer avec toutes les recettes
    let filteredRecipes = [...recipes];

    // Appliquer d'abord la recherche textuelle si elle existe
    if (query && query.length >= 3) {
        const normalizedQuery = NormalizableItem.normalize(query);
        // Filtrer les recettes qui contiennent le terme de recherche
        filteredRecipes = recipes.filter(recipe =>
            NormalizableItem.normalize(recipe.name).includes(normalizedQuery) ||
            recipe.ingredients.some(ing => 
                NormalizableItem.normalize(ing.ingredient).includes(normalizedQuery)
            ) ||
            NormalizableItem.normalize(recipe.description).includes(normalizedQuery)
        );
    }

    // Ensuite, appliquer les filtres sur les recettes déjà filtrées par la recherche
    if (selectedIngredients.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            selectedIngredients.every(selectedIng => {
                const normalizedSelectedIng = NormalizableItem.normalize(selectedIng);
                return recipe.ingredients.some(ing => 
                    NormalizableItem.normalize(ing.ingredient) === normalizedSelectedIng
                );
            })
        );
    }

    if (selectedAppliances.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            selectedAppliances.every(selectedApp => {
                const normalizedSelectedApp = NormalizableItem.normalize(selectedApp);
                return recipe.appliances[0] && 
                    NormalizableItem.normalize(recipe.appliances[0].name) === normalizedSelectedApp;
            })
        );
    }

    if (selectedUstensils.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            selectedUstensils.every(selectedUst => {
                const normalizedSelectedUst = NormalizableItem.normalize(selectedUst);
                return recipe.ustensils.some(ust =>
                    NormalizableItem.normalize(ust.name) === normalizedSelectedUst
                );
            })
        );
    }

    displayRecipes(filteredRecipes);
    return filteredRecipes;
}