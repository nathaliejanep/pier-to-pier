// TODO delete ShippingFormData
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
  originPort: string;
  destinationPort: string;
  shipperName: string;
  consigneeName: string;
  goodsDescription: string;
  shippingMode: string;
  status: string;
  createdAt: string;
}

interface BillOfLading {
  id: string;
  initialHash: string;
  shipmentId: number;
  shipperName: string;
  consigneeName: string;
  carrierName: string;
  goodsDescription: string;
  shippingMode: string;
  containerDetails: string;
  portOfLoading: string;
  portOfDischarge: string;
  freightCharges: string;
  customsDetails: string;
  createdAt: string;
}

interface EventLog {
  id: string;
  hash: string;
  previousHash: string;
  shipmentId: number;
  eventType: string;
  eventDetails: string;
  createdAt: string;
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
