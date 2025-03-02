import { Ingredient } from "./Ingredient.js";
import { Ustensil } from "./Ustensil.js";
import { Appliance } from "./Appliance.js";

export class Recipe {
    constructor(id, name, servings, time, description, image, ingredients, appliance, ustensils) {
        this.id = id;
        this.name = name;
        this.servings = servings;
        this.time = time;
        this.description = description;
        this.image = image;
        this.ingredients = ingredients.map(ing => new Ingredient(ing));
        this.appliances = [appliance].map(app => new Appliance(app));
        this.ustensils = ustensils.map(ust => new Ustensil(ust));
    }
}