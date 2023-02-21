import { useState, useEffect, useCallback } from "react";

import { useNavigate } from "react-router-dom";

import { getMyNFTsRes, getMetaDataRes } from "api/request";

import avatar from "../../assets/shrine/avatar.png";

import { selectWalletAddress } from "store/reducers/donate";
import { useSelector } from "react-redux";
import { Modal } from "antd";
import titleLogo from "../../assets/shrine/title-logo.svg";

import "./index.css";

export function MyNFT() {
  const navigate = useNavigate();
  const walletAddress = useSelector(selectWalletAddress);
  const [myNFTs, setMyNFTs] = useState([]);
  const [isNFTModalOpen, setIsNFTModalOpen] = useState(false);
  const [nftModalDetails, setNFTModalDetails] = useState({} as any);

  const getMyNFTs = useCallback(async () => {
    if (walletAddress) {
      const result = await getMyNFTsRes(walletAddress);
      setMyNFTs(result.data.data?.list);
    }
  }, [walletAddress]);

  useEffect(() => {
    getMyNFTs();
  }, [getMyNFTs]);

  const onNFTModalShow = useCallback(async (scope: any) => {
    if (scope) {
      const result = await getMetaDataRes(scope.tokenId);
      const metaData: any = result.data;
      setNFTModalDetails({
        ...metaData,
        attrType: (
          metaData.attributes.find((x: any) => x.trait_type === "type") || {}
        ).value,
        attrEdition: (
          metaData.attributes.find((x: any) => x.trait_type === "edition") || {}
        ).value,
      });
      setIsNFTModalOpen(true);
    } else {
      setNFTModalDetails({});
      setIsNFTModalOpen(false);
    }
  }, []);

  return (
    <div className="my-nft-wrap">
      <div className="nft-content">
        <div className="title">
          <img src={titleLogo} alt="" />
        </div>
        <div className="userInfo">
          <img src={avatar} alt="" className="avatar" />
          <div className="name-address">
            <span className="name">{walletAddress.slice(0, 8)}</span>
            <span className="address">{walletAddress}</span>
          </div>
        </div>
        <div className="nfts-wrap">
          <div className="nfts-inner">
            {myNFTs.map((x: any, i) => (
              <div
                className="nft-layer"
                key={i}
                onClick={() => onNFTModalShow(x)}
              >
                <img src={x.imageUrl} alt="" />
                <span>{`${x.tokenName} # ${x.tokenId}`}</span>
              </div>
            ))}
          </div>
        </div>
        <div
          className="btn-back"
          onClick={() => {
            navigate("/start");
          }}
        >
          Back
        </div>
        <Modal
          centered
          open={isNFTModalOpen}
          footer={null}
          onCancel={() => onNFTModalShow(null)}
        >
          <img src={nftModalDetails.image} alt="" />
          <div className="nft-modal-content-details">
            <p className="userName">{`${nftModalDetails.name} # ${nftModalDetails.token_id}`}</p>
            <p className="attrType">
              <span>{nftModalDetails.attrType}</span>
              {nftModalDetails.token_id <= 1200 ? (
                <span>{nftModalDetails.attrEdition} / 1200</span>
              ) : null}
            </p>
            <p className="description">{nftModalDetails.description}</p>
            <div className="attrs-wrap">
              {nftModalDetails.attributes &&
                nftModalDetails.attributes.map((attr: any, index: number) => {
                  return attr.value ? (
                    <div className="attr-layer" key={index}>
                      <span>{attr.trait_type}</span>
                      <span>{attr.value}</span>
                    </div>
                  ) : null;
                })}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
