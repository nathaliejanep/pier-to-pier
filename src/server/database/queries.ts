import { runQuery } from './run-query';
const table: string = 'portchain';

export const sql = {
  createTable: () =>
    runQuery(
      `
      CREATE TABLE IF NOT EXISTS ${table} (
        ID UUID DEFAULT RANDOM_UUID() PRIMARY KEY,
        HASH varchar(1024) NOT NULL,
        UNIQUE (ID, HASH)
      )
    `,
    ),
  // TODO add NOT NULL, UNIQUE
  createShipmentTable: () =>
    runQuery(
      `
      CREATE TABLE IF NOT EXISTS shipments (
        ID UUID DEFAULT RANDOM_UUID() PRIMARY KEY,
        INITIAL_HASH varchar(1024) NOT NULL,
        SOURCE_PORT varchar(255),
        DESTINATION_PORT varchar(255),
        SHIPPER_NAME varchar(255),
        CONSIGNEE_NAME varchar(255),
        GOODS_DESCRIPTION text,
        SHIPPING_MODE varchar(50),
        STATUS varchar(50),
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
    ),

  createBOLTable: () =>
    runQuery(
      `
      CREATE TABLE IF NOT EXISTS bills_of_lading (
        ID varchar(50) PRIMARY KEY,
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
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) 
      `,
    ),

  createEventLogTable: () =>
    runQuery(
      `
      CREATE TABLE IF NOT EXISTS event_logs (
        ID UUID DEFAULT RANDOM_UUID() PRIMARY KEY,
  
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
        CUSTOMS_DETAILS
      )
      VALUES (
        '${ID}', '${INITIAL_HASH}', '${SHIPPER_NAME}', '${CONSIGNEE_NAME}', '${CARRIER_NAME}',
        '${GOODS_DESCRIPTION}', '${CONTAINER_DETAILS}', '${PORT_OF_LOADING}', '${PORT_OF_DISCHARGE}',
        '${FREIGHT_CHARGES}', '${CUSTOMS_DETAILS}'
      ) 
     `,
    );
  },

  insertRecordEvent: (data: EventLog) => {
    const { BOL_ID, EVENT_TYPE, EVENT_DETAILS } = data;
    runQuery(
      `
      INSERT INTO event_logs (
        BOL_ID,
        EVENT_TYPE,
        EVENT_DETAILS
      )
      VALUES (
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

  getRecords: () => runQuery(`SELECT * FROM ${table}`),
  getBOLRecords: () => runQuery(`SELECT * FROM bills_of_lading`),
  getEventRecords: () => runQuery(`SELECT * FROM event_logs`),

  getEventsByBOLId: (bolId: string) =>
    runQuery(
      `
      SELECT 
        e.ID AS EVENT_ID,
        e.EVENT_TYPE,
        e.EVENT_DETAILS,
        e.CREATED_AT AS EVENT_CREATED_AT,
        b.ID AS BOL_ID,
        b.SHIPPER_NAME,
        b.CONSIGNEE_NAME,
        b.CARRIER_NAME,
        b.GOODS_DESCRIPTION,
        b.PORT_OF_LOADING,
        b.PORT_OF_DISCHARGE
      FROM 
        event_logs e
      JOIN 
        bills_of_lading b ON e.BOL_ID = b.ID
      WHERE 
        e.BOL_ID = '${bolId}'
      `,
    ),

  getRecordById: (id: string) => runQuery(`SELECT * FROM ${table} WHERE id = '${id}'`),

  dropTable: (tableName: string) => runQuery(`DROP TABLE ${tableName}`),
};
