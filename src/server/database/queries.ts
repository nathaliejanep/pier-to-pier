import { runQuery } from './run-query';
const table: string = 'portchain';

export const sql = {
  createTable: () =>
    runQuery(
      `
        CREATE TABLE IF NOT EXISTS ${table} (
        ID varchar(1024) NOT NULL,
        HASH varchar(1024) NOT NULL,
        UNIQUE (ID, HASH)
        )
    `,
    ),

  insertRecord: (id: string, hash: string) =>
    runQuery(
      `
        INSERT INTO ${table} (
        ID,
        HASH
        )
        VALUES (
        '${id}',
        '${hash}'
        )
    `,
    ),

  getRecords: () => runQuery(`SELECT * FROM ${table}`),

  updateTable: (hash: string, id: string) =>
    runQuery(
      `
        UPDATE ${table} SET
        HASH = '${hash}',
        WHERE ID = '${id}'
        `,
    ),

  getRecordById: (id: string) => runQuery(`SELECT * FROM ${table} WHERE id = '${id}'`),

  getAllUsers: () => runQuery('SELECT * FROM users'),
};
