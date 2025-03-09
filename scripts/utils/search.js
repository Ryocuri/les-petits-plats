import { displayRecipes } from "./display.js";
import { NormalizeItem } from "../utils/NormalizeItem.js";
import { MIN_SEARCH_LENGTH } from "./constants.js";

export function performSearch(recipes, query, selectedIngredients, selectedAppliances, selectedUstensils) {
    // Commencer avec toutes les recettes
    let filteredRecipes = [...recipes];

    // Vérifier si des filtres sont sélectionnés
    const hasFilters = selectedIngredients.length > 0 || selectedAppliances.length > 0 || selectedUstensils.length > 0;

    // Fonction pour vérifier si un texte normalisé contient la requête
    const containsQuery = (text, normalizedQuery) => {
        return NormalizeItem.apply(text).includes(normalizedQuery);
    };

    // Fonction utilitaire pour vérifier si un élément sélectionné correspond à un élément dans la liste
    const isItemMatched = (selectedItem, itemsList, propertyAccessor) => {
        const normalizedSelectedItem = NormalizeItem.apply(selectedItem);
        return itemsList.some(item => 
            NormalizeItem.apply(propertyAccessor(item)) === normalizedSelectedItem
        );
    };

    // Fonction spécifique pour comparer un appareil sélectionné avec un appareil de recette
    const isApplianceMatched = (selectedApp, appliance) => {
        return appliance && NormalizeItem.apply(appliance.name) === NormalizeItem.apply(selectedApp);
    };

    // Appliquer la recherche textuelle si elle existe (longueur ≥ 3 ou si des filtres sont sélectionnés)
    if (query && (query.length >= MIN_SEARCH_LENGTH || hasFilters)) {
        const normalizedQuery = NormalizeItem.apply(query);
        // Filtrer les recettes qui contiennent le terme de recherche
        filteredRecipes = recipes.filter(recipe =>
            containsQuery(recipe.name, normalizedQuery) ||
            recipe.ingredients.some(ing => 
                containsQuery(ing.ingredient, normalizedQuery)
            ) ||
            containsQuery(recipe.description, normalizedQuery)
        );
    }

    // Ensuite, appliquer les filtres sur les recettes déjà filtrées par la recherche
    if (selectedIngredients.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            selectedIngredients.every(selectedIng => 
                isItemMatched(selectedIng, recipe.ingredients, ing => ing.ingredient)
            )
        );
    }

    if (selectedAppliances.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            selectedAppliances.every(selectedApp => 
                isApplianceMatched(selectedApp, recipe.appliances[0])
            )
        );
    }

    if (selectedUstensils.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            selectedUstensils.every(selectedUst => 
                isItemMatched(selectedUst, recipe.ustensils, ust => ust.name)
            )
        );
    }

    displayRecipes(filteredRecipes);
    return filteredRecipes;
}