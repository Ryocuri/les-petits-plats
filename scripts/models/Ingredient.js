export class Ingredient {
    constructor({ ingredient, quantity = null, unit = "" }) {
        this.ingredient = ingredient;
        this.quantity = quantity;
        this.unit = unit;
    }
}