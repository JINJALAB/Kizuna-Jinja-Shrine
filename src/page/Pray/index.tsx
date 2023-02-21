import { useState } from "react";
import { Slider, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store/store";
import { startRaiseETH } from "store/reducers/donate";
import { getMintResultRes } from "api/request";

import { VideoPlayer } from "@videojs-player/react";

import "./index.css";
import { getQueryParams } from "utils";
import titleLogo from "../../assets/shrine/title-logo.svg";

const gradeToETHMap: any = {
  0: "Very Low",
  0.02: "Low",
  0.04: "Medium",
  0.06: "High",
  0.08: "Very High",
  0.1: "Extremely High",
};

export function Pray() {
  const navigate = useNavigate();
  const title = getQueryParams("title");
  const username = getQueryParams("username") as string;
  const wishComment =
    getQueryParams("wishComment") ||
    "I wish for happiness for all the people around the world!";
  const [showContent, setShowContent] = useState(false);
  const [raiseValue, setRaiseValue] = useState(0);
  const [isParying, setIsParying] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const onPary = () => {
    if (isParying) return;
    setIsParying(true);
    const refresh = async (hash: string) => {
      const result: any = await getMintResultRes(hash);
      if (result.data.code === "0") {
        navigate(`/nft-result?tokenId=${result.data.data.tokenId}`, {
          replace: false,
        });
      } else {
        setTimeout(() => {
          refresh(hash);
        }, 2000);
      }
    };
    dispatch(
      startRaiseETH(String(raiseValue), username, wishComment, refresh)
    ).catch((e) => {
      setIsParying(false);
    });
  };

  const onVideoEnded = () => {
    setShowContent(true);
  };

  return (
    <div className="process-nft-wrap">
      <VideoPlayer
        fluid
        muted
        autoplay
        src={require("assets/video4.mp4")}
        onEnded={onVideoEnded}
      />
      {showContent ? (
        <div className="process-nft-content">
          <div className="title">
            <img src={titleLogo} alt="" />
          </div>
          <div className="guide">
            <div>Choose your pray</div>
            <div>Type in Information</div>
            <div>Offering</div>
          </div>
          <div className="ceremony-type">{title}</div>
          <div className="content">
            <div className="form-wrap" />
            <div className="form-inner pray-wrap">
              <div className="__title">Please set your offering</div>
              <div className="text-content">
                <p>
                  You will receive your Omamori shortly after our ceremony at
                  Niigata, Japan within 48 hours.
                </p>
                <p>
                  The probability of receiving the rare Omamori would depend on
                  the value.
                </p>
              </div>
              <Slider
                min={0.0}
                max={0.1}
                step={0.02}
                value={raiseValue}
                tooltip={{
                  open: true,
                  formatter: (value) => {
                    return `${value} ETH`;
                  },
                }}
                onChange={(value) => {
                  setRaiseValue(value);
                }}
              />
              <div className="eth-grade">
                {gradeToETHMap[String(raiseValue)] + " Chance"}
              </div>
              <div className="btn-pray" onClick={onPary}>
                {isParying ? (
                  <Spin wrapperClassName="shrine-loading" />
                ) : (
                  <span>Pary</span>
                )}
              </div>
              {isParying ? (
                <div className="waiting-tips">
                  Please do not close this tab or move to other pages. This
                  process may take up to 1+ minutes. You will receive the NFT
                  when the transaction is processed.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
