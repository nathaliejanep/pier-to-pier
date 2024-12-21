import ContractService from './ContractService';

const deployContract = async (buyerPubKey: string, sellerPubKey: string, deletePubKey: string) => {
  try {
    const address = await ContractService.createContract();
    await ContractService.sendTxnState(buyerPubKey, sellerPubKey, deletePubKey);
    console.log('address', address);
  } catch (error) {
    console.error(`deployContract - ${error}`);
  }
};

export { deployContract };
