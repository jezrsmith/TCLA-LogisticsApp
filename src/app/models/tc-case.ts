import {Deserializable} from './deserializable';

export class CaseType implements Deserializable {
  id: string;
  name: string;
  label: string;
  isCase: false;
  applicationId: 2552;
  applicationName: string;
  applicationInternalName: string;
  applicationVersion: number;
  CaseId: string;
  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}

export class Metadata {
  constructor(public createdBy:	string,
              public creationTimestamp:	string,
              public modifiedBy:	string,
              public modificationTimestamp:	string,
              public lock:	boolean,
              public lockType:	string,
              public lockedBy:	string,
              public msLockExpiry:	string,
              public msSystemTime:	string,
              public markedForPurge: boolean,
              public applicationId:	string,
              public applicationLabel: string,
              public typeId: string,
              public stateColor: string,
              public stateIcon: string,
              public caseTypeColor: string,
              public caseTypeIcon: string,
              public useCaseTypeColor: boolean
  ) {
  }
}

export class CaseInfo implements Deserializable {
  deleted: boolean;
  caseReference: string;
  untaggedCasedata: string;
  untaggedCasedataObj: any;
  casedata: string;
  casedataObj: any;
  summary: string;
  summaryObj: any;
  metadata: Metadata;
  deserialize(input: any): this {
    Object.assign(this, input);
    this.summaryObj = this.summary ? JSON.parse(this.summary) : undefined;
    this.casedataObj = this.casedata ? JSON.parse(this.casedata) : undefined;
    this.untaggedCasedataObj = this.untaggedCasedata ? JSON.parse(this.untaggedCasedata) : undefined;
    return this;
  }
}
