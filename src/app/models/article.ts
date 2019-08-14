export interface Deserializable {
    deserialize(input: any): this;
}

export class SupplierInfo implements Deserializable {
    buCodeSup: number;
    buNameSup: string;
    buTypeSup: string;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export class ArticleInfo implements Deserializable {
    itemNo: number;
    itemName: string;
    suppliers: SupplierInfo[];
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export class DamageType implements  Deserializable {
    damageTypeCode: number;
    damageTypeDescription: string;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export class NonComplianceCategory implements Deserializable {
    nonCompCategoryCode: number;
    nonCompCategoryDescription: string;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export class NonComplianceCode implements Deserializable {
    nonCompCodeId: number;
    nonCompCode: string;
    nonCompCodeName: string;
    nonCompCodeDescription: string;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}


