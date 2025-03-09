import { ElementFiltered } from './ElementFiltered.js';

export class Ingredient extends ElementFiltered {
    constructor({ ingredient, quantity = null, unit = "" }) {
        super(ingredient);
        this.ingredient = ingredient;
        this.quantity = quantity;
        this.unit = unit;
    }
}