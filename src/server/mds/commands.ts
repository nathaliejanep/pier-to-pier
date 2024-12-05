import { config } from '../../config/config';

const MDS = (window as any).MDS;
/**
 * Creates a transaction, sending a small amount (0.0001) to the PIER2PIER_TREASURY address.
 * @returns {Promise<TransactionResponse>} A promise that resolves the Transaction Response.
 */
const createTxn = (): Promise<TransactionResponse> => {
  return new Promise((resolve, reject) => {
    MDS.cmd(`send address:${config.PIER2PIER_TREASURY} amount:0.0001`, (res) => {
      if (res) {
        resolve(res);
        console.log('Create transaction response:', res);
      } else {
        reject('Failed to send transaction');
      }
    });
  });
};

/**
 * Hashes metadata.
 * @param {ShippingFormData} metaData The data to be hashed.
 * @returns {Promise<string>} A promise that resolves a string of the hash.
 */
const hashData = (metaData: ShippingFormData): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stringMetaData = JSON.stringify(metaData);

    MDS.cmd(`hash data:${stringMetaData}`, (res) => {
      if (res) {
        const hash = res.response.hash;
        resolve(hash);
        console.log('Hash data response:', res);
        console.log(`Resolve hash: ${hash}`);
      } else {
        reject('Failed to get hash file');
      }
    });
  });
};

export const commands = {
  createTxn,
  hashData,
};
