import { config } from '../../config/config';

const MDS = (window as any).MDS;
/**
 * Creates a transaction, sending a small amount (0.000000000001) to the PIER2PIER_TREASURY address.
 * @param {<string>} hash The hash to send to blockchain with state:99
 * @returns {Promise<TransactionResponse>} A promise that resolves the Transaction Response.
 */
const sendHashToChain = (hash: string): Promise<TransactionResponse> => {
  return new Promise((resolve, reject) => {
    MDS.cmd(
      `send address:${config.PIER2PIER_TREASURY} amount:0.000000000001 tokenid:0x00 state:{"99":"${hash}"}`,
      (res) => {
        if (res) {
          resolve(res);
          console.log('Create transaction response:', res);
        } else {
          reject('Failed to send transaction');
        }
      },
    );
  });
};

/**
 * Hashes metadata.
 * @param {ShippingFormData} metaData The data to be hashed.
 * @returns {Promise<string>} A promise that resolves a string of the hash.
 */
const hashData = (metaData: BillOfLading | any): Promise<string> => {
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

/**
 * Sends a timestamp and associated metadata to the blockchain.
 *
 * @param hashedTimestamp - The cryptographic hash of the timestamp to record.
 * @param hashedMetaData - The cryptographic hash of additional metadata to associate with the timestamp.
 * @returns A promise that resolves with the response from the blockchain command or rejects with an error message.
 */
const sendTimestampHash = (hashedTimestamp: string, hashedMetaData: string) => {
  return new Promise((resolve, reject) => {
    MDS.cmd(
      `send amount:0.0000001 address:0xDDEEDDEEDDEEDD state:{"0":"${hashedTimestamp}","1":"${hashedMetaData}","2":"0x00"}`,
      (res) => {
        if (res) {
          resolve(res);
          console.log('Check hash response:', res);
        } else {
          reject('Failed to check hash ');
        }
      },
    );
  });
};

/**
 * Validates whether a specific hash exists on the blockchain.
 *
 * @param hash - The hash to validate on the blockchain.
 * @returns A promise that resolves with the response if the hash is found, or rejects with an error message.
 */
const isValid = (hash: string): Promise<Boolean> => {
  return new Promise((resolve, reject) => {
    MDS.cmd(`archive action:addresscheck address:0xDDEEDDEEDDEEDD statecheck:${hash}`, (res) => {
      if (res) {
        console.log('res', res);

        if (res.coins.created.length > 0) {
          const hashOnChain = res.coins.created[0].coin.state[1].data;
          console.log('hashOnChain', hashOnChain);
          if (hash === hashOnChain) {
            resolve(true);
          }
        }
        resolve(false);
      } else {
        reject(false);
      }
    });
  });
};

export const commands = {
  hashData,
  sendTimestampHash,
  sendHashToChain,
  isValid,
};
