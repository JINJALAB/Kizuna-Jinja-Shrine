import { VideoPlayer } from "@videojs-player/react";
import "./index.css";
import { useEffect, useState } from "react";

export default function AppLoading(props: {
  hasLoaded: boolean;
  setHasLoaded: any;
}) {
  const [total, setTotal] = useState(0);
  const [loadingPoint, setLoadingPoint] = useState("");
  const [percent, setPercent] = useState(0);

  const onVideo1Ended = () => {
    setTotal((p) => {
      return p + 1;
    });
  };
  const onVideo2Ended = () => {
    setTotal((p) => {
      return p + 2;
    });
  };
  const onVideo3Ended = () => {
    setTotal((p) => {
      return p + 3;
    });
  };
  const onVideo4Ended = () => {
    setTotal((p) => {
      return p + 4;
    });
  };
  const onVideo5Ended = () => {
    setTotal((p) => {
      return p + 5;
    });
  };

  /* 省略号 */
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingPoint((text) =>
        text.length > 2 ? (text = "") : (text += ".")
      );
    }, 400);
    return () => clearInterval(timer);
  }, []);

  /* 百分比 */
  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((percent) =>
        percent > 90 ? percent : (percent += Math.random() * 5)
      );
    }, 500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (total >= 15) {
      props.setHasLoaded(true);
    }
  }, [total, props]);

  return (
    <div className="app-loading-wrap">
      <div className="app-mask">
        <div className="loading">
          <span className="loading_text">Loading {loadingPoint}</span>
          <div className="progress">
            <div
              className="percent"
              style={{
                width: `${props.hasLoaded ? 100 : percent}%`,
              }}
            />
          </div>
        </div>
      </div>
      <VideoPlayer
        muted
        autoplay
        onCanPlayThrough={onVideo1Ended}
        src={require("assets/video.mp4")}
      />
      <VideoPlayer
        muted
        autoplay
        onCanPlayThrough={onVideo2Ended}
        src={require("assets/video2.mp4")}
      />
      <VideoPlayer
        muted
        autoplay
        onCanPlayThrough={onVideo3Ended}
        src={require("assets/video3.mp4")}
      />
      <VideoPlayer
        muted
        autoplay
        onCanPlayThrough={onVideo4Ended}
        src={require("assets/video4.mp4")}
      />
      <VideoPlayer
        muted
        autoplay
        onCanPlayThrough={onVideo5Ended}
        src={require("assets/video5.mp4")}
      />
    </div>
  );
}
