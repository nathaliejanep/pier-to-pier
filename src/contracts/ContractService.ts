interface MinimaResponse {
  status: boolean;
  response: any;
  error: any;
  pending?: boolean;
} // TODO move this
const MDS = (window as any).MDS;

class ContractService {
  private static async executeCommand(command: string): Promise<MinimaResponse> {
    return new Promise((resolve, reject) => {
      MDS.cmd(command, (res: MinimaResponse) => {
        if (res.status) {
          // console.log('Contract Res:', res);
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

  async createContract(BOLId: string): Promise<string> {
    const response = await ContractService.executeCommand(
      `newscript script:"LET deposit=PREVSTATE(0) LET totalpayment=PREVSTATE(1) LET shipmentproof=STATE(2) LET deliveryconfirmation=STATE(3) LET buyerpubkey=PREVSTATE(4) LET sellerpubkey=PREVSTATE(5) LET deletepubkey=PREVSTATE(6) LET bolid=${BOLId} LET remainingpayment=totalpayment-deposit IF SIGNEDBY(buyerpubkey) AND @AMOUNT EQ deposit AND shipmentproof EQ 0 THEN RETURN TRUE ENDIF IF SIGNEDBY(sellerpubkey) AND shipmentproof EQ 1 AND deliveryconfirmation EQ 0 THEN RETURN TRUE ENDIF IF SIGNEDBY(buyerpubkey) AND @AMOUNT EQ remainingpayment AND shipmentproof EQ 1 AND deliveryconfirmation EQ 0 THEN RETURN TRUE ENDIF IF SIGNEDBY(sellerpubkey) AND deliveryconfirmation EQ 1 THEN RETURN TRUE ENDIF IF SIGNEDBY(deletepubkey) THEN RETURN TRUE ENDIF RETURN FALSE" trackall:true`,
    );
    const contractAddress = response.response.miniaddress;

    return contractAddress;
  }

  async getPublicKeys(): Promise<IPublicKeys> {
    const res = await ContractService.executeCommand(`keys`);
    const publicKeys = {
      buyer: res.response.keys[0].publickey,
      seller: res.response.keys[1].publickey,
      deleted: res.response.keys[2].publickey,
    };

    return publicKeys;
  }

  async sendTxnState(contractAddress: string, freightCharges: number, publicKeys: IPublicKeys) {
    const { buyer, seller, deleted } = publicKeys;
    const deposit = freightCharges / 4;

    const res = await ContractService.executeCommand(
      `send address:${contractAddress} amount:${freightCharges} state:{"0":"${deposit}","1":"${freightCharges}","4":"${buyer}","5":"${seller}","6":"${deleted}"} storestate:true`,
    );

    return res;
  }

  static async createTxnId(txnId: string): Promise<void> {
    await this.executeCommand(`txncreate id:${txnId}`);
    console.log(`txncreate id:${txnId}`);
  }

  static async contractInput(txnId: string, contractAddress: string): Promise<void> {
    const res = await this.executeCommand(`coins`);

    const foundCoin = res.response.find((coin) => {
      return coin.miniaddress === `${contractAddress}`;
    });

    // TODO make sure both coins have input output

    console.log('1: ', `txninput id:${txnId} coinid:${foundCoin.coinid}`);
    await this.executeCommand(`txninput id:${txnId} coinid:${foundCoin.coinid}`);
  }

  static async contractOutput(txnId: string, amount: number, address: string): Promise<void> {
    // ${buyerAddress}
    console.log(`2: txnoutput id:${txnId} address:${address} amount:${amount} storestate:true`);
    // TODO get actual address
    await this.executeCommand(
      `txnoutput id:${txnId} address:${address} amount:${amount} storestate:true`,
    );
  }

  static async inputTxnState(txnId: string, port, value): Promise<void> {
    console.log(`2+3: txnstate id:${txnId} port:${port} value:${value}`);
    await this.executeCommand(`txnstate id:${txnId} port:${port} value:${value}`);
  }

  static async sign(txnId: string, buyerPubKey: string): Promise<void> {
    console.log(`4. txnsign id:${txnId} publickey:${buyerPubKey} txnpostauto:true txndelete:true`);
    //BUYER PBKEY
    await this.executeCommand(
      `txnsign id:${txnId} publickey:${buyerPubKey} txnpostauto:true txndelete:true`,
    );
  }
}

export default ContractService;
