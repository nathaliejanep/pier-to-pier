import { useEffect, useState } from 'react';
import { config } from '../../config/config';
import { getBlockData } from '../../utilities/api';
import { sql } from '../../server/database';

// Component for logging events
const EventForm: React.FC = () => {
  const [formData, setFormData] = useState<EventLog>({
    BOL_ID: '',
    EVENT_TYPE: 'Departure', // Default event type
    EVENT_DETAILS: '',
  });
  const [BOLDataList, setBOLDataList] = useState<BillOfLading[]>([]);

  useEffect(() => {
    fetchData();
    getShipments();
    // sql.createEventLogTable();
    // sql.dropTable('event_logs');
  }, []);

  const fetchData = async () => {
    const blockData = await getBlockData(config.ABC_HASH);
    console.log(blockData);
  };

  const getShipments = async () => {
    const BOLData = await sql.getBOLRecords();
    const eventData = await sql.getEventRecords();
    const eventsByBOLId = await sql.getEventsByBOLId('123456');
    console.log('eventsByBOLId', eventsByBOLId);

    setBOLDataList(BOLData);
    console.log(BOLData);
    console.log('eventData', eventData);
  };
  // Handle form input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send the event log data to the backend
    try {
      console.log('Form submitted successfully with data: ', formData);

      sql.insertRecordEvent(formData);
      // Reset form
      setFormData({
        BOL_ID: '',
        EVENT_TYPE: 'Departure',
        EVENT_DETAILS: '',
      });
      // alert('Event logged successfully!');
    } catch (error) {
      console.error('Failed to log event: ', error);
      alert('Error logging event.');
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
