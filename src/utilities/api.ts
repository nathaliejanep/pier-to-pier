import axios from 'axios';
import { config } from '../config/config';

// TODO check if I should search testnet instead of API
/**
 * Fetches block data from the API based on the provided hash.
 *
 * @async
 * @function fetchBlockData
 * @param {string} hash - The hash of the block to retrieve.
 * @returns {Promise<Object|null>} The block data if the request is successful, or `null` if an error occurs.
 * @throws Will log an error to the console if the request fails.
 */
const getBlockData = async (hash: string) => {
  try {
    const res = await axios.get(`${config.API_GET_BLOCK_URL}/search?q=${hash}`);
    return res.data.results;
  } catch (err) {
    console.error(`Failed to fetch block data for hash: ${hash}`, err);
  }
};

export { getBlockData };
