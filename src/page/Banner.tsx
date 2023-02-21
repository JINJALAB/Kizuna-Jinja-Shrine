/** @jsxImportSource @emotion/react */

import type MetaMaskOnboarding from "@metamask/onboarding";
import { Popover } from "antd";
import UserIcon from "assets/shrine/user.png";
import { HAS_LOGOUT_SHRINE } from "constant";
import { connector } from "onchain/chainBridge";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import {
  selectWalletAddress,
  startInit,
  startLogout,
} from "store/reducers/donate";
import type { AppDispatch } from "store/store";
import { getLocalStorge } from "utils";

function ChangeLocaleMask(props: { walletAddress: string }) {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const nav = useNavigate();

  const content = () => {
    return (
      <>
        <div
          className="menu-pop-item"
          onClick={() => {
            nav(`/my-nft`, { replace: false });
          }}
        >
          <span>My Collection</span>
        </div>
        <div
          className="menu-pop-item"
          onClick={() => {
            nav(`/nft-ranking`, { replace: false });
          }}
        >
          <span>Ranking</span>
        </div>
        <a className="menu-pop-item" href="https://www.jinjalab.com/">
          Guide & About Us
        </a>
        <div
          className="menu-pop-item"
          onClick={() => {
            dispatch(startLogout());
          }}
        >
          <span>Leave the Shrine</span>
        </div>
      </>
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    setVisible(newOpen);
  };

  return (
    <>
      <Popover
        content={content}
        trigger="hover"
        open={visible}
        overlayClassName="user-popover"
        onOpenChange={handleOpenChange}
      >
        <img
          src={UserIcon}
          style={{ width: 30, cursor: "pointer" }}
          alt="logo"
          onClick={() => setVisible(true)}
        />
      </Popover>
    </>
  );
}

export function Banner() {
  const dispatch = useDispatch<AppDispatch>();
  const onboarding = useRef<MetaMaskOnboarding>();
  const walletAddress = useSelector(selectWalletAddress);
  const hadLogout = getLocalStorge(HAS_LOGOUT_SHRINE);

  const nav = useNavigate();

  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new connector.onBordingService();
    }
  }, []);

  useEffect(() => {
    dispatch(startInit());
  }, [dispatch]);

  useEffect(() => {
    if (hadLogout === "true") {
      nav(`/`, { replace: false });
    }
  }, [nav, hadLogout]);

  return (
    <>
      {hadLogout === "false" && (
        <div className="banner-container">
          <ChangeLocaleMask walletAddress={walletAddress} />
        </div>
      )}
      <Outlet />
    </>
  );
}
