import { useContext, useEffect, useState } from 'react';
import { config } from '../../config/config';
import { getBlockData } from '../../utilities/api';
import { sql } from '../../server/database';
import { v4 as uuidv4 } from 'uuid';
import ContractService from '../../contracts/ContractService';
import { appContext } from '../../AppContext';

const EventForm: React.FC = () => {
  const [BOLDataList, setBOLDataList] = useState<BillOfLading[]>([]);
  const [BOLData, setBOLData] = useState<any>();
  const [formData, setFormData] = useState<EventLog>({
    ID: uuidv4(),
    BOL_ID: '',
    EVENT_TYPE: 'Departure', // Default event type
    EVENT_DETAILS: 'Details',
  });

  const { publicKeys } = useContext(appContext);

  useEffect(() => {
    formData.BOL_ID && fetchContractAddress(formData.BOL_ID);
  }, [formData.BOL_ID]);

  useEffect(() => {
    fetchBlockData();
    getShipments();
  }, []);

  const fetchBlockData = async () => {
    // TODO findHash in API
    const blockData = await getBlockData(config.ABC_HASH);
    console.log('blockData', blockData);
  };

  const getShipments = async () => {
    const BOLData = await sql.getBOLRecords();
    setBOLDataList(BOLData);
  };

  const fetchContractAddress = async (bolId: string) => {
    try {
      // TODO handle if BOL_ID is empty ''
      const BOL = await sql.getBOLById(bolId);
      if (BOL.length > 0) {
        setBOLData(BOL[0]);
      } else {
        console.warn('No data found for the given BOL_ID');
      }
    } catch (error) {
      console.error('Error fetching contract address:', error);
    }
  };

  enum ShipmentProof {
    NotLoaded = 0,
    InTransit = 1,
  }

  enum Delivery {
    Unconfirmed = 0,
    Confirmed = 1,
  }

  const txnId = 'lastpayment';

  const sendLastPayment = async () => {
    const amount = BOLData.FREIGHT_CHARGES;
    const contractAddress = BOLData.CONTRACT_ADDRESS;

    if (!contractAddress) {
      console.error('Contract address is not set.');
      return;
    }
    try {
      await ContractService.createTxnId(txnId);
      await ContractService.contractInput(txnId, contractAddress);
      await ContractService.contractOutput(txnId, amount, contractAddress);
      await ContractService.inputTxnState(txnId, 2, 1);
      await ContractService.inputTxnState(txnId, 3, 1);
    } catch (error) {
      console.error(`cancelPayment - ${error}`);
    }
  };

  const signLastPayment = async () => {
    console.log('signLastPayment');
    await ContractService.sign(txnId, publicKeys.seller);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send the event log data to the backend
    try {
      if (formData.BOL_ID) {
        const latestEvent = await sql.getLatestEventByBOLId(formData.BOL_ID);
        console.log('latestEvent', latestEvent);
        // TODO probably use hash instead of PREV ID
        const eventWithPreviousId = {
          ...formData,
          EVENT_PREVIOUS_HASH: latestEvent.length > 0 ? latestEvent[0]?.EVENT_HASH : null,
        };
        sql.insertRecordEvent(eventWithPreviousId);

        if (formData.ID) {
          const event = await sql.getEventById(formData.ID);
          // console.log('event', event);
          // const eventTime = event[0].CREATED_AT; // TODO rename in SQL
          // const hashedTimestamp = await commands.hashData(eventTime);
          // const hashedEvent = await commands.hashData(event);
          // await sql.updateEventHash(hashedEvent, formData.ID);
          // await commands.sendTimestampHash(hashedTimestamp, hashedEvent);
          // const isValid = await commands.isValid(hashedEvent);
          // console.log('check', isValid);
        }
      }
      if (formData.EVENT_TYPE === 'Delivered') {
        await sendLastPayment();
        await signLastPayment();
      }
      // Reset form
      setFormData({
        BOL_ID: '',
        EVENT_TYPE: 'Departure',
        EVENT_DETAILS: '',
      });

      // TODO send message to UI
      console.log('Form submitted successfully with data: ', formData);
    } catch (error) {
      console.error('Failed to log event: ', error);
    }
  };

  return (
    <div id="event-log-form-container">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="BOL_ID">Shipment ID:</label>
          <select
            id="BOL_ID"
            name="BOL_ID"
            value={formData.BOL_ID}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Shipment --</option>
            {BOLDataList.map((bol) => (
              <option key={bol.ID} value={bol.ID}>
                {bol.ID}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="EVENT_TYPE">Event Type:</label>
          <select
            id="EVENT_TYPE"
            name="EVENT_TYPE"
            value={formData.EVENT_TYPE}
            onChange={handleChange}
            required
          >
            <option value="Departure">Departure</option>
            <option value="InTransit">In Transit</option>
            <option value="Arrival">Arrival</option>
            <option value="Cleared">Cleared</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        <div>
          <label htmlFor="EVENT_DETAILS">Event Description:</label>
          <textarea
            id="EVENT_DETAILS"
            name="EVENT_DETAILS"
            value={formData.EVENT_DETAILS}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Log Event</button>
      </form>
    </div>
  );
};
export default EventForm;
