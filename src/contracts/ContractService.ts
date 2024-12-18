// src/services/MinimaService.ts
/* State Variables:
   0 - Total Payment Amount
   1 - Milestone 1 Percentage (20-30%)
   2 - Milestone 2 Percentage (50%)
   3 - Milestone 3 Percentage (20-30%)
   4 - Current Milestone (0-3)
   5 - Buyer's Address
   6 - Seller's Address

   7 - Arbiter's Address (for dispute resolution)
   8 - Shipment Loaded Confirmation (0 or 1)
   9 - Shipment Arrived Confirmation (0 or 1)
   10 - Goods Received Confirmation (0 or 1)
*/

import { contractScript } from './contract-script';

const CONTRACT_STATE = {
  TOTAL_AMOUNT: 0,
  M1_DEPOSIT_PAYMENT: 1,
  M2_PROGRESS_PAYMENT: 2,
  M3_FINAL_PAYMENT: 3,
  CURRENT_MILESTONE: 4,
  BUYER_ADDRESS: 5,
  SELLER_ADDRESS: 6,
};

interface MinimaResponse {
  status: boolean;
  response: any;
  error: any;
}
const MDS = (window as any).MDS;

class ContractService {
  private static contractAddress: string;

  private static async executeCommand(command: string): Promise<MinimaResponse> {
    return new Promise((resolve, reject) => {
      MDS.cmd(command, (res: MinimaResponse) => {
        if (res.status) {
          console.log('Contract Res:', res);
          resolve(res);
        } else if (res.error === 'This command needs to be confirmed and is now pending..') {
          console.log('Pending res:', res);
          resolve(res);
        } else {
          console.log('res from command', res);
          reject(new Error(res.error));
        }
      });
    });
  }

  // TODO change payments and use helper funcs directly
  static async createContract(): Promise<string> {
    // Create contract
    const response = await this.executeCommand(
      `newscript script:"${contractScript}" trackall:true`,
    );
    const contractAddress = response.response.address;
    console.log('contractAddress: ', contractAddress);

    this.contractAddress = contractAddress;
    return contractAddress;
  }

  static async getPublicKeys(): Promise<any[]> {
    const res = await this.executeCommand(`keys`);
    const publicKeys = [
      {
        buyer: res.response.keys[0].publickey,
        seller: res.response.keys[1].publickey,
        deleted: res.response.keys[2].publickey,
      },
    ];

    return publicKeys;
  }

  static async sendTxnState(
    buyerPubKey: string,
    sellerPubKey: string,
    deletePubKey: string,
  ): Promise<void> {
    await this.executeCommand(
      `send address:MxG083F4E5FSYQ1SVNAQYV0M45T5V9T913Z03HNZVS6QVF4SFV6H6CZCQ7KW4WD amount:5 state:{"0":"5","1":"5","4":"${buyerPubKey}","5":"${sellerPubKey}","6":"${deletePubKey}"}`,
    );
    // `send address:${contractAddress} amount:${totalAmount} state:{"0":"${depositPayment}","1":"${totalAmount}","4":"0xB47CF7ACA492623083B678DD1184B8E64D30A42160A4411F095E8DEE36A6D302","5":"0xAE3EDC05D24A0EA80076E84831F41C7087C6FC9A6946A645A7DCE13B4B3CCA36"}`,
  }

  static async createTxnId(): Promise<void> {
    const txnId: string = 'cancel';
    await this.executeCommand(`txncreate id:${txnId}`);
    console.log(`txncreate id:${txnId}`);
  }

  static async cancelPaymentInput(): Promise<void> {
    const res = await this.executeCommand(`coins`);

    const foundCoin = res.response.find((coin) => {
      return coin.miniaddress === 'MxG083F4E5FSYQ1SVNAQYV0M45T5V9T913Z03HNZVS6QVF4SFV6H6CZCQ7KW4WD';
    });

    const coinId = foundCoin.coinid;

    await this.executeCommand(`txninput id:cancel coinid:${coinId}`);
  }

  static async cancelPaymentOutput(): Promise<void> {
    const txnId: string = 'cancel';

    // ${buyerAddress}
    await this.executeCommand(
      `txnoutput id:${txnId} address:MxG083PBN641J8EPZ02BYFJ2F58BHZ60RK5TPC5PMEV9M1YJ9V76HYSABZK5C9G amount:5`,
    );
  }

  static async inputTxnState(port, value): Promise<void> {
    const txnId: string = 'cancel';
    await this.executeCommand(`txnstate id:${txnId} port:${port} value:${value}`);
  }

  static async sign(buyerPubKey: string): Promise<void> {
    const txnId: string = 'cancel';
    //BUYER PBKEY
    await this.executeCommand(`txnsign id:cancel publickey:${buyerPubKey}`);
  }

  static async signDelete(deletePubKey: string): Promise<void> {
    const txnId: string = 'cancel';
    //BUYER PBKEY
    await this.executeCommand(
      `txnsign id:cancel publickey:${deletePubKey} txnpostauto:true txndelete:true`,
    );
  }

  // TODO delete if not
  // static async post(): Promise<void> {
  //   await this.executeCommand(`txnpost id:cancel`);
  // }
  // static async deleteTxnId(txnId: string): Promise<void> {
  //   await this.executeCommand(`txndelete id:${txnId}`);
  // }
  // static async setMMRProofs(): Promise<void> {
  //   await this.executeCommand(`txnbasics id:cancel`);
  // }
}

export default ContractService;
