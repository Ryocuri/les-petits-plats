// Chargement des données JSON (simulé ici par une variable)
const recipes = [] // Remplace ceci par le chargement du fichier JSON

// Sélection des éléments HTML
const searchInput = document.getElementById("search");
const resultsContainer = document.getElementById("results");

// Fonction de filtrage des recettes
function filterRecipes(query) {
    return recipes.filter(recipe => {
        return recipe.name.toLowerCase().includes(query.toLowerCase()) ||
            recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query.toLowerCase()));
    });
}

// Fonction d'affichage des résultats
function displayResults(filteredRecipes) {
    resultsContainer.innerHTML = ""; // Réinitialiser l'affichage

    filteredRecipes.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
            <p>${recipe.description}</p>
        `;
        resultsContainer.appendChild(recipeCard);
    });
}

// Écouteur d'événement pour la recherche
searchInput.addEventListener("input", (event) => {
    const query = event.target.value;
    const filteredRecipes = filterRecipes(query);
    displayResults(filteredRecipes);
});
