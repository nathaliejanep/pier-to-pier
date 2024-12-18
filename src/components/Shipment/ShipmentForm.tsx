import '../../styles/ShipmentForm.css';
import React, { useEffect, useState } from 'react';
import { sql } from '../../server/database';
import { commands } from '../../server/mds';
// TODO delete this file
const ShipmentForm: React.FC = () => {
  // Initial state for form fields and errors
  const [formData, setFormData] = useState<ShippingFormData>({
    sourcePort: '',
    destinationPort: '',
    shipmentId: '',
    cargoDescription: '',
    shipmentDate: '',
    expectedDeliveryDate: '',
    trackingNumber: '',
    shippingMethod: 'sea', // Default shipping method
  });

  // Handle form input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If the form is valid, send it to sql and create txn with state:hash
    console.log('Form submitted successfully with data: ', formData);
    const hashedData = await commands.hashData(formData);

    console.log('hashedData', hashedData);
    await commands.createTxn(hashedData);
    // Reset form
    setFormData({
      sourcePort: '',
      destinationPort: '',
      shipmentId: '',
      cargoDescription: '',
      shipmentDate: '',
      expectedDeliveryDate: '',
      trackingNumber: '',
      shippingMethod: 'sea',
    });
  };

  return (
    <div id="form-container">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="">Source Port:</label>
          <input
            type="text"
            id="sourcePort"
            name="sourcePort"
            value={formData.sourcePort}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="destinationPort">Destination Port:</label>
          <input
            type="text"
            id="destinationPort"
            name="destinationPort"
            value={formData.destinationPort}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="shipmentId">Shipment ID:</label>
          <input
            type="text"
            id="shipmentId"
            name="shipmentId"
            value={formData.shipmentId}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="cargoDescription">Cargo Description:</label>
          <textarea
            id="cargoDescription"
            name="cargoDescription"
            value={formData.cargoDescription}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="shipmentDate">Shipment Date:</label>
          <input
            type="date"
            id="shipmentDate"
            name="shipmentDate"
            value={formData.shipmentDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="expectedDeliveryDate">Expected Delivery Date:</label>
          <input
            type="date"
            id="expectedDeliveryDate"
            name="expectedDeliveryDate"
            value={formData.expectedDeliveryDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="trackingNumber">Tracking Number:</label>
          <input
            type="text"
            id="trackingNumber"
            name="trackingNumber"
            value={formData.trackingNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="shippingMethod">Shipping Method:</label>
          <select
            id="shippingMethod"
            name="shippingMethod"
            value={formData.shippingMethod}
            onChange={handleChange}
          >
            <option value="sea">Sea</option>
            <option value="air">Air</option>
            <option value="land">Land</option>
          </select>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ShipmentForm;
