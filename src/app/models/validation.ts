export interface Deserializable {
    deserialize(input: any): this;
}

export class ValidationStatus implements Deserializable {
    headerValid: boolean;
    articleValid: boolean[];
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
