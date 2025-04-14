import { recipes as rawRecipes } from "./recipes.js";
import { displayRecipes } from "./utils/display.js";
import { performSearch } from "./utils/search.js";
import { Recipe } from "./models/Recipe.js";
import { NormalizeItem } from "./utils/NormalizeItem.js";
import { MIN_SEARCH_LENGTH, SELECTORS } from "./utils/constants.js";

const recipes = rawRecipes.map(r => new Recipe(r.id, r.name, r.servings, r.time, r.description, r.image, r.ingredients, r.appliance, r.ustensils));

// Initialiser les tableaux de filtres sélectionnés au niveau global
const selectedFilters = {
    ingredients: new Set(),
    appliances: new Set(),
    ustensils: new Set()
};

let currentSearchQuery = '';

// Fonction pour mettre à jour le compteur de recettes
function updateRecipeCount(count) {
    const recipeCountElement = document.querySelector('.recipe-count');
    if (recipeCountElement) {
        // Affiche le nombre réel de recettes seulement si des filtres sont appliqués ou si une recherche est active
        const hasFilters = selectedFilters.ingredients.size > 0 ||
                          selectedFilters.appliances.size > 0 ||
                          selectedFilters.ustensils.size > 0;
        
        if (hasFilters || (currentSearchQuery && currentSearchQuery.length > 0)) {
            recipeCountElement.textContent = `${count} recette${count > 1 ? 's' : ''}`;
        } else {
            // Sinon, affiche toujours "1500 recettes" par défaut
            recipeCountElement.textContent = "1500 recettes";
        }
    }
}

// Fonction pour mettre à jour la recherche
function updateSearch(event) {
    if (event) {
        currentSearchQuery = event.target.value.toLowerCase().trim();
    }
    
    // Vérifier si des filtres sont sélectionnés
    const hasFilters = selectedFilters.ingredients.size > 0 || 
                      selectedFilters.appliances.size > 0 || 
                      selectedFilters.ustensils.size > 0;
    
    // Ne lancer la recherche que si: requête vide, requête >= 3 caractères, ou si des filtres sont sélectionnés
    if (currentSearchQuery.length === 0 || currentSearchQuery.length >= MIN_SEARCH_LENGTH || hasFilters) {
        const searchResults = performSearch(
            recipes,
            currentSearchQuery,
            Array.from(selectedFilters.ingredients),
            Array.from(selectedFilters.appliances),
            Array.from(selectedFilters.ustensils)
        );
        updateFiltersFromRecipes(searchResults);
        updateRecipeCount(searchResults.length);
        return searchResults;
    }
    // Si la requête est trop courte et qu'il n'y a pas de filtres,
    // afficher toutes les recettes et mettre à jour les filtres
    displayRecipes(recipes);
    updateFiltersFromRecipes(recipes);
    updateRecipeCount(recipes.length);
    return recipes;
}

document.addEventListener("DOMContentLoaded", () => {
    displayRecipes(recipes);
    updateRecipeCount(recipes.length);

    // Ajouter l'écouteur d'événement pour la barre de recherche
    const searchInput = document.querySelector(SELECTORS.SEARCH_INPUT);
    searchInput.addEventListener("input", (event) => {
        updateSearch(event);
    });

    populateFilters(recipes);
    updateAllDropdowns(); // Make sure selected items are displayed on page load
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
    document.querySelector(SELECTORS.SELECTED_FILTERS).appendChild(tag);
    
    // Update all dropdowns to show selected items
    updateAllDropdowns();
}

// Helper function to update all dropdowns with current selections
function updateAllDropdowns() {
    // Get the list of all unique tags from all dropdowns
    const allOptions = {};
    document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
        const dropdownId = dropdown.id;
        const optionsContainer = dropdown.querySelector('.filter-options');
        Array.from(optionsContainer.children).forEach(option => {
            const value = option.dataset.value;
            if (!allOptions[dropdownId]) allOptions[dropdownId] = {};
            allOptions[dropdownId][value] = option.textContent;
        });
    });
    
    // Update each dropdown
    document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
        const dropdownId = dropdown.id;
        let selectedItems = new Set();
        
        if (dropdownId === 'ingredient-filter') {
            selectedItems = selectedFilters.ingredients;
        } else if (dropdownId === 'appliance-filter') {
            selectedItems = selectedFilters.appliances;
        } else if (dropdownId === 'ustensil-filter') {
            selectedItems = selectedFilters.ustensils;
        }
        
        // Update the selected-items container
        const selectedItemsContainer = dropdown.querySelector('.selected-items');
        if (selectedItemsContainer) {
            selectedItemsContainer.innerHTML = '';
            
            selectedItems.forEach(value => {
                if (!allOptions[dropdownId] || !allOptions[dropdownId][value]) return;
                
                const displayText = allOptions[dropdownId][value];
                const selectedItem = document.createElement('li');
                selectedItem.textContent = displayText;
                selectedItem.dataset.value = value;
                
                const removeBtn = document.createElement('button');
                removeBtn.classList.add('remove-option');
                removeBtn.innerHTML = '&times;';
                removeBtn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    handleFilterRemoval(dropdownId, value);
                });
                
                selectedItem.appendChild(removeBtn);
                selectedItemsContainer.appendChild(selectedItem);
            });
        }
    });
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
    updateAllDropdowns();
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
    updateAllDropdowns();
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
    document.querySelector(SELECTORS.SELECTED_FILTERS).innerHTML = '';
    
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
                originalCaseMap.set(normalizedIngredient, ing.getCapitalizedName());
            }
            ingredientSet.add(normalizedIngredient);
        });

        recipe.appliances.forEach(app => {
            const normalizedAppliance = app.getNormalizedName();
            if (!originalCaseMap.has(normalizedAppliance)) {
                originalCaseMap.set(normalizedAppliance, app.getCapitalizedName());
            }
            applianceSet.add(normalizedAppliance);
        });

        recipe.ustensils.forEach(ust => {
            const normalizedUstensil = ust.getNormalizedName();
            if (!originalCaseMap.has(normalizedUstensil)) {
                originalCaseMap.set(normalizedUstensil, ust.getCapitalizedName());
            }
            ustensilSet.add(normalizedUstensil);
        });
    });

    // Conversion des Sets en tableaux triés avec la casse d'origine
    const sortedIngredients = Array.from(ingredientSet)
        .sort((a, b) => NormalizeItem.apply(originalCaseMap.get(a))
            .localeCompare(NormalizeItem.apply(originalCaseMap.get(b))))
        .map(item => originalCaseMap.get(item));

    const sortedAppliances = Array.from(applianceSet)
        .sort((a, b) => NormalizeItem.apply(originalCaseMap.get(a))
            .localeCompare(NormalizeItem.apply(originalCaseMap.get(b))))
        .map(item => originalCaseMap.get(item));

    const sortedUstensils = Array.from(ustensilSet)
        .sort((a, b) => NormalizeItem.apply(originalCaseMap.get(a))
            .localeCompare(NormalizeItem.apply(originalCaseMap.get(b))))
        .map(item => originalCaseMap.get(item));

    populateDropdown('ingredient-filter', sortedIngredients);
    populateDropdown('appliance-filter', sortedAppliances);
    populateDropdown('ustensil-filter', sortedUstensils);
}

function populateDropdown(dropdownId, options) {
    const dropdown = document.getElementById(dropdownId);
    const filterInput = dropdown.querySelector('.filter-input');
    const filterOptions = dropdown.querySelector('.filter-options');
    
    // Create selected items container if it doesn't exist
    let selectedItemsContainer = dropdown.querySelector('.selected-items');
    if (!selectedItemsContainer) {
        selectedItemsContainer = document.createElement('div');
        selectedItemsContainer.classList.add('selected-items');
        const inputContainer = dropdown.querySelector('.input-container');
        inputContainer.insertAdjacentElement('afterend', selectedItemsContainer);
    } else {
        // Clear existing selected items
        selectedItemsContainer.innerHTML = '';
    }

    function createOptionElement(option, isSelected = false) {
        const li = document.createElement('li');
        li.textContent = option;
        li.dataset.value = option.toLowerCase();
        
        if (isSelected) {
            // For selected items, we'll create a separate element for the selected-items container
            // Create a copy for the selected-items container
            const selectedItem = document.createElement('li');
            selectedItem.textContent = option;
            selectedItem.dataset.value = option.toLowerCase();
            
            // Add remove button to the selected item
            const removeBtn = document.createElement('button');
            removeBtn.classList.add('remove-option');
            removeBtn.innerHTML = '&times;';
            removeBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                handleFilterRemoval(dropdownId, option.toLowerCase());
            });
            
            selectedItem.appendChild(removeBtn);
            
            // Add to selected items container
            selectedItemsContainer.appendChild(selectedItem);
            
            // Create regular option element but mark it as selected
            li.classList.add('selected');
            li.addEventListener('click', () => {
                handleFilterRemoval(dropdownId, option.toLowerCase());
            });
            return li; // We still want it in the main list, but marked as selected
        } else {
            li.addEventListener('click', () => {
                handleFilterSelection(dropdownId, option);
            });
            return li;
        }
    }

    function updateDropdownDisplay(searchTerm = '') {
        // Vider la liste
        filterOptions.innerHTML = '';

        // Normaliser le terme de recherche
        const normalizedSearchTerm = NormalizeItem.apply(searchTerm);

        // Filtrer les options en fonction du terme de recherche
        const filteredOptions = options.filter(option =>
            NormalizeItem.apply(option).includes(normalizedSearchTerm)
        );

        // Process all options - selected items go to the top container, unselected to the list
        filteredOptions.forEach(option => {
            const isSelected = (
                (dropdownId === 'ingredient-filter' && selectedFilters.ingredients.has(option.toLowerCase())) ||
                (dropdownId === 'appliance-filter' && selectedFilters.appliances.has(option.toLowerCase())) ||
                (dropdownId === 'ustensil-filter' && selectedFilters.ustensils.has(option.toLowerCase()))
            );

            const element = createOptionElement(option, isSelected);
            if (element) {
                filterOptions.appendChild(element);
            }
        });
    }

    // Initialiser l'affichage
    updateDropdownDisplay();

    // Ajouter l'écouteur d'événements pour la recherche dans le dropdown
    filterInput.addEventListener('input', (event) => {
        const searchValue = event.target.value.toLowerCase();
        if (searchValue.length >= MIN_SEARCH_LENGTH || searchValue.length === 0) {
            updateDropdownDisplay(searchValue);
        }
    });
}