import axios, { AxiosResponse } from "axios";

const apiPrefix = "";

type ApiStruct = {
  message: string;
  code: string;
  data: any;
};
// const getHeaders = (): { Authentication: string } => {
//   return { Authentication: window.localStorage.getItem("shrine-token") ?? "" };
// };
export const getMetaMaskLoginNonceRes = (
  userWalletAddr: string
): Promise<AxiosResponse<ApiStruct>> => {
  return axios
    .get(
      `${apiPrefix}/api/oauth/getMetaMaskLoginNonce?userWalletAddr=${userWalletAddr}`,
      {
        // headers: getHeaders(),
      }
    )
    .catch((err) => {
      throw err;
    });
};

export interface MetaMaskLoginPayload {
  userWalletAddr: string;
  loginSignature: string;
  loginMessage: string;
  loginNonce: string;
}

export const loginWithMetaMaskRes = (
  payload: MetaMaskLoginPayload
): Promise<AxiosResponse<ApiStruct>> => {
  return axios
    .post(`${apiPrefix}/api/oauth/metaMaskLogin`, payload, {
      // headers: getHeaders(),
    })
    .catch((err) => {
      throw err;
    });
};

export const verifyJwtTokenRes = (): Promise<AxiosResponse<ApiStruct>> => {
  return axios
    .post(`${apiPrefix}/api/oauth/verifyJwtToken`, null)
    .catch((err) => {
      throw err;
    });
};

export const getMyNFTsRes = (
  walletAddress: string
): Promise<AxiosResponse<ApiStruct>> => {
  return axios
    .get(
      `${apiPrefix}/api/shrine/getUserHoldNfts?pageIndex=1&pageSize=1000&userWalletAddr=${walletAddress}`
    )
    .catch((err) => {
      throw err;
    });
};

export const getUserPrayRankRes = (
  queryMonth: string
): Promise<AxiosResponse<ApiStruct>> => {
  return axios
    .get(
      `${apiPrefix}/api/shrine/queryUserPrayRank?pageIndex=1&pageSize=1000&queryMonth=${queryMonth}`
    )
    .catch((err) => {
      throw err;
    });
};

export const getMetaDataRes = (
  tokenId: string
): Promise<AxiosResponse<ApiStruct>> => {
  return axios.get(`${apiPrefix}/shrine/MetaData/${tokenId}`).catch((err) => {
    throw err;
  });
};

export const getLatestMintNftRes = (): Promise<AxiosResponse<ApiStruct>> => {
  return axios.get(`${apiPrefix}/api/shrine/getLatestMintNft`).catch((err) => {
    throw err;
  });
};

export const getMintResultRes = (
  hash: string
): Promise<AxiosResponse<ApiStruct>> => {
  return axios
    .get(`${apiPrefix}/api/shrine/getMintResult?txHash=${hash}`)
    .catch((err) => {
      throw err;
    });
};
