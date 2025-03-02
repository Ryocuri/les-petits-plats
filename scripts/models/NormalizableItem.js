export class NormalizableItem {
    constructor(name) {
        this.name = name;
    }

    getNormalizedName() {
        return this.name.toLowerCase().trim();
    }

    getFormattedName() {
        const trimmed = this.name.toLowerCase().trim();
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    }

    static normalize(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    }

    compareWith(other) {
        const normalizedA = NormalizableItem.normalize(this.name);
        const normalizedB = NormalizableItem.normalize(other.name);
        return normalizedA.localeCompare(normalizedB);
    }
}