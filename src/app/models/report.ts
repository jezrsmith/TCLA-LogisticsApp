import {Validators} from '@angular/forms';


export interface Deserializable {
    deserialize(input: any): this;
}

export class Report implements Deserializable {
    BuCodeRcv: string;
    BuTypeRcv: string;
    BuNameRcv: string;
    UnloadDate: Date;
    CsmNo: number;
    SealNo: number;
    SlTime: number;
    Articles: Article[];
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export class Article implements Deserializable {
    ItemNo: number;
    ItemName: string;
    BuCodeSup: string;
    ItemQtyDsp: number;
    ItemQtyRcvGood: number;
    ItemQtyRcvDamaged: number;
    ItemQtyDiff: number;
    DamageType: string;
    NonComplianceCategory: number;
    NonComplianceCode: string;
    NonComplianceCodeDescription: string;
    SlMinutes: number;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
