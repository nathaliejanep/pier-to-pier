import '../../styles/ShipmentForm.css';
import { v4 as uuidv4 } from 'uuid';
import React, { useContext, useState } from 'react';
import { commands } from '../../server/mds';
import { sql } from '../../server/database';
import { appContext } from '../../AppContext';
import ContractService from '../../contracts/ContractService';
import { getBlockData } from '../../utilities/api';
import { config } from '../../config/config';

const generateNumericID = () => {
  const uuid = uuidv4();
  return uuid.replace(/\D/g, '').slice(0, 5); // Remove non-numeric characters and truncate to 10 digits
};

const BOLForm: React.FC = () => {
  const contractSerivce = new ContractService();
  const { publicKeys } = useContext(appContext);
  const [message, setMessage] = useState<string>('');
  const [formData, setFormData] = useState<BillOfLading>({
    ID: generateNumericID(),
    SHIPPER_NAME: 'Bob',
    CONSIGNEE_NAME: 'Alice',
    CARRIER_NAME: 'Maersk',
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
        while (await commands.checkPendingTransaction(sendTxnRes.pendinguid)) {
          setMessage(
            `Transaction is pending. Please confirm transaction in the 'Pending' MiniDapp.`,
          );
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before checking again
        }
      }
      return contractAddress;
    } catch (error) {
      console.error(`deployContract - ${error}`);
    }
  };

  // const waitForSendableBalance = async (requiredAmount, maxWaitTime = 300000) => {
  //   // maxWaitTime default 5 minutes
  //   const startTime = Date.now();
  //   setLoading(true);
  //   while (Date.now() - startTime < maxWaitTime) {
  //     const balance = await commands.getSendableBalance();
  //     if (balance && balance >= requiredAmount) {
  //       return true;
  //     }
  //     await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds before checking again
  //   }
  //   throw new Error('Timeout waiting for sendable balance');
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // If the form is valid, send it to sql and create txn with state:hash

    try {
      // const hashedData = await commands.hashData(formData);
      //   await commands.createTxn(hashedData);

      // Reset form
      setFormData({
        ID: '',
        SHIPPER_NAME: '',
        CONSIGNEE_NAME: '',
        CARRIER_NAME: '',
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
      console.log(contractAddress);

      sql.insertRecordBOL({
        ...formData,
        CONTRACT_ADDRESS: contractAddress,
      });

      const BOLData = await sql.getBOLById(formData.ID);
      const { INITIAL_HASH, CREATED_AT, ...rest } = BOLData;

      const hashRest = await commands.hashData(rest);

      // await waitForSendableBalance(parseFloat('0.000000000001'));
      // console.log('Balance is now sendable. Proceeding with second transaction.');

      // const sendHash = await commands.sendHashToChain(hashRest);

      // if (sendHash.pending) {
      //   console.log('Please confirm the second transaction in the Pending Actions.');
      //   setMessage('Please confirm the second transaction in the Pending Actions.');
      //   while (await commands.checkPendingTransaction(sendHash.pendinguid)) {
      //     console.log('Second transaction still pending. Waiting...');
      //     await new Promise((resolve) => setTimeout(resolve, 5000));
      //   }
      // }
      // const hashedTimestamp = await commands.hashData(CREATED_AT);
      // const res = await commands.sendHashToChain(hashRest);

      await sql.updateBOLHash(hashRest, formData.ID);

      // This is a mock function, it checks an API finding hashes on the mainnet
      // Since this is a test node we are using a hash that exists on chain
      const blockData = await getBlockData(config.ABC_HASH);

      // const isValid = await commands.getCoinStates(hashRest);
      // await sql.updateBOLHashIsValid(isValid, formData.ID);

      if (blockData.length > 0) {
        await sql.updateBOLHashIsValid(true, formData.ID);
      } else {
        await sql.updateBOLHashIsValid(false, formData.ID);
      }

      setMessage(`Successfully sent ${formData.FREIGHT_CHARGES} M`);
      // await commands.sendTimestampHash(hashedTimestamp, hashRest);
      // const isValid = await commands.isValid(hashRest);
    } catch (err) {
      console.error('Error submitting BOL:', err);
    }
  };

  return (
    <div id="form-container">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl pb-2">Bill of Lading</h1>

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
