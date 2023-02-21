import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { VideoPlayer } from "@videojs-player/react";

import "./index.css";

import titleLogo from "../../assets/shrine/title-logo.svg";

const ceremonyTypes = [
  {
    jp: "ウォレット安全祈願",
    en: "Wallet Safety Prayer",
  },
  {
    jp: "相場上昇祈祷",
    en: "Bull Market Prayer",
  },
  {
    jp: "プロジェクト成功祈祷",
    en: "Project Success Prayer",
  },
];

export const StartCeremony = () => {
  const navigate = useNavigate();
  const [showCeremony, setShowCeremony] = useState(false);

  const onVideoEnded = () => {
    setShowCeremony(true);
  };

  const onCeremonyClick = (layer: any) => {
    navigate(`/process-nft?title=${layer.jp}`, { replace: false });
  };

  return (
    <div className="start-ceremony-wrap">
      <VideoPlayer
        fluid
        muted
        autoplay
        src={require("assets/video2.mp4")}
        onEnded={onVideoEnded}
      />
      {showCeremony ? (
        <div className="start-ceremony-content">
          <div className="title">
            <img src={titleLogo} alt="" />
          </div>

          <div className="description">Start your online ceremony</div>
          <div className="ceremony-card-wrap">
            {ceremonyTypes.map((layer, i) => (
              <div
                className="ceremony-card-item"
                key={i}
                onClick={() => {
                  onCeremonyClick(layer);
                }}
              />
            ))}
          </div>

          <div
            className="ranking-touch"
            onClick={() => {
              navigate(`/nft-ranking`, { replace: false });
            }}
          >
            Top contributors ranking
          </div>
        </div>
      ) : null}
    </div>
  );
};
