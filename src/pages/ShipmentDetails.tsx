// Log and view event details
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { sql } from '../server/database';

interface EventDetailsProps {
  // TODO: update types
  BOL_ID: string;
  HASH: string;
}
// TODO:
// Shipment information at the top (e.g., ID, destination, status, etc.).
// List of associated events.
// Button to add an event.

const ShipmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [shipmentEventData, setShipmentEventData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchDetails();
    } else {
      setError('Invalid event ID');
    }
  }, [id]);

  const fetchDetails = async () => {
    if (!id) {
      setError('No ID provided.');
      return;
    }

    setLoading(true); // Start loading
    setError(null); // Reset error state

    try {
      const record = await sql.getEventsByBOLId(id);
      setShipmentEventData(record);
    } catch (error) {
      console.error('Error fetching events record:', error);
      setError('Failed to load event details');
    } finally {
      setLoading(false); // End loading
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="spinner-border animate-spin border-t-4 border-blue-500 rounded-full w-8 h-8"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!shipmentEventData) {
    return <div>No event details found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Event Details</h1>

      <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
        {/* Shipment Details Section */}
        <div className="container mx-auto p-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Shipment Details</h2>

            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full table-auto border-collapse bg-gray-300 shadow-md ">
                <tbody>
                  <tr className="border-b">
                    <td className="no-wrap  px-4 py-2 font-medium text-gray-700">BOL ID:</td>
                    <td className="px-4 py-2 text-gray-600">{shipmentEventData[0].BOL_ID}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="no-wrap px-4 py-2 font-medium text-gray-700">Shipper Name:</td>
                    <td className="px-4 py-2 text-gray-600">{shipmentEventData[0].SHIPPER_NAME}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="no-wrap px-4 py-2 font-medium text-gray-700">Consignee Name:</td>
                    <td className="px-4 py-2 text-gray-600">
                      {shipmentEventData[0].CONSIGNEE_NAME}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="no-wrap px-4 py-2 font-medium text-gray-700">Carrier Name:</td>
                    <td className="px-4 py-2 text-gray-600">{shipmentEventData[0].CARRIER_NAME}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="no-wrap px-4 py-2 font-medium text-gray-700">
                      Goods Description:
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {shipmentEventData[0].GOODS_DESCRIPTION}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="no-wrap px-4 py-2 font-medium text-gray-700">
                      Port of Loading:
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {shipmentEventData[0].PORT_OF_LOADING}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="no-wrap px-4 py-2 font-medium text-gray-700">
                      Port of Discharge:
                    </td>
                    <td className="no-wrap px-4 py-2 text-gray-600">
                      {shipmentEventData[0].PORT_OF_DISCHARGE}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-2/3 px-4 py-2 font-medium text-gray-700">Initial Hash:</td>
                    <td className="px-4 py-2 text-gray-600 break-words">
                      {shipmentEventData[0].INITIAL_HASH}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Event Logs Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Event Logs</h2>
          {shipmentEventData && shipmentEventData.length === 0 ? (
            <p className="text-gray-600">No events available.</p>
          ) : (
            <ul className="space-y-3">
              {shipmentEventData[0].EVENT_ID ? (
                shipmentEventData.map((event) => (
                  <li key={event.EVENT_ID} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-700">{event.EVENT_TYPE}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(event.EVENT_CREATED_AT).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{event.EVENT_DETAILS}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      <strong>Hash:</strong> {event.EVENT_HASH}
                    </p>
                    {event.EVENT_PREVIOUS_ID !== 'null' && (
                      <p className="text-sm text-gray-500 mt-2">
                        <strong>Previous Event ID:</strong> {event.EVENT_PREVIOUS_ID}
                      </p>
                    )}
                  </li>
                ))
              ) : (
                <div>
                  <p>No events</p>
                </div>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;
