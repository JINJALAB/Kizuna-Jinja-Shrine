import { useState, useCallback } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

import { VideoPlayer } from "@videojs-player/react";

import titleLogo from "../../assets/shrine/title-logo.svg";

import "./index.css";
import { getQueryParams } from "utils";

export function ProcessNFT() {
  const navigate = useNavigate();
  const title = getQueryParams("title");
  const [showContent, setShowContent] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [wishComment, setWishComment] = useState<string>("");

  const onInfoSubmit = useCallback(() => {
    if (!username) {
      return message.warning("Please type in your name or project name!");
    }

    navigate(
      `/pray?title=${title}&username=${username}&wishComment=${wishComment}`,
      { replace: false }
    );
  }, [title, username, wishComment, navigate]);

  const onVideoEnded = () => {
    setShowContent(true);
  };

  return (
    <div className="process-nft-wrap">
      <VideoPlayer
        fluid
        muted
        autoplay
        src={require("assets/video3.mp4")}
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
            <div className="form-inner">
              <div className="form-item">
                <div className="form-label personal-info">
                  Please type in your personal information
                </div>
                <input
                  type="text"
                  placeholder="Your Name or Project Name"
                  value={username}
                  onInput={(e: any) => {
                    setUsername(e.target.value);
                  }}
                />
              </div>
              <div className="form-item">
                <div className="form-label wish-comment">
                  Please leave a wish or comment
                </div>
                <textarea
                  placeholder="Please let us know the detail of your wish or leave a comment (optional)"
                  value={wishComment}
                  onInput={(e: any) => {
                    setWishComment(e.target.value);
                  }}
                />
              </div>

              <div className="btn-submit" onClick={onInfoSubmit}>
                Confirm
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
