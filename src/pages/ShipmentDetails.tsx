import { Check, Close } from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { sql } from '../server/database';
import ContractService from '../contracts/ContractService';
import { appContext } from '../AppContext';
import { stringToBoolean } from '../utilities/converters';
interface EventDetailsProps {
  // TODO: update types
  BOL_ID: string;
  HASH: string;
}

const ShipmentDetails: React.FC = () => {
  const { publicKeys } = useContext(appContext);
  const { id } = useParams<{ id: string }>();
  const [shipmentEventData, setShipmentEventData] = useState<any | null>(null);
  const [depositPaid, setDepositPaid] = useState(false);
  const [paymentPaid, setPaymentPaid] = useState(false);
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

    setLoading(true);
    setError(null); // Reset error state

    try {
      const event = await sql.getEventsByBOLId(id);
      setShipmentEventData(event);
    } catch (error) {
      console.error('Error fetching events record:', error);
      setError('Failed to load event details');
    } finally {
      setLoading(false); // End loading
    }
  };

  const withdrawDeposit = async () => {
    const txnId = 'deposit';
    const contractAddress = shipmentEventData[0].CONTRACT_ADDRESS;
    const totalAmount: number = +shipmentEventData[0].FREIGHT_CHARGES;
    const depositAmount: number = totalAmount / 4;
    const remainingAmount: number = totalAmount - depositAmount;

    try {
      await ContractService.createTxnId(txnId);
      await ContractService.contractInput(txnId, contractAddress);

      // output to seller
      await ContractService.contractOutput(
        txnId,
        depositAmount,
        'MxG0866Z8TBMWBED17RW385QCAW122YMQW4MP8DAC4PFRUEW9M3ZB9JT80KC03M',
      );

      // remaining output to contract
      await ContractService.contractOutput(txnId, remainingAmount, contractAddress);

      // Send states to contract
      await ContractService.inputTxnState(txnId, 0, depositAmount);
      await ContractService.inputTxnState(txnId, 1, totalAmount);
      await ContractService.inputTxnState(txnId, 2, 1); // shipmentproof
      await ContractService.inputTxnState(txnId, 3, 0); // deliveryconfirmation
      await ContractService.inputTxnState(txnId, 4, publicKeys.buyer);
      await ContractService.inputTxnState(txnId, 5, publicKeys.seller);
      await ContractService.inputTxnState(txnId, 6, publicKeys.deleted);

      await ContractService.sign(txnId, publicKeys.seller);

      setDepositPaid(true);
      id && (await sql.updateBOLDepositOut(id));
    } catch (error) {
      console.error(`withdrawDeposit - ${error}`);
    }
  };

  // TODO add withdraw DEPOSIT, need two outputs and send all states.
  const withdrawFunds = async () => {
    const txnId: string = 'lastpayment';
    const contractAddress = shipmentEventData[0].CONTRACT_ADDRESS;
    const totalAmount: number = +shipmentEventData[0].FREIGHT_CHARGES;
    const depositAmount: number = totalAmount / 4;
    const remainingAmount: number = totalAmount - depositAmount;

    try {
      await ContractService.createTxnId(txnId);
      await ContractService.contractInput(txnId, contractAddress);
      await ContractService.contractOutput(
        txnId,
        remainingAmount,
        'MxG0866Z8TBMWBED17RW385QCAW122YMQW4MP8DAC4PFRUEW9M3ZB9JT80KC03M',
      );
      await ContractService.inputTxnState(txnId, 2, 1); // shipmentproof
      await ContractService.inputTxnState(txnId, 3, 1); // deliveryconfirmation

      await ContractService.sign(txnId, publicKeys.seller);

      setPaymentPaid(true);
      id && (await sql.updateBOLPaymentOut(id));
    } catch (error) {
      console.error(`withdrawFunds - ${error}`);
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

  const renderWithdrawBtns = (eventType: string, depositOut: string, paymentOut: string) => {
    switch (eventType) {
      case 'InTransit':
        return (
          !stringToBoolean(depositOut) &&
          !depositPaid && <button onClick={withdrawDeposit}>Withdraw Deposit</button>
        );

      case 'Delivered':
        return (
          !stringToBoolean(paymentOut) &&
          !paymentPaid && <button onClick={withdrawFunds}>Withdraw</button>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
        {/* Shipment Details Section */}
        {shipmentEventData && shipmentEventData.length > 0 && (
          <div className="container mx-auto ">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Shipment Details</h2>

              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full table-auto border-collapse bg-gray-300 shadow-md">
                  <tbody>
                    <tr className="border-b">
                      <td className="no-wrap  px-4 py-2 font-medium text-gray-700">BOL ID:</td>
                      <td className="px-4 py-2 text-gray-600">{shipmentEventData[0].BOL_ID}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="no-wrap  px-4 py-2 font-medium text-gray-700">
                        FREIGHT_CHARGES:
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {shipmentEventData[0].FREIGHT_CHARGES}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="no-wrap px-4 py-2 font-medium text-gray-700">Shipper Name:</td>
                      <td className="px-4 py-2 text-gray-600">
                        {shipmentEventData[0].SHIPPER_NAME}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="no-wrap px-4 py-2 font-medium text-gray-700">
                        Consignee Name:
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {shipmentEventData[0].CONSIGNEE_NAME}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="no-wrap px-4 py-2 font-medium text-gray-700">Carrier Name:</td>
                      <td className="px-4 py-2 text-gray-600">
                        {shipmentEventData[0].CARRIER_NAME}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="no-wrap px-4 py-2 font-medium text-gray-700">
                        Container Amount:
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {shipmentEventData[0].CONTAINER_AMOUNT}
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
                      <td className="border-b w-2/3 px-4 py-2 font-medium text-gray-700">
                        Initial Hash:
                      </td>
                      <td className="border-b px-4 py-2 text-gray-600 break-words p-">
                        {shipmentEventData[0].INITIAL_HASH}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b w-2/3 px-4 py-2 font-medium text-gray-700">Valid:</td>
                      <td className="px-4 py-2 text-gray-600 break-words">
                        {shipmentEventData[0].BOL_IS_VALID ? (
                          <Check className="text-green-700" />
                        ) : (
                          <Close className="text-red-700" />
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              {renderWithdrawBtns(
                shipmentEventData[shipmentEventData.length - 1].EVENT_TYPE, // Last item's EVENT_TYPE
                shipmentEventData[0].DEPOSIT_OUT,
                shipmentEventData[0].PAYMENT_OUT,
              )}
            </div>
          </div>
        )}

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

                    <p className="text-sm text-gray-500 mt-2">
                      {event.EVENT_IS_VALID ? (
                        <>
                          <strong>Valid: </strong> <Check className="text-green-700" />
                        </>
                      ) : (
                        <>
                          <strong>Valid: </strong> <Close className="text-red-700" />
                        </>
                      )}
                    </p>
                    {event.EVENT_PREVIOUS_HASH !== 'null' && (
                      <p className="text-sm text-gray-500 mt-2">
                        <strong>Previous Hash:</strong> {event.EVENT_PREVIOUS_HASH}
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
