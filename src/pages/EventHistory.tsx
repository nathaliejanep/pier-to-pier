import { useEffect, useState } from 'react';
import { sql } from '../server/database';
import { NavLink } from 'react-router-dom';

const EventHistory: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // If history changes
  useEffect(() => {
    console.log('Updated history state:', history);
  }, [history]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true); // Set loading state
    setError(null); // Reset error state
    try {
      const records: [] = await sql.getRecords();
      setHistory(records);
    } catch (error) {
      console.error('Error fetching records:', error);
      setError('Failed to load event history'); // Set error message
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4">Event History</h1>

      {loading && (
        <div className="flex justify-center items-center">
          <div className="spinner-border animate-spin border-t-4 border-blue-500 rounded-full w-8 h-8"></div>
        </div>
      )}

      {error && !loading && <div className="text-red-500 text-center font-semibold">{error}</div>}

      {history.length === 0 && !loading && !error && (
        <div className="text-center text-gray-500">No records found.</div>
      )}

      {history.length > 0 && !loading && !error && (
        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full table-auto">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Details</th>
                <th className="px-6 py-3 text-left">Hash</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4">{record.ID}</td>
                  <td className="px-6 py-4">
                    <NavLink
                      to={`/eventhistory/${record.ID}`}
                      className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md inline-block text-center transition-all duration-300"
                    >
                      Details
                    </NavLink>
                  </td>
                  <td className="px-6 py-4">{record.HASH}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventHistory;
