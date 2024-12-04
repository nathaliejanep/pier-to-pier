import { ShipmentForm, List } from '../components/Shipment';

// Main shipment dashboard
const Shipment: React.FC = () => {
  return (
    // TODO:
    // button to add new shipment or sidebar menu
    // search and filter
    <div>
      <ShipmentForm />
      <List />
    </div>
  );
};

export default Shipment;
