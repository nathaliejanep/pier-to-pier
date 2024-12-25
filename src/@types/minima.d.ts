// TODO delete ShippingFormData and SHipment?
interface ShippingFormData {
  sourcePort: string;
  destinationPort: string;
  shipmentId: string;
  cargoDescription: string;
  shipmentDate: string;
  expectedDeliveryDate: string;
  trackingNumber: string;
  shippingMethod: string;
}
interface Shipment {
  id: string;
  initialHash: string;
  sourcePort: string;
  destinationPort: string;
  shipperName: string;
  consigneeName: string;
  goodsDescription: string;
  shippingMode: string;
  status: string;
  createdAt: string;
}

interface IPublicKeys {
  buyer: string;
  seller: string;
  deleted: string;
}

interface BillOfLading {
  ID: string;
  INITIAL_HASH?: string;
  SHIPPER_NAME: string;
  CONSIGNEE_NAME: string;
  CARRIER_NAME: string;
  GOODS_DESCRIPTION: string;
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
  response?: {
    txpowid: string;
    // Add other fields
  };
  error?: string;
}
