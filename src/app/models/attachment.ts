export interface Deserializable {
    deserialize(input: any): this;
}

export class Attachment implements Deserializable {
    type: string;
    file: any;
    path: any;
    description: string;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
