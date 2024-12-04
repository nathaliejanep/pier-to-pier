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
  id: number;
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
  id: number;
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
  id: number;
  shipmentId: number;
  eventType: string;
  eventDetails: string;
  createdAt: string;
}
