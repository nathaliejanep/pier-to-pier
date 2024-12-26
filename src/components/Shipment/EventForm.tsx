import { useEffect, useState } from 'react';
import { config } from '../../config/config';
import { getBlockData } from '../../utilities/api';
import { sql } from '../../server/database';
import { v4 as uuidv4 } from 'uuid';
import { commands } from '../../server/mds';
import React from 'react';

const EventForm: React.FC = () => {
  const [BOLDataList, setBOLDataList] = useState<BillOfLading[]>([]);
  const [formData, setFormData] = useState<EventLog>({
    ID: uuidv4(),
    BOL_ID: '',
    EVENT_TYPE: 'Departure', // Default event type
    EVENT_DETAILS: 'Details',
  });

  useEffect(() => {
    getShipments();
  }, []);

  const getShipments = async () => {
    const BOLData = await sql.getBOLRecords();
    setBOLDataList(BOLData);
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

    // Send the event log data to the sql
    try {
      if (formData.BOL_ID) {
        const latestEvent = await sql.getLatestEventByBOLId(formData.BOL_ID);

        const eventPreviousHash = {
          ...formData,
          EVENT_PREVIOUS_HASH: latestEvent.length > 0 ? latestEvent[0]?.EVENT_HASH : null,
        };

        sql.insertRecordEvent(eventPreviousHash);

        if (formData.ID) {
          const event = await sql.getEventById(formData.ID);
          // const eventTime = event[0].CREATED_AT;
          // const hashedTimestamp = await commands.hashData(eventTime);

          const hashedEvent = await commands.hashData(event);
          await sql.updateEventHash(hashedEvent, formData.ID);

          const blockData = await getBlockData(config.ABC_HASH);

          if (blockData.length > 0) {
            await sql.updateEventHashIsValid(true, formData.ID);
          }

          // await commands.sendTimestampHash(hashedTimestamp, hashedEvent);
          // const isValid = await commands.isValid(hashedEvent);
          // console.log('check', isValid);
        }
      }

      // Reset form
      setFormData({
        BOL_ID: '',
        EVENT_TYPE: 'Departure',
        EVENT_DETAILS: '',
      });
    } catch (error) {
      console.error('Failed to log event: ', error);
    }
  };

  return (
    <div id="form-container">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl pb-4">Log Event</h1>
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
