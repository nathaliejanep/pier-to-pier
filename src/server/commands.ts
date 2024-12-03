const MDS = (window as any).MDS;

/**
 * Hash a given file data (Uint8Array) and return the hash.
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
  hashData,
};
