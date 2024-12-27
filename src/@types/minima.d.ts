interface PublicKeys {
  buyer: string;
  seller: string;
  deleted: string;
}

interface MinimaResponse {
  status: boolean;
  response: any;
  error: any;
  pending?: boolean;
  pendinguid?: any;
}

interface BillOfLading {
  ID: string;
  INITIAL_HASH?: string;
  SHIPPER_NAME: string;
  CONSIGNEE_NAME: string;
  CARRIER_NAME: string;
  CONTAINER_AMOUNT: number;
  PORT_OF_LOADING: string;
  PORT_OF_DISCHARGE: string;
  FREIGHT_CHARGES: string;
  CUSTOMS_DETAILS: string;
  CREATED_AT?: string;
  CONTRACT_ADDRESS?: string;
}

interface EventLog {
  ID?: string;
  EVENT_PREVIOUS_ID?: string;
  HASH?: string;
  EVENT_PREVIOUS_HASH?: string;
  BOL_ID?: string;
  EVENT_TYPE: string;
  EVENT_DETAILS: string;
  CREATED_AT?: string;
}

interface TransactionResponse {
  status: boolean;
  pendinguid: string;
  pending: boolean;
  response?: {
    txpowid: string;
    // Add other fields
  };
  error?: string;
}
