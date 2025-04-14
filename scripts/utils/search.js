import { displayRecipes } from "./display.js";
import { NormalizeItem } from "./NormalizeItem.js";
import { MIN_SEARCH_LENGTH } from "./constants.js";

export function performSearch(recipes, query, selectedIngredients, selectedAppliances, selectedUstensils) {
    // Commencer avec toutes les recettes
    let filteredRecipes = [];
    for (let i = 0; i < recipes.length; i++) {
        filteredRecipes.push(recipes[i]);
    }

    // Vérifier si des filtres sont sélectionnés
    const hasFilters = selectedIngredients.length > 0 || selectedAppliances.length > 0 || selectedUstensils.length > 0;

    // Fonction pour vérifier si un texte normalisé contient la requête
    const containsQuery = function(text, normalizedQuery) {
        return NormalizeItem.apply(text).indexOf(normalizedQuery) !== -1;
    };

    // Fonction utilitaire pour vérifier si un élément sélectionné correspond à un élément dans la liste
    const isItemMatched = function(selectedItem, itemsList, propertyAccessor) {
        const normalizedSelectedItem = NormalizeItem.apply(selectedItem);

        for (let i = 0; i < itemsList.length; i++) {
            if (NormalizeItem.apply(propertyAccessor(itemsList[i])) === normalizedSelectedItem) {
                return true;
            }
        }
        return false;
    };

    // Fonction spécifique pour comparer un appareil sélectionné avec un appareil de recette
    const isApplianceMatched = function(selectedApp, appliance) {
        return appliance && NormalizeItem.apply(appliance.name) === NormalizeItem.apply(selectedApp);
    };

    // Appliquer la recherche textuelle si elle existe (longueur ≥ 3 ou si des filtres sont sélectionnés)
    if (query ? query.length >= MIN_SEARCH_LENGTH : hasFilters) {
        const normalizedQuery = NormalizeItem.apply(query);

        // Filtrer les recettes qui contiennent le terme de recherche
        let searchFilteredRecipes = [];

        for (let i = 0; i < recipes.length; i++) {
            let recipe = recipes[i];
            let recipeMatches = false;

            // Vérifier si le nom de la recette contient la requête
            if (containsQuery(recipe.name, normalizedQuery)) {
                recipeMatches = true;
            }
            // Vérifier si la description contient la requête
            else if (containsQuery(recipe.description, normalizedQuery)) {
                recipeMatches = true;
            }
            // Vérifier si un des ingrédients contient la requête
            else {
                for (let j = 0; j < recipe.ingredients.length; j++) {
                    if (containsQuery(recipe.ingredients[j].ingredient, normalizedQuery)) {
                        recipeMatches = true;
                        break;
                    }
                }
            }

            if (recipeMatches) {
                searchFilteredRecipes.push(recipe);
            }
        }

        filteredRecipes = searchFilteredRecipes;
    }

    // Ensuite, appliquer les filtres sur les recettes déjà filtrées par la recherche
    if (selectedIngredients.length > 0) {
        let ingredientFilteredRecipes = [];

        for (let i = 0; i < filteredRecipes.length; i++) {
            let recipe = filteredRecipes[i];
            let allIngredientsMatch = true;

            for (let j = 0; j < selectedIngredients.length; j++) {
                let selectedIng = selectedIngredients[j];
                let ingredientMatched = false;

                for (let k = 0; k < recipe.ingredients.length; k++) {
                    let ing = recipe.ingredients[k];
                    if (NormalizeItem.apply(ing.ingredient) === NormalizeItem.apply(selectedIng)) {
                        ingredientMatched = true;
                        break;
                    }
                }

                if (!ingredientMatched) {
                    allIngredientsMatch = false;
                    break;
                }
            }

            if (allIngredientsMatch) {
                ingredientFilteredRecipes.push(recipe);
            }
        }

        filteredRecipes = ingredientFilteredRecipes;
    }

    if (selectedAppliances.length > 0) {
        let applianceFilteredRecipes = [];

        for (let i = 0; i < filteredRecipes.length; i++) {
            let recipe = filteredRecipes[i];
            let allAppliancesMatch = true;

            for (let j = 0; j < selectedAppliances.length; j++) {
                let selectedApp = selectedAppliances[j];

                if (!isApplianceMatched(selectedApp, recipe.appliances[0])) {
                    allAppliancesMatch = false;
                    break;
                }
            }

            if (allAppliancesMatch) {
                applianceFilteredRecipes.push(recipe);
            }
        }

        filteredRecipes = applianceFilteredRecipes;
    }

    if (selectedUstensils.length > 0) {
        let ustensilFilteredRecipes = [];

        for (let i = 0; i < filteredRecipes.length; i++) {
            let recipe = filteredRecipes[i];
            let allUstensilsMatch = true;

            for (let j = 0; j < selectedUstensils.length; j++) {
                let selectedUst = selectedUstensils[j];
                let ustensilMatched = false;

                for (let k = 0; k < recipe.ustensils.length; k++) {
                    let ust = recipe.ustensils[k];
                    if (NormalizeItem.apply(ust.name) === NormalizeItem.apply(selectedUst)) {
                        ustensilMatched = true;
                        break;
                    }
                }

                if (!ustensilMatched) {
                    allUstensilsMatch = false;
                    break;
                }
            }

            if (allUstensilsMatch) {
                ustensilFilteredRecipes.push(recipe);
            }
        }

        filteredRecipes = ustensilFilteredRecipes;
    }

    displayRecipes(filteredRecipes);
    return filteredRecipes;
}