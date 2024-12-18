/* State Variables:
   0 - Total Payment Amount 
   1 - Milestone 1 Percentage (20-30%)
   2 - Milestone 2 Percentage (50%)
   3 - Milestone 3 Percentage (20-30%)
   4 - Current Milestone (0-3)
   5 - Buyer's Address
   6 - Seller's Address
   7 - Arbiter's Address (for dispute resolution)
   8 - Shipment Loaded Confirmation (0 or 1)
   9 - Shipment Arrived Confirmation (0 or 1)
   10 - Goods Received Confirmation (0 or 1)
*/

// MILESTONES
const milestone = {
  PAYMENT_INITIALIZED: 0,
  WORK_IN_PROGRESS: 1,
  WORK_COMPLETED: 2,
  CONTRACT_CLOSED: 3,
};

export { milestone };
