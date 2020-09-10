import { AbiItem } from "web3-utils";

export interface MethodAbi extends AbiItem {
  singleReturnValue: boolean;
}

export interface EventAbi extends AbiItem {}

export interface Context {
  artifact: string;
  contractName: string;
  relativeArtifactPath: string;
  getters: Array<MethodAbi>;
  functions: Array<MethodAbi>;
  events: Array<EventAbi>;
}
