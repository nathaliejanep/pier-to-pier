import '../../styles/ShipmentForm.css';
import React, { useEffect, useState } from 'react';
import { commands } from '../../server/mds';
import { sql } from '../../server/database';

const BOLForm: React.FC = () => {
  // Initial state for form fields and errors
  const [formData, setFormData] = useState<BillOfLading>({
    ID: '1',
    SHIPPER_NAME: 'Bob',
    CONSIGNEE_NAME: 'Alice',
    CARRIER_NAME: 'Maersk',
    GOODS_DESCRIPTION: 'Good goods description',
    CONTAINER_DETAILS: 'Details about container',
    PORT_OF_LOADING: 'Gothenburg',
    PORT_OF_DISCHARGE: 'Amsterdam',
    FREIGHT_CHARGES: '100',
    CUSTOMS_DETAILS: 'Special details',
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

    try {
      // TODO send resthash to blockchain below
      // const hashedData = await commands.hashData(formData);

      // console.log('hashedData', hashedData);
      //   await commands.createTxn(hashedData);
      // Reset form
      setFormData({
        ID: '',
        SHIPPER_NAME: '',
        CONSIGNEE_NAME: '',
        CARRIER_NAME: '',
        GOODS_DESCRIPTION: '',
        CONTAINER_DETAILS: '',
        PORT_OF_LOADING: '',
        PORT_OF_DISCHARGE: '',
        FREIGHT_CHARGES: '',
        CUSTOMS_DETAILS: '',
      });
      sql.insertRecordBOL(formData);
      const BOLData = await sql.getBOLRecords();

      // Hash rest
      if (BOLData.length > 0) {
      }
      const { INITIAL_HASH, CREATED_AT, ...rest } = BOLData[0];
      const { ID } = BOLData[0];
      const hashRest = await commands.hashData(rest);

      await sql.updateBOLHash(hashRest, ID);

      console.log('Form submitted successfully with data: ', formData);
    } catch (err) {
      console.error('Error submitting BOL:', err);
    }
  };

  return (
    <div id="form-container">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="ID">ID:</label>
          <input type="text" id="ID" name="ID" value={formData.ID} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="SHIPPER_NAME">SHIPPER NAME:</label>
          <input
            type="text"
            id="SHIPPER_NAME"
            name="SHIPPER_NAME"
            value={formData.SHIPPER_NAME}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="CONSIGNEE_NAME">CONSIGNEE NAME:</label>
          <input
            type="text"
            id="CONSIGNEE_NAME"
            name="CONSIGNEE_NAME"
            value={formData.CONSIGNEE_NAME}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="CARRIER_NAME">CARRIER NAME:</label>
          <input
            type="text"
            id="CARRIER_NAME"
            name="CARRIER_NAME"
            value={formData.CARRIER_NAME}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="GOODS_DESCRIPTION">GOODS DESCRIPTION:</label>
          <textarea
            id="GOODS_DESCRIPTION"
            name="GOODS_DESCRIPTION"
            value={formData.GOODS_DESCRIPTION}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="CONTAINER_DETAILS">CONTAINER DETAILS:</label>
          <textarea
            id="CONTAINER_DETAILS"
            name="CONTAINER_DETAILS"
            value={formData.CONTAINER_DETAILS}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="PORT_OF_LOADING">PORT OF LOADING:</label>
          <input
            type="text"
            id="PORT_OF_LOADING"
            name="PORT_OF_LOADING"
            value={formData.PORT_OF_LOADING}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="PORT_OF_DISCHARGE">PORT OF DISCHARGE:</label>
          <input
            type="text"
            id="PORT_OF_DISCHARGE"
            name="PORT_OF_DISCHARGE"
            value={formData.PORT_OF_DISCHARGE}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="FREIGHT_CHARGES">FREIGHT CHARGES:</label>
          <input
            type="text"
            id="FREIGHT_CHARGES"
            name="FREIGHT_CHARGES"
            value={formData.FREIGHT_CHARGES}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="CUSTOMS_DETAILS">CUSTOMS DETAILS:</label>
          <textarea
            id="CUSTOMS_DETAILS"
            name="CUSTOMS_DETAILS"
            value={formData.CUSTOMS_DETAILS}
            onChange={handleChange}
          />
        </div>

        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
};

export default BOLForm;