import { runQuery } from './run-query';

export const sql = {
  createBOLTable: () =>
    runQuery(
      `
      CREATE TABLE IF NOT EXISTS bills_of_lading (
        ID varchar(50),
        INITIAL_HASH varchar(1024) NOT NULL,
        IS_VALID boolean,
        SHIPPER_NAME varchar(255),
        CONSIGNEE_NAME varchar(255),
        CARRIER_NAME varchar(255),
        DEPOSIT_OUT boolean default FALSE,
        PAYMENT_OUT boolean default FALSE,
        CONTAINER_AMOUNT int,
        PORT_OF_LOADING varchar(255),
        PORT_OF_DISCHARGE varchar(255),
        FREIGHT_CHARGES varchar(50),
        CUSTOMS_DETAILS text,
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONTRACT_ADDRESS varchar(1024)
      ) 
      `,
    ),

  createEventLogTable: () =>
    runQuery(
      `
      CREATE TABLE IF NOT EXISTS event_logs (
        ID varchar(50),
        EVENT_HASH varchar(1024),
        IS_VALID boolean,
        EVENT_PREVIOUS_HASH varchar(1024),
        BOL_ID int,
        EVENT_TYPE varchar(255),
        EVENT_DETAILS text,
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (BOL_ID) REFERENCES bills_of_lading(ID)
      )
      `,
    ),

  insertRecordBOL: (data: BillOfLading) => {
    const {
      ID,
      INITIAL_HASH,
      SHIPPER_NAME,
      CONSIGNEE_NAME,
      CARRIER_NAME,
      CONTAINER_AMOUNT,
      PORT_OF_LOADING,
      PORT_OF_DISCHARGE,
      FREIGHT_CHARGES,
      CUSTOMS_DETAILS,
      CONTRACT_ADDRESS,
    } = data;
    runQuery(
      `
      INSERT INTO bills_of_lading (
        ID, 
        INITIAL_HASH,
        IS_VALID, 
        SHIPPER_NAME, 
        CONSIGNEE_NAME, 
        CARRIER_NAME,
        CONTAINER_AMOUNT, 
        PORT_OF_LOADING, 
        PORT_OF_DISCHARGE,
        FREIGHT_CHARGES, 
        CUSTOMS_DETAILS,
        CONTRACT_ADDRESS
      )
      VALUES (
        '${ID}', 
        '${INITIAL_HASH}', 
         NULL,
        '${SHIPPER_NAME}', 
        '${CONSIGNEE_NAME}', 
        '${CARRIER_NAME}', 
        '${CONTAINER_AMOUNT}', 
        '${PORT_OF_LOADING}', 
        '${PORT_OF_DISCHARGE}',
        '${FREIGHT_CHARGES}', 
        '${CUSTOMS_DETAILS}', 
        '${CONTRACT_ADDRESS}'
      ) 
     `,
    );
  },

  insertRecordEvent: (data: EventLog) => {
    const { ID, EVENT_PREVIOUS_HASH, BOL_ID, EVENT_TYPE, EVENT_DETAILS } = data;
    runQuery(
      `
      INSERT INTO event_logs (
        ID,
        EVENT_PREVIOUS_HASH,
        IS_VALID,
        BOL_ID,
        EVENT_TYPE,
        EVENT_DETAILS
      )
      VALUES (
        '${ID}',
        '${EVENT_PREVIOUS_HASH}',
         NULL,
        '${BOL_ID}',
        '${EVENT_TYPE}',
        '${EVENT_DETAILS}'
      )
        `,
    );
  },

  updateBOLHash: (hash: string, id: string) =>
    runQuery(
      `
        UPDATE bills_of_lading SET
        INITIAL_HASH = '${hash}'
        WHERE ID = '${id}'
      `,
    ),

  updateBOLHashIsValid: (isValid: Boolean, id: string) =>
    runQuery(
      `
          UPDATE bills_of_lading SET
          IS_VALID = '${isValid}'
          WHERE ID = '${id}'
        `,
    ),

  updateBOLDepositOut: (id: string) =>
    runQuery(
      `
          UPDATE bills_of_lading SET
          DEPOSIT_OUT = TRUE
          WHERE ID = '${id}'
        `,
    ),

  updateBOLPaymentOut: (id: string) =>
    runQuery(
      `
          UPDATE bills_of_lading SET
          PAYMENT_OUT = TRUE
          WHERE ID = '${id}'
        `,
    ),

  updateEventHash: (hash: string, id: string) =>
    runQuery(
      `
          UPDATE event_logs SET
          EVENT_HASH = '${hash}'
          WHERE ID = '${id}'
          `,
    ),

  updateEventHashIsValid: (isValid: Boolean, id: string) =>
    runQuery(
      `
          UPDATE event_logs SET
          IS_VALID = '${isValid}'
          WHERE ID = '${id}'
        `,
    ),

  getBOLRecords: () => runQuery(`SELECT * FROM bills_of_lading`),
  getEventRecords: () => runQuery(`SELECT * FROM event_logs`),

  getBOLById: (bolId: string) =>
    runQuery(`
        SELECT * FROM bills_of_lading
        WHERE ID = '${bolId}'
`),

  getEventsByBOLId: (bolId: string) =>
    runQuery(
      `
        SELECT
          b.ID AS BOL_ID,
          b.FREIGHT_CHARGES,
          b.DEPOSIT_OUT,
          b.PAYMENT_OUT,
          b.SHIPPER_NAME,
          b.CONSIGNEE_NAME,
          b.CARRIER_NAME,
          b.CONTAINER_AMOUNT,
          b.PORT_OF_LOADING,
          b.PORT_OF_DISCHARGE,
          b.INITIAL_HASH,
          b.IS_VALID as BOL_IS_VALID,
          b.CONTRACT_ADDRESS,
          e.ID AS EVENT_ID,
          e.EVENT_HASH,
          e.IS_VALID as EVENT_IS_VALID,
          e.EVENT_TYPE,
          e.EVENT_DETAILS,
          e.EVENT_PREVIOUS_HASH,
          e.CREATED_AT AS EVENT_CREATED_AT
        FROM
          bills_of_lading b
        LEFT JOIN
          event_logs e ON b.ID = e.BOL_ID
        WHERE
          b.ID = '${bolId}'
        ORDER BY
          e.CREATED_AT ASC      
      `,
    ),

  getLatestEventByBOLId: (bolId: string) =>
    runQuery(
      `
        SELECT EVENT_HASH
        FROM event_logs
        WHERE BOL_ID = '${bolId}'
        ORDER BY CREATED_AT DESC
        LIMIT 1
      `,
    ),

  getEventById: (id: string) => runQuery(`SELECT * FROM event_logs WHERE id = '${id}'`),

  dropTable: (tableName: string) => runQuery(`DROP TABLE ${tableName}`),
};
