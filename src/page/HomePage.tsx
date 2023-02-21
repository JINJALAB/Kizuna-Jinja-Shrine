/** @jsxImportSource @emotion/react */

import type MetaMaskOnboarding from "@metamask/onboarding";

import { connector } from "onchain/chainBridge";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectCallAudioFn,
  startLogin,
  switchNetwork,
} from "store/reducers/donate";
import type { AppDispatch } from "store/store";
import { VideoPlayer } from "@videojs-player/react";
import { getLocalStorge } from "utils";
import { HAS_LOGOUT_SHRINE } from "constant";

let playerInstance: any;

export function HomePage(props: any) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  let navigate = useNavigate();
  const onboarding = useRef<MetaMaskOnboarding>();
  const [showConnect, setShowConnect] = useState(false);
  const [isPlaying, setPlayingStatus] = useState(false);
  const callAudioFn: () => void = useSelector(selectCallAudioFn);

  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new connector.onBordingService();
    }
  }, []);

  const enterShrine = useCallback(() => {
    setPlayingStatus(true);
    playerInstance.play();
    callAudioFn && callAudioFn();
  }, [callAudioFn]);

  const connectWallet = useCallback(async () => {
    if (connector.isWalletInstalled()) {
      await dispatch(switchNetwork());
      const data = await dispatch(startLogin());
      if (data) {
        navigate(`/start`, { replace: false });
      }
    } else {
      onboarding.current?.startOnboarding();
    }
  }, [dispatch, navigate]);

  const onVideoMounted = (args: any) => {
    playerInstance = args.player;
  };

  const onVideoEnded = () => {
    const hadLogout = getLocalStorge(HAS_LOGOUT_SHRINE);
    if (hadLogout === "false") {
      navigate(`/start`, { replace: false });
    } else {
      setShowConnect(true);
    }
  };

  return (
    <div className="home-wrap">
      <VideoPlayer
        fluid
        src={require("assets/video.mp4")}
        onMounted={onVideoMounted}
        onEnded={onVideoEnded}
      />
      <div className="home-inner">
        {showConnect ? (
          <>
            <div className="sign-in-container img-bg">
              <div className="sign-in-metamask img-bg">
                <span onClick={connectWallet}>{t("signIn")}</span>
              </div>
              <div className="enter-tip-info connectWallet img-bg">
                <span>{t("signInConnect")}</span>
              </div>
            </div>
          </>
        ) : isPlaying ? (
          <></>
        ) : (
          <div className="enter-wrap">
            <div className="enter-container img-bg">
              <span onClick={enterShrine}>ENTER</span>
            </div>
            <div className="enter-tip-info img-bg">
              <span>{t("tapToBegin")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
