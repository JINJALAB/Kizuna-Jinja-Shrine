import { EthService } from "./transactions/EthService";
import { WalletConnector } from "./walletService/WalletConnector";

const connector = new WalletConnector();

const ethService = new EthService(connector.web3);

export { connector, ethService };
