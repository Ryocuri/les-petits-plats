import { NormalizableItem } from './NormalizableItem.js';

export class Ingredient extends NormalizableItem {
    constructor({ ingredient, quantity = null, unit = "" }) {
        super(ingredient);
        this.ingredient = ingredient;  // Garder pour la compatibilité
        this.quantity = quantity;
        this.unit = unit;
    }
}