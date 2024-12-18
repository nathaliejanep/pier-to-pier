/* Shipping Supply Chain Contract */

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

export const contractScript = `LET deposit=PREVSTATE(0) LET finalpayment=PREVSTATE(1) LET shipmentproof=STATE(2) LET deliveryconfirmation=STATE(3) LET buyerpubkey=PREVSTATE(4) LET sellerpubkey=PREVSTATE(5) LET deletepubkey=PREVSTATE(6) LET lastpayment=[RETURN finalpayment-deposit] LET lastpayment=[RETURN finalpayment-deposit] IF SIGNEDBY(buyerpubkey) AND @AMOUNT EQ deposit AND shipmentproof EQ 0 THEN RETURN TRUE ENDIF IF SIGNEDBY(sellerpubkey) AND shipmentproof EQ 1 AND deliveryconfirmation EQ 0 THEN RETURN TRUE ENDIF IF SIGNEDBY(buyerpubkey) AND @AMOUNT EQ finalpayment AND shipmentproof EQ 1 AND deliveryconfirmation EQ 0 THEN RETURN TRUE ENDIF IF SIGNEDBY(sellerpubkey) AND deliveryconfirmation EQ 1 THEN RETURN TRUE ENDIF IF SIGNEDBY(deletepubkey) THEN RETURN TRUE ENDIF RETURN FALSE`;
// `LET deposit=PREVSTATE(0) LET finalpayment=PREVSTATE(1) LET shipmentproof=STATE(2) LET deliveryconfirmation=STATE(3) LET buyerpubkey=PREVSTATE(4) LET sellerpubkey=PREVSTATE(5) LET lastpayment=[RETURN finalpayment-deposit] LET lastpayment=[RETURN finalpayment-deposit] IF SIGNEDBY(buyerpubkey) AND @AMOUNT EQ deposit AND shipmentproof EQ 0 THEN RETURN TRUE ENDIF IF SIGNEDBY(sellerpubkey) AND shipmentproof EQ 1 AND deliveryconfirmation EQ 0 THEN RETURN TRUE ENDIF IF SIGNEDBY(buyerpubkey) AND @AMOUNT EQ finalpayment AND shipmentproof EQ 1 AND deliveryconfirmation EQ 0 THEN RETURN TRUE ENDIF IF SIGNEDBY(sellerpubkey) AND deliveryconfirmation EQ 1 THEN RETURN TRUE ENDIF RETURN FALSE`;

// /* Function to calculate milestone amount */
// FUNCTION calcMilestoneAmount $percent {
//     RETURN ($percent * totalAmount) / 100
// }

// /* Check if the caller is authorized */
// FUNCTION isAuthorized $address {
//     RETURN SIGNEDBY($address)
// }

// /* Main contract logic */
// IF isAuthorized(buyerAddress) AND currentMilestone EQ 0 AND shipmentLoaded EQ 1 THEN
//     /* Milestone 1: Release partial payment when shipment is loaded */
//     LET amount = calcMilestoneAmount(milestone1Percent)
//     IF VERIFYOUT(@INPUT sellerAddress amount @TOKENID FALSE) THEN
//         ASSERT SETSTATE(4 1)
//         RETURN TRUE
//     ENDIF
// ELSEIF isAuthorized(sellerAddress) AND currentMilestone EQ 1 AND shipmentArrived EQ 1 THEN
//     /* Milestone 2: Release payment when shipment arrives at destination */
//     LET amount = calcMilestoneAmount(milestone2Percent)
//     IF VERIFYOUT(@INPUT sellerAddress amount @TOKENID FALSE) THEN
//         ASSERT SETSTATE(4 2)
//         RETURN TRUE
//     ENDIF
// ELSEIF isAuthorized(buyerAddress) AND currentMilestone EQ 2 AND goodsReceived EQ 1 THEN
//     /* Milestone 3: Release final payment after buyer confirms receipt */
//     LET amount = calcMilestoneAmount(milestone3Percent)
//     IF VERIFYOUT(@INPUT sellerAddress amount @TOKENID FALSE) THEN
//         ASSERT SETSTATE(4 3)
//         RETURN TRUE
//     ENDIF

// ENDIF
// /* If none of the conditions are met, the transaction is invalid */
// RETURN FALSE`;

// ELSEIF isAuthorized(arbiterAddress) THEN
//     /* Arbiter can resolve disputes by releasing funds to either party */
//     LET remainingAmount = totalAmount - calcMilestoneAmount(milestone1Percent) - calcMilestoneAmount(milestone2Percent)
//     IF VERIFYOUT(@INPUT sellerAddress remainingAmount @TOKENID FALSE) OR VERIFYOUT(@INPUT buyerAddress remainingAmount @TOKENID FALSE) THEN
//         RETURN TRUE
//     ENDIF
// ENDIF
