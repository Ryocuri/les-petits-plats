import { recipes as rawRecipes } from "./recipes.js";
import { displayRecipes } from "./utils/display.js";
import { performSearch } from "./utils/search.js";
import { Recipe } from "./models/Recipe.js";

const recipes = rawRecipes.map(r => new Recipe(r.id, r.name, r.servings, r.time, r.description, r.image, r.ingredients, r.appliance, r.ustensils));

// Initialiser les tableaux de filtres sélectionnés au niveau global
const selectedFilters = {
    ingredients: new Set(),
    appliances: new Set(),
    ustensils: new Set()
};

// Fonction pour normaliser une chaîne (retirer les accents)
function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Fonction pour formater une option
function formatOption(str) {
    // Convertir en minuscules et retirer les espaces en début/fin
    str = str.toLowerCase().trim();
    
    // Capitaliser la première lettre
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Fonction pour comparer deux chaînes en ignorant les accents
function compareStrings(a, b) {
    const normalizedA = normalizeString(a.toLowerCase());
    const normalizedB = normalizeString(b.toLowerCase());
    return normalizedA.localeCompare(normalizedB);
}

// Fonction pour mettre à jour la recherche
function updateSearch() {
    const searchInput = document.getElementById("search");
    const query = searchInput.value.toLowerCase().trim();
    performSearch(
        recipes,
        query,
        Array.from(selectedFilters.ingredients),
        Array.from(selectedFilters.appliances),
        Array.from(selectedFilters.ustensils)
    );
}

document.addEventListener("DOMContentLoaded", () => {
    displayRecipes(recipes);

    // Ajouter l'écouteur d'événement pour la barre de recherche
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", () => {
        updateSearch();
    });

    populateFilters(recipes);
});

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
                originalCaseMap.set(normalizedIngredient, formatOption(ing.ingredient));
            }
            ingredientSet.add(normalizedIngredient);
        });

        const normalizedAppliance = recipe.appliance.toLowerCase();
        if (!originalCaseMap.has(normalizedAppliance)) {
            originalCaseMap.set(normalizedAppliance, formatOption(recipe.appliance));
        }
        applianceSet.add(normalizedAppliance);

        recipe.ustensils.forEach(ust => {
            const normalizedUstensil = ust.toLowerCase();
            if (!originalCaseMap.has(normalizedUstensil)) {
                originalCaseMap.set(normalizedUstensil, formatOption(ust));
            }
            ustensilSet.add(normalizedUstensil);
        });
    });

    // Conversion des Sets en tableaux triés avec la casse d'origine
    const sortedIngredients = Array.from(ingredientSet)
        .sort((a, b) => compareStrings(originalCaseMap.get(a), originalCaseMap.get(b)))
        .map(item => originalCaseMap.get(item));
    const sortedAppliances = Array.from(applianceSet)
        .sort((a, b) => compareStrings(originalCaseMap.get(a), originalCaseMap.get(b)))
        .map(item => originalCaseMap.get(item));
    const sortedUstensils = Array.from(ustensilSet)
        .sort((a, b) => compareStrings(originalCaseMap.get(a), originalCaseMap.get(b)))
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
        
        if (isSelected) {
            li.classList.add('selected');
            const removeButton = document.createElement('button');
            removeButton.classList.add('remove-option');
            removeButton.innerHTML = '&times;';
            removeButton.onclick = (event) => {
                event.stopPropagation();
                const selectedValue = option.toLowerCase();
                
                // Retirer le filtre de la collection appropriée
                if (dropdownId === 'ingredient-filter') {
                    selectedFilters.ingredients.delete(selectedValue);
                } else if (dropdownId === 'appliance-filter') {
                    selectedFilters.appliances.delete(selectedValue);
                } else if (dropdownId === 'ustensil-filter') {
                    selectedFilters.ustensils.delete(selectedValue);
                }

                // Retirer le tag correspondant
                const tags = document.querySelectorAll('.filter-tag');
                tags.forEach(tag => {
                    if (tag.textContent.includes(option)) {
                        tag.remove();
                    }
                });

                // Mettre à jour l'affichage du dropdown
                updateDropdownDisplay(filterInput.value.toLowerCase());
                
                // Mettre à jour la recherche
                updateSearch();
            };
            li.appendChild(removeButton);
        } else {
            li.addEventListener('click', () => {
                const selectedValue = option.toLowerCase();

                // Create tag
                const tag = document.createElement('span');
                tag.classList.add('filter-tag');
                tag.textContent = option;

                const removeButton = document.createElement('button');
                removeButton.classList.add('close-tag');
                removeButton.innerHTML = '&times;';
                removeButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    tag.remove();
                    
                    // Retirer le filtre de la collection appropriée
                    if (dropdownId === 'ingredient-filter') {
                        selectedFilters.ingredients.delete(selectedValue);
                    } else if (dropdownId === 'appliance-filter') {
                        selectedFilters.appliances.delete(selectedValue);
                    } else if (dropdownId === 'ustensil-filter') {
                        selectedFilters.ustensils.delete(selectedValue);
                    }
                    
                    // Mettre à jour l'affichage du dropdown
                    updateDropdownDisplay(filterInput.value.toLowerCase());
                    
                    // Mettre à jour la recherche
                    updateSearch();
                });
                
                tag.appendChild(removeButton);
                document.querySelector('.selected-filters').appendChild(tag);

                // Ajouter le filtre à la collection appropriée
                if (dropdownId === 'ingredient-filter') {
                    selectedFilters.ingredients.add(selectedValue);
                } else if (dropdownId === 'appliance-filter') {
                    selectedFilters.appliances.add(selectedValue);
                } else if (dropdownId === 'ustensil-filter') {
                    selectedFilters.ustensils.add(selectedValue);
                }

                // Mettre à jour l'affichage du dropdown
                updateDropdownDisplay(filterInput.value.toLowerCase());
                
                // Mettre à jour la recherche
                updateSearch();
            });
        }

        return li;
    }

    function updateDropdownDisplay(searchTerm = '') {
        // Vider la liste
        filterOptions.innerHTML = '';

        // Normaliser le terme de recherche
        const normalizedSearchTerm = normalizeString(searchTerm.toLowerCase());

        // Filtrer les options en fonction du terme de recherche
        const filteredOptions = options.filter(option =>
            normalizeString(option.toLowerCase()).includes(normalizedSearchTerm)
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
        updateDropdownDisplay(event.target.value.toLowerCase());
    });
}