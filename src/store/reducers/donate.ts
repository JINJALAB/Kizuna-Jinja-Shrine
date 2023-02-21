import { createSlice } from "@reduxjs/toolkit";
import { Toast } from "antd-mobile";
import { HAS_LOGOUT_SHRINE } from "constant";
import i18next from "i18next";
import { connector, ethService } from "onchain/chainBridge";
import type { AppDispatch, RootState } from "store/store";
import { getLocalStorge, getQueryParams, setLocalStorage } from "utils";

let hasInit = false;

interface NFTINFO {
  imgUrl: string;
}
const donateSlice = createSlice({
  name: "donate",
  initialState: {
    walletAddress: "",
    endTime: "",
    currentTime: "",
    targetValue: "",
    achievedValue: "",
    walletBalanceUSDT: "",
    walletBalanceETH: "",
    myDonateValue: "",
    mintThread: "",
    isDonating: false,
    isMinting: false,
    isApproving: false,
    isTakingBack: false,
    approvedValue: "",
    hasMint: false,
    canTakeTokenBack: false,
    myNFTs: [] as NFTINFO[],
    rate: "",
    netId: 0,
    callAudioFn: () => {},
  },
  reducers: {
    setWalletAddress: (state, action: { payload: string[] }) => {
      state.walletAddress = action.payload[0] ?? "";
    },
    setIsDonating: (state, action: { payload: boolean }) => {
      state.isDonating = action.payload;
    },
    setIsApproving: (state, action: { payload: boolean }) => {
      state.isApproving = action.payload;
    },
    setApprovedValue: (state, action: { payload: string }) => {
      state.approvedValue = action.payload;
    },
    setNetId: (state, action: { payload: number }) => {
      state.netId = action.payload;
    },
    setWalletBalanceETH: (state, action: { payload: string }) => {
      state.walletBalanceETH = action.payload;
    },
    setWalletBalanceUSDT: (state, action: { payload: string }) => {
      state.walletBalanceUSDT = action.payload;
    },
    setCallAudioFn: (state, action: { payload: any }) => {
      state.callAudioFn = action.payload;
    },
  },
});

export const startLogin = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const address = await connector.loginAndGetAccount();
      if (address) {
        setLocalStorage(HAS_LOGOUT_SHRINE, "false");
        await dispatch(setWalletAddress(address));
        dispatch(getWalletBalanceETH(address[0]));
        return true;
      } else {
        return false;
      }
    } catch (e) {}
  };
};

export const switchNetwork = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    await connector.switchNetwork();
  };
};

export const startLogout = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      setLocalStorage(HAS_LOGOUT_SHRINE, "true");
      dispatch(setWalletAddress([]));
      dispatch(setWalletBalanceETH(""));
      dispatch(setApprovedValue(""));
      dispatch(setWalletBalanceUSDT(""));
      window.location.href = "/";
    } catch (e) {}
  };
};

export const getCurrentNet = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const netId = await ethService.getCurrentNet();
      dispatch(setNetId(netId));
    } catch (e) {}
  };
};

export const getWalletBalanceETH = (walletAddress: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const res = await ethService.getBalanceETH(walletAddress);
      dispatch(setWalletBalanceETH(res));
    } catch (e) {}
  };
};

// 发起捐款交易
export const startRaiseETH = (
  value: string,
  username: string,
  content: string,
  refresh: any
) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      // const channel = getQueryParams("channel") ?? "";
      let { walletAddress } = getState().donate;
      if (!walletAddress) {
        await dispatch(startLogin());
        walletAddress = getState().donate.walletAddress;
        if (!walletAddress) return;
      }
      dispatch(setIsDonating(true));
      await ethService.transferETH(
        walletAddress,
        value,
        username,
        content,
        refresh
      );
      dispatch(getWalletBalanceETH(walletAddress));
    } catch (e: any) {
      throw new Error(e);
    } finally {
      dispatch(setIsDonating(false));
    }
  };
};

export const startRaiseUSDT = (value: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const channel = getQueryParams("channel") ?? "";
      let { walletAddress } = getState().donate;
      if (!walletAddress) {
        await dispatch(startLogin());
        walletAddress = getState().donate.walletAddress;
        if (!walletAddress) return;
      }
      dispatch(setIsDonating(true));
      await ethService.transferUSDT(walletAddress, value, channel);
    } catch (e) {
      console.error(e);
      const errorTip = i18next.t("tip.excueteFail");
      Toast.show({
        content: errorTip,
      });
    } finally {
      dispatch(setIsDonating(false));
    }
  };
};

export const startInit = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const hasLogout = getLocalStorge(HAS_LOGOUT_SHRINE);
      if (connector.isWalletInstalled() && !hasInit) {
        //listern address change
        window.ethereum.on("accountsChanged", (accounts: string[]) => {
          if (accounts.length === 0) {
            setLocalStorage(HAS_LOGOUT_SHRINE, "true");
          } else {
            setLocalStorage(HAS_LOGOUT_SHRINE, "false");
          }
          setTimeout(() => {
            window.location.reload();
          }, 500);
        });
        window.ethereum.on("chainChanged", () => {
          setTimeout(() => {
            window.location.reload();
          }, 500);
        });
        //init
        if (hasLogout && hasLogout !== "true") {
          dispatch(startLogin());
        }
        dispatch(getCurrentNet());
        hasInit = true;
      }
    } catch (e) {}
  };
};
export const selectWalletAddress = (state: RootState) =>
  state.donate.walletAddress;
export const selectEndTime = (state: RootState) => state.donate.endTime;
export const selectCurrentTime = (state: RootState) => state.donate.currentTime;
export const selectTargetValue = (state: RootState) => state.donate.targetValue;
export const selectMintThread = (state: RootState) => state.donate.mintThread;
export const selectWalletBalanceUSDT = (state: RootState) =>
  state.donate.walletBalanceUSDT;
export const selectWalletBalanceETH = (state: RootState) =>
  state.donate.walletBalanceETH;
export const selectAchieveValue = (state: RootState) =>
  state.donate.achievedValue;
export const selectMyDonateValue = (state: RootState) =>
  state.donate.myDonateValue;
export const selectIsDonating = (state: RootState) => state.donate.isDonating;
export const selectIsMinting = (state: RootState) => state.donate.isMinting;
export const selectIsApproving = (state: RootState) => state.donate.isApproving;
export const selectHasMint = (state: RootState) => state.donate.hasMint;
export const selectApprovedValue = (state: RootState) =>
  state.donate.approvedValue;
export const selectCanTakeTokenBack = (state: RootState) =>
  state.donate.canTakeTokenBack;
export const selectIsTakingBack = (state: RootState) =>
  state.donate.isTakingBack;
export const selectRate = (state: RootState) => state.donate.rate;
export const selectNetId = (state: RootState) => state.donate.netId;
export const selectCallAudioFn = (state: RootState) => state.donate.callAudioFn;

export const {
  setWalletAddress,
  setIsDonating,
  setApprovedValue,
  setIsApproving,
  setWalletBalanceUSDT,
  setWalletBalanceETH,
  setNetId,
  setCallAudioFn,
} = donateSlice.actions;

export default donateSlice.reducer;
