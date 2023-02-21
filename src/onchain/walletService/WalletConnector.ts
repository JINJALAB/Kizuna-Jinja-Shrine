import MetaMaskOnboarding from "@metamask/onboarding";
import { getChainConfig } from "utils";
import Web3 from "web3";

const chainConfig = getChainConfig();
export class WalletConnector {
  private ethereum = window.ethereum;
  public onBordingService;
  public web3;
  constructor() {
    this.web3 = new Web3(this.ethereum as any);
    this.onBordingService = MetaMaskOnboarding;
  }
  public isWalletInstalled() {
    return MetaMaskOnboarding.isMetaMaskInstalled();
  }
  public isConnect() {
    return this.ethereum.isConnected();
  }
  public async loginAndGetAccount() {
    return await this.ethereum.request({ method: "eth_requestAccounts" });
  }
  public async switchNetwork() {
    return await this.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: chainConfig.id,
        },
      ],
    });
  }

  /**
   * @description 钱包签名
   * @private
   */
  public async sign({
    nonce,
    walletAddress,
  }: {
    nonce: any;
    walletAddress: string;
  }): Promise<{
    walletAddress: string;
    signature: string;
    signMessage: string;
    nonce: string | number;
  }> {
    return new Promise((resolve, reject) => {
      const signMessage = `I am signing my one-time nonce: ${nonce}`;
      this.web3.eth.personal.sign(
        this.web3.utils.fromUtf8(signMessage),
        walletAddress,
        "password",
        (err, signature) => {
          if (err) return reject(err);
          return resolve({
            walletAddress,
            signature,
            signMessage,
            nonce,
          });
        }
      );
    });
  }
}
