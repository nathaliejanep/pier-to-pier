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
        HASH varchar(1024) NOT NULL,
        ORIGIN_PORT varchar(255),
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
        ID UUID DEFAULT RANDOM_UUID() PRIMARY KEY,
        HASH varchar(1024) NOT NULL,
        SHIPMENT_ID int,
        SHIPPER_NAME varchar(255),
        CONSIGNEE_NAME varchar(255),
        CARRIER_NAME varchar(255),
        GOODS_DESCRIPTION text,
        SHIPPING_MODE varchar(50),
        CONTAINER_DETAILS text,
        PORT_OF_LOADING varchar(255),
        PORT_OF_DISCHARGE varchar(255),
        FREIGHT_CHARGES varchar(50),
        CUSTOMS_DETAILS text,
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (SHIPMENT_ID) REFERENCES SHIPMENTS(ID)
      ) 
      `,
    ),

  createEventLogTable: () =>
    runQuery(
      `
      CREATE TABLE IF NOT EXISTS event_logs (
        ID UUID DEFAULT RANDOM_UUID() PRIMARY KEY,
        HASH varchar(1024) NOT NULL,
        SHIPMENT_ID int,
        EVENT_TYPE varchar(255),
        EVENT_DETAILS text,
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (SHIPMENT_ID) REFERENCES SHIPMENTS(ID)
      )
      `,
    ),

  insertRecord: (hash: string) =>
    runQuery(
      `
      INSERT INTO ${table} (

        HASH
        )
        VALUES (

        '${hash}'
      )
    `,
    ),

  insertRecordEvent: (shipmentId: string, eventType: string, eventDetails: string) =>
    runQuery(
      `
      INSERT INTO event_logs (
        shipment_id,
        event_type,
        event_details
      )
      VALUES (
        '${shipmentId}',
        '${eventType}',
        '${eventDetails}'
      )
        `,
    ),

  updateTable: (hash: string, id: string) =>
    runQuery(
      `
          UPDATE ${table} SET
          HASH = '${hash}',
          WHERE ID = '${id}'
          `,
    ),

  getRecords: () => runQuery(`SELECT * FROM ${table}`),
  getEventRecords: () => runQuery(`SELECT * FROM event_logs`),

  getRecordById: (id: string) => runQuery(`SELECT * FROM ${table} WHERE id = '${id}'`),

  dropTable: (tableName: string) => runQuery(`DROP TABLE ${tableName}`),
};
