export interface Input {
  indexed: boolean;
  internalType: string;
  name: string;
  type: string;
}

export interface EventABI {
  anonymous: boolean;
  inputs: Input[];
  name: string;
  type: string;
}