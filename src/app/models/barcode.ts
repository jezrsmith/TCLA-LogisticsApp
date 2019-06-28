import {Deserializable} from './deserializable';

export class Barcode implements Deserializable {
    cancelled: number;
    text: string;
    format: string;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
