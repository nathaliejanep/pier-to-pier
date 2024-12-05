import axios from 'axios';
import { config } from '../config/config';

const getBlock = async (hash: string) => {
  try {
    const res = await axios.get(`${config.API_GET_BLOCK_URL}/search?q=${hash}`);
    return res.data;
  } catch (err) {
    console.error(`Failed to fetch block data for hash: ${hash}`, err);
  }
};

export { getBlock };
