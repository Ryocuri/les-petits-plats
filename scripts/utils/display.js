export function displayRecipes(recipesToDisplay) {
    document.getElementById("results").innerHTML = recipesToDisplay.map(recipe => `
        <article class="recipe-card">
            <span class="time-badge">${recipe.time} min</span>
            <figure>
                <img src="assets/images/${recipe.image}" alt="${recipe.name}">
            </figure>
            <figcaption>
                <h3>${recipe.name}</h3>
                <p class="recipe-section">RECETTE</p>
                <p class="recipe-description">${recipe.description}</p>
                <p class="recipe-section">INGRÉDIENTS</p>
                <div class="ingredients">
                    ${recipe.ingredients.map(ing => `
                        <div class="ingredient-item">
                            <strong>${ing.ingredient}</strong><br>
                            ${ing.quantity ? ing.quantity : ""} ${ing.unit ? ing.unit : ""}
                        </div>
                    `).join("")}
                </div>
            </figcaption>
        </article>

    `).join("");
}
