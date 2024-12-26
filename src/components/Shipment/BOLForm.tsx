import '../../styles/ShipmentForm.css';
import React, { useContext, useState } from 'react';
import { commands } from '../../server/mds';
import { sql } from '../../server/database';
import { appContext } from '../../AppContext';
import ContractService from '../../contracts/ContractService';
import { getBlockData } from '../../utilities/api';
import { config } from '../../config/config';

const BOLForm: React.FC = () => {
  const contractSerivce = new ContractService();
  const { publicKeys } = useContext(appContext);
  const [message, setMessage] = useState<string>('');
  const [formData, setFormData] = useState<BillOfLading>({
    ID: '1',
    SHIPPER_NAME: 'Bob',
    CONSIGNEE_NAME: 'Alice',
    CARRIER_NAME: 'Maersk',
    GOODS_DESCRIPTION: 'Good goods description',
    CONTAINER_AMOUNT: 1,
    PORT_OF_LOADING: 'Gothenburg',
    PORT_OF_DISCHARGE: 'Amsterdam',
    FREIGHT_CHARGES: '100',
    CUSTOMS_DETAILS: 'Special details',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: name === 'CONTAINER_AMOUNT' ? Number(value) : value, // Update CONTAINER_AMOUNT as a number
      };

      // If CONTAINER_AMOUNT changes, update FREIGHT_CHARGES
      if (name === 'CONTAINER_AMOUNT') {
        updatedData.FREIGHT_CHARGES = (Number(value) * 100).toString();
      }

      return updatedData;
    });
  };

  const deployContract = async (BOLId: string, freightCharges: number, publicKeys: PublicKeys) => {
    try {
      const contractAddress = await contractSerivce.createContract(BOLId);
      const sendTxnRes = await contractSerivce.sendTxnState(
        contractAddress,
        freightCharges,
        publicKeys,
      );

      if (sendTxnRes.pending) {
        console.log('sendTxnRes', sendTxnRes);
        setMessage(`Transaction is pending, please accept `);
      }
      return contractAddress;
    } catch (error) {
      console.error(`deployContract - ${error}`);
    }
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
        CONTAINER_AMOUNT: 1,
        PORT_OF_LOADING: '',
        PORT_OF_DISCHARGE: '',
        FREIGHT_CHARGES: '',
        CUSTOMS_DETAILS: '',
      });

      // Deploy contract
      const contractAddress = await deployContract(
        formData.ID,
        +formData.FREIGHT_CHARGES,
        publicKeys,
      );

      sql.insertRecordBOL({
        ...formData,
        CONTRACT_ADDRESS: contractAddress,
      });

      const BOLData = await sql.getBOLById(formData.ID);
      const { INITIAL_HASH, CREATED_AT, ...rest } = BOLData;

      // const hashedTimestamp = await commands.hashData(CREATED_AT);

      // TODO rename rest, Hash data from SQL to make sure it follows correct structure eveywhere
      const hashRest = await commands.hashData(rest);

      // TODO fix this function and activate
      // const res = await commands.sendHashToChain(hashRest);
      // console.log('RES send hah', res);

      await sql.updateBOLHash(hashRest, formData.ID);

      // TODO Should be hashRest
      const blockData = await getBlockData(config.ABC_HASH);
      if (blockData.length > 0) {
        await sql.updateBOLHashIsValid(true, formData.ID);
      } else {
        await sql.updateBOLHashIsValid(false, formData.ID);
      }
      console.log(blockData);
      // TODO send mock function to send hash to "chain on test noe"

      // await commands.sendTimestampHash(hashedTimestamp, hashRest);
      // const isValid = await commands.isValid(hashRest);
      // console.log('check', isValid);

      // TODO add SHIPMENT_IS_VALID
      console.log('Form submitted successfully with data: ', formData);
    } catch (err) {
      console.error('Error submitting BOL:', err);
    }
  };

  return (
    <div id="form-container">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl pb-2">Bill of Lading</h1>
        <div className="mt-4">
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
          <label htmlFor="CONTAINER_AMOUNT">CONTAINER AMOUNT:</label>
          <input
            type="number"
            id="CONTAINER_AMOUNT"
            name="CONTAINER_AMOUNT"
            value={formData.CONTAINER_AMOUNT}
            onChange={handleChange}
            min="1"
            step="1"
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
          <label htmlFor="CUSTOMS_DETAILS">CUSTOMS DETAILS:</label>
          <textarea
            id="CUSTOMS_DETAILS"
            name="CUSTOMS_DETAILS"
            value={formData.CUSTOMS_DETAILS}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="FREIGHT_CHARGES">FREIGHT CHARGES:</label>
          <div id="FREIGHT_CHARGES" className="w-full p-2 ">
            ${formData.FREIGHT_CHARGES}
          </div>
        </div>

        <button type="submit">SEND ORDER</button>
        {message && (
          <div>
            <p className="text-center mt-6">{message}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default BOLForm;
