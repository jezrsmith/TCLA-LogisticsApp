import {Deserializable} from './deserializable';

export class Group {
  constructor(public id: string,
              public type: string
  ) {
  }
}

export class Claim implements Deserializable {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  sandboxes: Sandbox[];
  subscriptionId: string;
  username: string;
  primaryProductionSandbox: Sandbox;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}

export class Sandbox {
  constructor(public groups: Group[],
              public id: string,
              public type: string,
              public name: string,
              public subscriptionId: string,
              public ownerId: string,
  ) {
  }
}


export class UserInfo implements Deserializable {
  externalId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  type: string;
  id: string;
  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}

export class UserInfoList implements Deserializable {
  users: UserInfo[];
  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
