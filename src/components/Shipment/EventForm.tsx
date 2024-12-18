import { useEffect, useState } from 'react';
import { config } from '../../config/config';
import { getBlockData } from '../../utilities/api';
import { sql } from '../../server/database';
import { commands } from '../../server/mds';
import { v4 as uuidv4 } from 'uuid';

// Component for logging events
const EventForm: React.FC = () => {
  const [formData, setFormData] = useState<EventLog>({
    ID: uuidv4(),
    BOL_ID: '',
    EVENT_TYPE: 'Departure', // Default event type
    EVENT_DETAILS: '',
  });
  const [BOLDataList, setBOLDataList] = useState<BillOfLading[]>([]);

  useEffect(() => {
    fetchData();
    getShipments();
  }, []);

  const fetchData = async () => {
    // TODO findHash in API
    const blockData = await getBlockData(config.ABC_HASH);
    console.log(blockData);
  };

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

    // Send the event log data to the backend
    try {
      if (formData.BOL_ID) {
        const latestEvent = await sql.getLatestEventByBOLId(formData.BOL_ID);

        // TODO probably use hash instead of PREV ID
        const eventWithPreviousId = {
          ...formData,
          EVENT_PREVIOUS_ID: latestEvent.length > 0 ? latestEvent[0]?.ID : null,
        };
        sql.insertRecordEvent(eventWithPreviousId);

        if (formData.ID) {
          const event = await sql.getEventById(formData.ID);
          const hash = await commands.hashData(event);

          await sql.updateEventHash(hash, formData.ID);
        }
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
            <option value="Arrival">Arrival</option>
            <option value="In Transit">In Transit</option>
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
