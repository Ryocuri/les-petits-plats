import { NormalizeItem } from '../utils/NormalizeItem.js';

export class ElementFiltered {
    constructor(name) {
        this.name = name;
    }

    getNormalizedName() {
        return NormalizeItem.apply(this.name);
    }

    getFormattedName() {
        const trimmed = this.name.toLowerCase().trim();
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    }
}