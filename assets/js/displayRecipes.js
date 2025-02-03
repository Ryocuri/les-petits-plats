function displayRecipes(recipesToDisplay) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";
    recipesToDisplay.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.innerHTML = `
                    <img src="${recipe.image}" alt="${recipe.name}">
                    <h3>${recipe.name}</h3>
                    <p><strong>Temps:</strong> ${recipe.time} min</p>
                    <p>${recipe.description}</p>
                `;
        resultsContainer.appendChild(recipeCard);
    });
}

function searchRecipes() {
    const query = document.getElementById("search").value.toLowerCase();
    const filteredRecipes = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(query))
    );
    displayRecipes(filteredRecipes);
}

document.getElementById("search-btn").addEventListener("click", searchRecipes);
document.getElementById("search").addEventListener("input", searchRecipes);

displayRecipes(recipes);