
export interface AgentStatus {
  status: string;
  subStatus: string;
}

export interface InteractionStatus {
  state: string;
  interaction: Interaction;
}

export enum InteractionState {
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED"
}

export interface Interaction {
  id: string;
  connectedTime: string;
  endTime: string;
  phone: string;
  name: string;
  isConnected: boolean;
  isDisconnected: boolean;
  isDone: boolean;
  state: string;
  isCallback: boolean;
  isDialer: boolean;
  isChat: boolean;
  isEmail: boolean;
  isMessage: boolean;
  isVoicemail: boolean;
  remoteName: string;
  recordingState: string;
  securePause: boolean;
  displayAddress: string;
  queueName: string;
  ani: string;
  calledNumber: string;
  interactionDurationSeconds: number;
  totalIvrDurationSeconds: number;
  totalAcdDurationSeconds: number;
  direction: string;
  isInternal: boolean;
  startTime: string;
  old: Interaction;
}
