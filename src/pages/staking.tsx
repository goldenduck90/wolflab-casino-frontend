import { Button, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useProgram } from '../utils/useProgram';
import { InfoStaking } from '../utils/constants';
import { openNotification, sleep } from '../utils/components';
import { useWeb3 } from '../utils/useWeb3';

export default function Staking() {
  const wallet = useWeb3().walletAddress;
  const {
    claim_rewards,
    stake_token,
    unstake_token,
    getWOLFIESbalance,
    getUserStakeData,
    getStakingPoolData,
    getOwnedBoosterNfts,
    // getStakedNfts,
    // stake_nfts,
    // unstake_nfts,
  } = useProgram();

  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  const [userData, setUserData] = useState<any>(null);
  const [poolData, setPoolData] = useState<any>(null);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [isStakeLoading, setIsStakeLoading] = useState(false);
  const [isUnstakeLoading, setIsUnstakeLoading] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [boosterNfts, setBoosterNfts] = useState<any[]>([]);

  useEffect(() => {
    getPoolData();
  }, []);

  useEffect(() => {
    getTokenAmount();
    getPoolData();
    getStakingUserData();
    getNfts();
  }, [wallet]);

  const getTokenAmount = async () => {
    setTokenAmount(await getWOLFIESbalance());
  };

  const getPoolData = async () => {
    setPoolData(await getStakingPoolData());
  };

  const getStakingUserData = async () => {
    setUserData(await getUserStakeData());
  };

  const getNfts = async () => {
    (async () => {
      const _boosterNfts = await getOwnedBoosterNfts();
      setBoosterNfts(_boosterNfts);
    })();
  };

  return (
    <div className="staking-dashboard">
      <div className="staking-main-panel">
        <div className="staking-main-panel-title">
          <h2>WOLFIES STAKING</h2>
          <p>You can unstake from this pool anytime</p>
        </div>
        <div className="staking-main-panel-pool-info">
          <div className="staking-main-panel-one-info">
            <p className="staking-main-panel-one-info-title">TVL</p>
            <p className="staking-main-panel-one-info-detail">
              {poolData == null
                ? '-'
                : (
                    BigInt(poolData['tvl']) / BigInt(Math.pow(10, InfoStaking.token_decimals))
                  ).toString() + ' WOLFIES'}
            </p>
          </div>
          <div className="staking-main-panel-one-info">
            <p className="staking-main-panel-one-info-title">APY</p>
            <p className="staking-main-panel-one-info-detail">
              {poolData == null
                ? '-'
                : (userData == null ? 0 : Number(userData.rewardRate)) / 100 + ' %'}
            </p>
          </div>
        </div>
        <div className="staking-main-panel-reward-info">
          <p className="staking-main-panel-reward-amount">
            {(BigInt(tokenAmount) / BigInt(Math.pow(10, InfoStaking.token_decimals))).toString()}
          </p>
          <p className="staking-main-panel-reward-info-title">WOLFIES Owned</p>
        </div>
        <div className="staking-main-panel-staking-info">
          <div className="staking-main-panel-one-info">
            <p className="staking-main-panel-one-info-title">Staked</p>
            <p className="staking-main-panel-one-info-detail">
              {userData == null
                ? '-'
                : Number(userData.amount) / Math.pow(10, InfoStaking.token_decimals) + ' WOLFIES'}
            </p>
          </div>
          <div className="staking-main-panel-one-info">
            <p className="staking-main-panel-one-info-title">Reward</p>
            {/* <p className="staking-main-panel-one-info-detail">
              {userData == null
                ? '-'
                : userData['reward_amount'] / Math.pow(10, InfoStaking.token_decimals) + ' WOLFIES'}
            </p> */}
            <p className="staking-main-panel-one-info-detail">
              {userData == null
                ? '-'
                : (
                    Number(userData.pendingReward) / Math.pow(10, InfoStaking.token_decimals)
                  ).toFixed(4) + ' WOLFIES'}
            </p>
          </div>
        </div>
        <div className="staking-main-panel-action-part">
          <div className="staking-main-panel-action-detail">
            <div className="staking-main-panel-action-detail-title">Stake Amount</div>
            <div className="staking-main-panel-action-detail-amount-wrapper">
              <input
                type="number"
                className="staking-main-panel-action-detail-amount"
                placeholder="Enter amount to Stake"
                min="0"
                step="0.1"
                onChange={(e) => {
                  setStakeAmount(e.target.value);
                }}
                value={stakeAmount}
              />
            </div>
            <Button
              variant="contained"
              color="success"
              className="staking-main-panel-action-detail-button btn-stake"
              onClick={async () => {
                try {
                  if (Number(stakeAmount) > 0) {
                    setIsStakeLoading(true);
                    await stake_token(Number(stakeAmount));
                    setIsStakeLoading(false);
                    openNotification('success', 'Stake Success!');
                    await sleep(2000);
                    getStakingPoolData();
                  }
                } catch (err: any) {
                  openNotification('error', err.message);
                  setIsStakeLoading(false);
                }
              }}
            >
              {isStakeLoading ? <CircularProgress size={16} color="inherit" /> : ''} Stake
            </Button>
          </div>
          <div className="staking-main-panel-action-detail">
            <div className="staking-main-panel-action-detail-title">Unstake Amount</div>
            <div className="staking-main-panel-action-detail-amount-wrapper">
              <input
                type="number"
                className="staking-main-panel-action-detail-amount"
                placeholder="Enter amount to Unstake"
                min="0"
                step="0.1"
                onChange={(e) => {
                  setUnstakeAmount(e.target.value);
                }}
                value={unstakeAmount}
              />
            </div>
            <Button
              variant="contained"
              className="staking-main-panel-action-detail-button btn-unstake"
              onClick={async () => {
                try {
                  setIsUnstakeLoading(true);
                  await unstake_token(Number(unstakeAmount));
                  setIsUnstakeLoading(false);
                  openNotification('success', 'Unstake Success!');
                  await sleep(2000);
                  getStakingPoolData();
                } catch (err: any) {
                  openNotification('error', err.message);
                  setIsUnstakeLoading(false);
                }
              }}
            >
              {isUnstakeLoading ? <CircularProgress size={16} color="inherit" /> : ''} Unstake
            </Button>
          </div>
        </div>
        <div className="staking-main-panel-action-reward-part">
          <Button
            variant="outlined"
            sx={{
              width: '100%',
              borderRadius: '0.8rem',
              fontFamily: 'IndustryBold',
            }}
            color="success"
            onClick={async () => {
              try {
                setIsClaimLoading(true);
                await claim_rewards();
                setIsClaimLoading(false);
                openNotification('success', 'Claim Reward Success!');
                await sleep(2000);
                getStakingUserData();
              } catch (err: any) {
                openNotification('error', err.message);
                setIsClaimLoading(false);
              }
            }}
          >
            {isClaimLoading ? <CircularProgress size={16} color="inherit" /> : ''} Claim Reward
          </Button>
        </div>
      </div>
      <div className="nft-staking-panel-header">
        <h2>STAKE WOLFIES BOOSTER NFT</h2>
      </div>
      <div className="nft-staking-panel-wrapper">
        <div className="nft-staking-one-panel">
          <div className="nft-staking-one-panel-content">
            <div className="nft-staking-one-panel-content-body">
              {boosterNfts.map((_boosterNft, index) => (
                <div key={index} className="nft">
                  <video autoPlay loop>
                    <source src="/images/WolfieBoosterNFT.mp4" type="video/mp4" />
                  </video>
                </div>
              ))}
            </div>
          </div>
          <div className="nft-staking-one-panel-actions">
            <div className="nft-staking-one-panel-action-wrapper">
              <Button variant="contained" color="success" onClick={async () => {}}>
                Stake
              </Button>
            </div>
            <div className="nft-staking-one-panel-action-wrapper">
              <Button variant="outlined" color="success" onClick={async () => {}}>
                Stake All
              </Button>
            </div>
          </div>
        </div>
        <div className="nft-staking-one-panel">
          <div className="nft-staking-one-panel-content">
            <div className="nft-staking-one-panel-content-body"></div>
          </div>
          <div className="nft-staking-one-panel-actions">
            <div className="nft-staking-one-panel-action-wrapper">
              <Button variant="contained" color="primary" onClick={async () => {}}>
                Unstake
              </Button>
            </div>
            <div className="nft-staking-one-panel-action-wrapper">
              <Button variant="outlined" color="primary" onClick={async () => {}}>
                Unstake All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
