import { Ingredient } from "./Ingredient.js";

export class Recipe {
    constructor(id, name, servings, time, description, image, ingredients, appliance, ustensils) {
        this.id = id;
        this.name = name;
        this.servings = servings;
        this.time = time;
        this.description = description;
        this.image = image;
        this.ingredients = ingredients.map(ing => new Ingredient(ing));
        this.appliance = appliance;
        this.ustensils = ustensils;
    }
}