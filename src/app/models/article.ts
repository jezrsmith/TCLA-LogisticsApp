export interface Deserializable {
    deserialize(input: any): this;
}

export class ArticleInfo implements Deserializable {
    itemNo: string;
    itemName: string;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}


