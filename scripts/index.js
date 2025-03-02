import { recipes as rawRecipes } from "./recipes.js";
import { displayRecipes } from "./utils/display.js";
import { performSearch } from "./utils/search.js";
import { Recipe } from "./models/Recipe.js";
import { NormalizableItem } from "./models/NormalizableItem.js";

const recipes = rawRecipes.map(r => new Recipe(r.id, r.name, r.servings, r.time, r.description, r.image, r.ingredients, r.appliance, r.ustensils));

// Initialiser les tableaux de filtres sélectionnés au niveau global
const selectedFilters = {
    ingredients: new Set(),
    appliances: new Set(),
    ustensils: new Set()
};

let currentSearchQuery = '';

// Fonction pour mettre à jour la recherche
function updateSearch(event) {
    if (event) {
        currentSearchQuery = event.target.value.toLowerCase().trim();
    }
    
    // Ne lancer la recherche que si la requête est vide ou a au moins 3 caractères
    if (currentSearchQuery.length === 0 || currentSearchQuery.length >= 3) {
        const searchResults = performSearch(
            recipes,
            currentSearchQuery,
            Array.from(selectedFilters.ingredients),
            Array.from(selectedFilters.appliances),
            Array.from(selectedFilters.ustensils)
        );
        updateFiltersFromRecipes(searchResults);
        return searchResults;
    }
    return recipes;
}

document.addEventListener("DOMContentLoaded", () => {
    displayRecipes(recipes);

    // Ajouter l'écouteur d'événement pour la barre de recherche
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", (event) => {
        updateSearch(event);
    });

    populateFilters(recipes);
});

// Fonction pour créer un tag de filtre
function createFilterTag(filterId, value, displayText = value) {
    const tag = document.createElement('span');
    tag.classList.add('filter-tag');
    tag.textContent = displayText;

    const removeButton = document.createElement('button');
    removeButton.classList.add('close-tag');
    removeButton.innerHTML = '&times;';
    removeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        tag.remove();
        handleFilterRemoval(filterId, value);
    });

    tag.appendChild(removeButton);
    document.querySelector('.selected-filters').appendChild(tag);
}

// Fonction pour gérer la suppression d'un filtre
function handleFilterRemoval(filterId, value) {
    if (filterId === 'ingredient-filter') {
        selectedFilters.ingredients.delete(value);
    } else if (filterId === 'appliance-filter') {
        selectedFilters.appliances.delete(value);
    } else if (filterId === 'ustensil-filter') {
        selectedFilters.ustensils.delete(value);
    }

    updateSearch();
}

// Fonction pour gérer la sélection d'un filtre
function handleFilterSelection(filterId, value) {
    const selectedValue = value.toLowerCase();
    
    if (filterId === 'ingredient-filter') {
        selectedFilters.ingredients.add(selectedValue);
    } else if (filterId === 'appliance-filter') {
        selectedFilters.appliances.add(selectedValue);
    } else if (filterId === 'ustensil-filter') {
        selectedFilters.ustensils.add(selectedValue);
    }

    createFilterTag(filterId, selectedValue, value);
    updateSearch();
}

// Fonction pour mettre à jour les filtres à partir des recettes filtrées
function updateFiltersFromRecipes(recipesList) {
    // Sauvegarder les sélections actuelles
    const currentSelections = {
        ingredients: new Set(selectedFilters.ingredients),
        appliances: new Set(selectedFilters.appliances),
        ustensils: new Set(selectedFilters.ustensils)
    };

    // Vider les filtres existants
    selectedFilters.ingredients.clear();
    selectedFilters.appliances.clear();
    selectedFilters.ustensils.clear();

    // Mettre à jour les filtres avec les nouvelles recettes
    populateFilters(recipesList);

    // Restaurer les sélections qui sont toujours valides
    document.querySelector('.selected-filters').innerHTML = '';
    
    currentSelections.ingredients.forEach(ing => {
        const option = document.querySelector(`#ingredient-filter .filter-options li[data-value="${ing}"]`);
        if (option) {
            selectedFilters.ingredients.add(ing);
            createFilterTag('ingredient-filter', ing, option.textContent);
        }
    });

    currentSelections.appliances.forEach(app => {
        const option = document.querySelector(`#appliance-filter .filter-options li[data-value="${app}"]`);
        if (option) {
            selectedFilters.appliances.add(app);
            createFilterTag('appliance-filter', app, option.textContent);
        }
    });

    currentSelections.ustensils.forEach(ust => {
        const option = document.querySelector(`#ustensil-filter .filter-options li[data-value="${ust}"]`);
        if (option) {
            selectedFilters.ustensils.add(ust);
            createFilterTag('ustensil-filter', ust, option.textContent);
        }
    });
}

function populateFilters(recipesList) {
    const ingredientSet = new Set();
    const applianceSet = new Set();
    const ustensilSet = new Set();

    // Map pour garder la version originale du texte (première occurrence)
    const originalCaseMap = new Map();

    recipesList.forEach(recipe => {
        recipe.ingredients.forEach(ing => {
            const normalizedIngredient = ing.getNormalizedName();
            if (!originalCaseMap.has(normalizedIngredient)) {
                originalCaseMap.set(normalizedIngredient, ing.getFormattedName());
            }
            ingredientSet.add(normalizedIngredient);
        });

        recipe.appliances.forEach(app => {
            const normalizedAppliance = app.getNormalizedName();
            if (!originalCaseMap.has(normalizedAppliance)) {
                originalCaseMap.set(normalizedAppliance, app.getFormattedName());
            }
            applianceSet.add(normalizedAppliance);
        });

        recipe.ustensils.forEach(ust => {
            const normalizedUstensil = ust.getNormalizedName();
            if (!originalCaseMap.has(normalizedUstensil)) {
                originalCaseMap.set(normalizedUstensil, ust.getFormattedName());
            }
            ustensilSet.add(normalizedUstensil);
        });
    });

    // Conversion des Sets en tableaux triés avec la casse d'origine
    const sortedIngredients = Array.from(ingredientSet)
        .sort((a, b) => NormalizableItem.normalize(originalCaseMap.get(a))
            .localeCompare(NormalizableItem.normalize(originalCaseMap.get(b))))
        .map(item => originalCaseMap.get(item));

    const sortedAppliances = Array.from(applianceSet)
        .sort((a, b) => NormalizableItem.normalize(originalCaseMap.get(a))
            .localeCompare(NormalizableItem.normalize(originalCaseMap.get(b))))
        .map(item => originalCaseMap.get(item));

    const sortedUstensils = Array.from(ustensilSet)
        .sort((a, b) => NormalizableItem.normalize(originalCaseMap.get(a))
            .localeCompare(NormalizableItem.normalize(originalCaseMap.get(b))))
        .map(item => originalCaseMap.get(item));

    populateDropdown('ingredient-filter', sortedIngredients);
    populateDropdown('appliance-filter', sortedAppliances);
    populateDropdown('ustensil-filter', sortedUstensils);
}

function populateDropdown(dropdownId, options) {
    const dropdown = document.getElementById(dropdownId);
    const filterInput = dropdown.querySelector('.filter-input');
    const filterOptions = dropdown.querySelector('.filter-options');

    function createOptionElement(option, isSelected = false) {
        const li = document.createElement('li');
        li.textContent = option;
        li.dataset.value = option.toLowerCase();
        
        if (isSelected) {
            li.classList.add('selected');
        } else {
            li.addEventListener('click', () => {
                handleFilterSelection(dropdownId, option);
            });
        }

        return li;
    }

    function updateDropdownDisplay(searchTerm = '') {
        // Vider la liste
        filterOptions.innerHTML = '';

        // Normaliser le terme de recherche
        const normalizedSearchTerm = NormalizableItem.normalize(searchTerm);

        // Filtrer les options en fonction du terme de recherche
        const filteredOptions = options.filter(option =>
            NormalizableItem.normalize(option).includes(normalizedSearchTerm)
        );

        // Ajouter d'abord les éléments sélectionnés
        filteredOptions.forEach(option => {
            const isSelected = (
                (dropdownId === 'ingredient-filter' && selectedFilters.ingredients.has(option.toLowerCase())) ||
                (dropdownId === 'appliance-filter' && selectedFilters.appliances.has(option.toLowerCase())) ||
                (dropdownId === 'ustensil-filter' && selectedFilters.ustensils.has(option.toLowerCase()))
            );

            if (isSelected) {
                filterOptions.appendChild(createOptionElement(option, true));
            }
        });

        // Puis ajouter les éléments non sélectionnés
        filteredOptions.forEach(option => {
            const isSelected = (
                (dropdownId === 'ingredient-filter' && selectedFilters.ingredients.has(option.toLowerCase())) ||
                (dropdownId === 'appliance-filter' && selectedFilters.appliances.has(option.toLowerCase())) ||
                (dropdownId === 'ustensil-filter' && selectedFilters.ustensils.has(option.toLowerCase()))
            );

            if (!isSelected) {
                filterOptions.appendChild(createOptionElement(option, false));
            }
        });
    }

    // Initialiser l'affichage
    updateDropdownDisplay();

    // Ajouter l'écouteur d'événements pour la recherche dans le dropdown
    filterInput.addEventListener('input', (event) => {
        const searchValue = event.target.value.toLowerCase();
        if (searchValue.length >= 3 || searchValue.length === 0) {
            updateDropdownDisplay(searchValue);
        }
    });
}