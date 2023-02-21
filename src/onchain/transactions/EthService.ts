import raiseAbi from "onchain/abi/raiseAbi.json";
import { getAddressConfig } from "utils";
import type Web3 from "web3";
const addressConfig = getAddressConfig();
export class EthService {
  raiseContractAddr: string;
  raiseContract;
  web3: Web3;
  constructor(web3: Web3) {
    this.web3 = web3;
    this.raiseContractAddr = web3.utils.toChecksumAddress(
      addressConfig.raiseContractAddr
    );

    this.raiseContract = new web3.eth.Contract(
      raiseAbi as any,
      this.raiseContractAddr
    );
  }
  private async _getNonce(userAddress: string) {
    return await this.web3.eth.getTransactionCount(userAddress);
  }

  public async getBalanceETH(userAddress: string) {
    const value = await this.web3.eth.getBalance(userAddress);
    const balance = await this.web3.utils.fromWei(value, "ether");
    return balance;
  }
  public async getCurrentNet() {
    const value = await this.web3.eth.net.getId();
    return value;
  }

  private async getGasPrice() {
    return await this.web3.eth.getGasPrice();
  }

  public async transferETH(
    userAddress: string,
    value: string,
    username: string,
    content: string,
    refresh: any,
    useConfirmCb?: () => void
  ) {
    const transData = this.raiseContract.methods
      .Donate(username, content)
      .encodeABI();
    const gasPrice = await this.getGasPrice();
    const transObj = {
      from: userAddress,
      to: this.raiseContractAddr,
      nonce: await this._getNonce(userAddress),
      gas: 420000,
      value: this.web3.utils.toWei(value, "ether"),
      gasPrice,
      data: transData,
    };
    const receipt = await this.web3.eth
      .sendTransaction(transObj)
      .once("transactionHash", (hash) => {
        refresh?.(hash);
        useConfirmCb?.();
      })
      .catch((e) => {
        throw new Error(e);
      });
    return receipt;
  }

  public async transferUSDT(
    userAddress: string,
    value: string,
    channel: string,
    useConfirmCb?: () => void
  ) {
    const transData = this.raiseContract.methods
      .takeTokenUSD(this.web3.utils.toWei(value, "mwei"), channel)
      .encodeABI();
    const gasPrice = await this.getGasPrice();
    const transObj = {
      from: userAddress,
      to: this.raiseContractAddr,
      nonce: await this._getNonce(userAddress),
      gas: 220000,
      value: 0,
      gasPrice,
      data: transData,
    };
    const receipt = await this.web3.eth
      .sendTransaction(transObj)
      .once("transactionHash", (hash) => {
        useConfirmCb?.();
      })
      .catch((e) => {
        throw new Error(e);
      });
    return receipt;
  }
}
