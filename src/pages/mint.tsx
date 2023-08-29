import { Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
// import { useProgram } from '../utils/useProgram';
import { openNotification, sleep } from '../utils/components';
// import { useWeb3 } from '../utils/useWeb3';

export default function Mint() {
  // const wallet = useWeb3().walletAddress;
  // const { stake_token, getStakingPoolData } = useProgram();

  const [mintAmount, setMintAmount] = useState('');

  const [isMintLoading, setIsMintLoading] = useState(false);

  return (
    <div className="minting-dashboard">
      <div className="minting-panel">
        <div className="minting-panel-title">
          <h2>WOLFIES BOOSTER NFT MINT</h2>
        </div>
        <div className="minting-panel-nft-hero">
          <video autoPlay loop width="300">
            <source src="/images/WolfieBoosterNFT.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="minting-panel-available-info">
          <p className="minting-main-panel-available-info-title">Available:</p>
          <p className="minting-panel-available-amount">5</p>
        </div>
        <div className="minting-panel-action-part">
          <div className="minting-panel-action-detail">
            <div className="minting-panel-action-detail-amount-wrapper">
              <input
                type="number"
                className="minting-panel-action-detail-amount"
                placeholder="Enter amount to mint"
                min="1"
                step="1"
                onChange={(e) => {
                  setMintAmount(e.target.value);
                }}
                value={mintAmount}
              />
            </div>
            <Button
              variant="contained"
              color="success"
              className="minting-panel-action-detail-button btn-stake"
              onClick={async () => {
                if (isMintLoading) return
                try {
                  if (Number(mintAmount) > 0) {
                    setIsMintLoading(true);
                    await sleep(2000);
                    openNotification('success', 'Mint Success!');
                    setIsMintLoading(false);
                  }
                } catch (err: any) {
                  openNotification('error', err.message);
                  setIsMintLoading(false);
                }
              }}
            >
              {isMintLoading ? <CircularProgress size={16} color="inherit" /> : ''} Mint
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
