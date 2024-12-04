// Log and view event details
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { sql } from '../server/database';

interface EventDetailsProps {
  // TODO: update types
  ID: string;
  HASH: string;
}
// TODO:
// Shipment information at the top (e.g., ID, destination, status, etc.).
// List of associated events.
// Button to add an event.

const ShipmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL params
  const [details, setDetails] = useState<EventDetailsProps | null>(null);
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
      // Make the query using the ID
      const record = await sql.getRecordById(id); // Ensure `id` is a valid string
      setDetails(record[0]); // Set the fetched details
      console.log(details);
    } catch (error) {
      console.error('Error fetching record:', error);
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

  if (!details) {
    return <div>No event details found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Event Details</h1>

      <div className="bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-2">{details.ID}</h2>
        <p className="text-gray-600 mb-4">Event Date: {details.ID}</p>
        <p className="text-gray-800">Hash: {details.HASH}</p>
      </div>
    </div>
  );
};

export default ShipmentDetails;
