export interface Deserializable {
    deserialize(input: any): this;
}

export class ReceiverInfo implements Deserializable {
    buCodeRcv: string;
    buTypeRcv: string;
    buNameRcv: string;
    emailId: string;
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    sandboxId: string;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
