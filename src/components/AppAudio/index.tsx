import ReactAudioPlayer from "react-audio-player";
import { useRef, useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store/store";
import { setCallAudioFn } from "store/reducers/donate";

import "./index.css";

export default function AppAudio(props: any) {
  const dispatch = useDispatch<AppDispatch>();
  const audioRef = useRef<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const onPlayAudio = useCallback(() => {
    const audioEl = audioRef?.current.audioEl;
    isOpen ? audioEl.current.pause() : audioEl.current.play();
    setIsOpen(!isOpen);
  }, [isOpen]);

  useEffect(() => {
    const callAudioFn = () => {
      audioRef?.current.audioEl.current.play();
      setIsShow(true);
      setIsOpen(true);
    };
    dispatch(setCallAudioFn(callAudioFn));
  }, [dispatch]);

  return (
    <div className="app-audio">
      <ReactAudioPlayer
        loop
        ref={audioRef}
        src={require("../../assets/BGM.mp3")}
      />
      {isShow && (
        <img
          onClick={onPlayAudio}
          src={require(`../../assets/sound-${isOpen ? "close" : "open"}.png`)}
          alt=""
        />
      )}
    </div>
  );
}
