import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { VideoPlayer } from "@videojs-player/react";

import "./index.css";
import { getQueryParams } from "utils";
import { getMetaDataRes } from "api/request";

import titleLogo from "../../assets/shrine/title-logo.svg";

type INFT = {
  name: string;
  image: string;
  token_id: number;
};

export function NFTResult() {
  const navigate = useNavigate();
  const tokenId = getQueryParams("tokenId");
  const [nft, setNFT] = useState<INFT>();
  const [contentVisible, setContentVisible] = useState(false);

  const getMetaData = useCallback(async () => {
    if (tokenId) {
      const result: any = await getMetaDataRes(tokenId);
      setNFT(result.data);
    }
  }, [tokenId]);

  useEffect(() => {
    getMetaData();
  }, [getMetaData]);

  const onVideoEnded = () => {
    setContentVisible(true);
  };

  return (
    <div className="nft-result-wrap">
      <VideoPlayer
        fluid
        muted
        autoplay
        src={require("assets/video5.mp4")}
        onEnded={onVideoEnded}
      />
      {contentVisible ? (
        <div className="nft-result-content">
          {" "}
          <div className="title">
            <img src={titleLogo} alt="" />
          </div>
          <div className="description-wrap">
            <div className="descrition-inner"></div>
            <div className="descrition-text">
              Thank you for your pray and Congratulations!
            </div>
          </div>
          <div className="nft">
            <img src={nft?.image} alt="" />
            <span>
              {nft?.name} # {nft?.token_id}
            </span>
          </div>
          <div
            className="btn-confirm"
            onClick={() => {
              navigate("/my-nft");
            }}
          >
            View My Collection
          </div>
          <div
            className="btn-confirm"
            onClick={() => {
              navigate("/start");
            }}
          >
            Pray Again
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
