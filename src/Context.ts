import { ABIDefinition } from "web3/eth/abi";

export interface MethodAbi extends ABIDefinition {
  singleReturnValue: boolean;
}

export interface EventAbi extends ABIDefinition {}

export interface Context {
  artifact: string;
  contractName: string;
  relativeArtifactPath: string;
  getters: Array<MethodAbi>;
  functions: Array<MethodAbi>;
  events: Array<EventAbi>;
}
