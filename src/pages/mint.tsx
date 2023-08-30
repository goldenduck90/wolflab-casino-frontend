import { Button, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useProgram } from '../utils/useProgram';
import { openNotification } from '../utils/components';
// import { useWeb3 } from '../utils/useWeb3';

export default function Mint() {
  // const wallet = useWeb3().walletAddress;
  const { getAvailableBoosterMint, mintBoosterNFT } = useProgram();

  const [mintAmount, setMintAmount] = useState('');
  const [availableAmount, setAvailableAmount] = useState(0);
  const [isMintLoading, setIsMintLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const available = await getAvailableBoosterMint();
      setAvailableAmount(available);
    })();
  }, [getAvailableBoosterMint]);

  const onMint = async () => {
    if (isMintLoading) return;
    try {
      let amount = Number(mintAmount);
      if (amount <= 0) {
        openNotification('error', 'Please enter valid mint amount.');
        setIsMintLoading(false);
        return;
      }

      if (amount > availableAmount) {
        openNotification('error', `You can mint maximum ${availableAmount} NFTs.`);
        setIsMintLoading(false);
        return;
      }
      setIsMintLoading(true);
      await mintBoosterNFT(amount);
      openNotification('success', 'Mint Success!');
      setIsMintLoading(false);
      setAvailableAmount(availableAmount - amount);
    } catch (err: any) {
      openNotification('error', err.message);
      setIsMintLoading(false);
      console.log(err.message);
    }
  };

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
          <p className="minting-main-panel-available-info-title">Available Mint:</p>
          <p className="minting-panel-available-amount">{availableAmount}</p>
        </div>
        <div className="minting-panel-action-part">
          <div className="minting-panel-action-detail">
            <div className="minting-panel-action-detail-amount-wrapper">
              <input
                type="number"
                className="minting-panel-action-detail-amount"
                placeholder="Enter amount to mint"
                min="1"
                // max={availableAmount}
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
              onClick={onMint}
            >
              {isMintLoading ? (
                <CircularProgress size={16} color="inherit" sx={{ marginRight: 4 }} />
              ) : (
                ''
              )}{' '}
              Mint
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
