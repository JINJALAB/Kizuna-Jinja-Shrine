import "App.css";
import { RouteObject, useRoutes } from "react-router-dom";
import { useState } from "react";
import { Banner } from "page/Banner";
import { HomePage } from "page/HomePage";
import { StartCeremony } from "page/StartCeremony";
import { ProcessNFT } from "page/ProcessNFT";
import { Pray } from "page/Pray";
import { NFTResult } from "page/NFTResult";
import { MyNFT } from "page/MyNFT";
import { NFTRanking } from "page/NFTRanking";

import AppLoading from "components/AppLoading";
import AppAudio from "components/AppAudio";

import { isMobile } from "utils";

import "video.js/dist/video-js.css";

const renderRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Banner />,
    children: [
      { index: true, element: <HomePage /> },
      { index: true, path: "/home", element: <HomePage /> },
      { index: true, path: "/start", element: <StartCeremony /> },
      { index: true, path: "/process-nft", element: <ProcessNFT /> },
      { index: true, path: "/pray", element: <Pray /> },
      { index: true, path: "/nft-result", element: <NFTResult /> },
      { index: true, path: "/my-nft", element: <MyNFT /> },
      { index: true, path: "/nft-ranking", element: <NFTRanking /> },
    ],
  },
];

export function App() {
  const [hasLoaded, setHasLoaded] = useState(false);

  const elements = useRoutes(renderRoutes);

  return (
    <div className={`App ${isMobile() ? "mobile" : "pc"}`}>
      {isMobile() ? (
        <>
          <div className="mobile-title">デスクトップよりお入りください。</div>
          <img src={require("./assets/shrine/mobile-nft.png")} alt="" />
          <div className="guide-to-pc">Please enter from the desktop.</div>
          <div className="mobile-logo">JINJA LAB</div>
        </>
      ) : !hasLoaded ? (
        <AppLoading hasLoaded={hasLoaded} setHasLoaded={setHasLoaded} />
      ) : (
        <>
          {elements}
          <AppAudio />
        </>
      )}
    </div>
  );
}
