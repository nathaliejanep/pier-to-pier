import { runQuery } from './run-query';
const table: string = 'portchain';

export const sql = {
  createBOLTable: () =>
    runQuery(
      `
      CREATE TABLE IF NOT EXISTS bills_of_lading (
        ID varchar(50),
        INITIAL_HASH varchar(1024) NOT NULL,
        SHIPPER_NAME varchar(255),
        CONSIGNEE_NAME varchar(255),
        CARRIER_NAME varchar(255),
        GOODS_DESCRIPTION text,
        CONTAINER_DETAILS text,
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
      GOODS_DESCRIPTION,
      CONTAINER_DETAILS,
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
        SHIPPER_NAME, 
        CONSIGNEE_NAME, 
        CARRIER_NAME,
        GOODS_DESCRIPTION, 
        CONTAINER_DETAILS, 
        PORT_OF_LOADING, 
        PORT_OF_DISCHARGE,
        FREIGHT_CHARGES, 
        CUSTOMS_DETAILS,
        CONTRACT_ADDRESS
      )
      VALUES (
        '${ID}', '${INITIAL_HASH}', '${SHIPPER_NAME}', '${CONSIGNEE_NAME}', '${CARRIER_NAME}',
        '${GOODS_DESCRIPTION}', '${CONTAINER_DETAILS}', '${PORT_OF_LOADING}', '${PORT_OF_DISCHARGE}',
        '${FREIGHT_CHARGES}', '${CUSTOMS_DETAILS}', '${CONTRACT_ADDRESS}'
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
        BOL_ID,
        EVENT_TYPE,
        EVENT_DETAILS
      )
      VALUES (
        '${ID}',
        '${EVENT_PREVIOUS_HASH}',
        '${BOL_ID}',
        '${EVENT_TYPE}',
        '${EVENT_DETAILS}'
      )
        `,
    );
  },

  updateTable: (hash: string, id: string) =>
    runQuery(
      `
          UPDATE ${table} SET
          HASH = '${hash}',
          WHERE ID = '${id}'
          `,
    ),

  updateBOLHash: (hash: string, id: string) =>
    runQuery(
      `
          UPDATE bills_of_lading SET
          INITIAL_HASH = '${hash}'
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

  getRecords: () => runQuery(`SELECT * FROM ${table}`),
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
          b.SHIPPER_NAME,
          b.CONSIGNEE_NAME,
          b.CARRIER_NAME,
          b.GOODS_DESCRIPTION,
          b.PORT_OF_LOADING,
          b.PORT_OF_DISCHARGE,
          b.INITIAL_HASH,
          b.CONTRACT_ADDRESS,
          e.ID AS EVENT_ID,
          e.EVENT_HASH,
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
