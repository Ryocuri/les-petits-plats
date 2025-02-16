export function displayRecipes(recipesToDisplay) {
    document.getElementById("results").innerHTML = recipesToDisplay.map(recipe => `
        <article class="recipe-card">
            <figure>
                <img src="assets/images/${recipe.image}" alt="${recipe.name}">
                <span class="time-badge">${recipe.time} min</span>
            </figure>
            <figcaption>
                <h3>${recipe.name}</h3>
                <p class="recipe-section">RECETTE</p>
                <p>${truncateText(recipe.description, 4)}</p>
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

function truncateText(text, maxLines) {
    const words = text.split(' ');
    let truncatedText = '';
    let lines = 0;
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + word).length > 55) { // Environ 55 caractères par ligne
            lines++;
            truncatedText += currentLine + '\n';
            currentLine = word + ' ';
        } else {
            currentLine += word + ' ';
        }
    });

    if (currentLine.trim().length > 0) {
        truncatedText += currentLine;
        lines++;
    }

    if (lines > maxLines) {
        return truncatedText.split('\n').slice(0, maxLines).join(' ') + '...';
    }

    return truncatedText;
}