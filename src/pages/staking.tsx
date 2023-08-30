import { Button, CircularProgress } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useProgram } from '../utils/useProgram';
import { InfoStaking } from '../utils/constants';
import { openNotification, sleep } from '../utils/components';
import { useWeb3 } from '../utils/useWeb3';

export default function Staking() {
  const wallet = useWeb3().walletAddress;
  const {
    claimRewards,
    stakeToken,
    unStakeToken,
    getWOLFIESbalance,
    getUserStakeData,
    getStakingPoolData,
    getOwnedBoosterNfts: getOwnedBoosterNftsAction,
    stakeBoosterNfts: stakeBoosterNftsAction,
    getStakedBoosterNfts: getStakedBoosterNftsAction,
    unStakeBoosterNfts: unstakeBoosterNftsAction,
  } = useProgram();

  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  const [userData, setUserData] = useState<any>(null);
  const [poolData, setPoolData] = useState<any>(null);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [isStakeLoading, setIsStakeLoading] = useState(false);
  const [isUnstakeLoading, setIsUnstakeLoading] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);

  const [isLoadingOwnedBoosterNfts, setIsLoadingOwnedBoosterNfts] = useState(false);
  const [ownedBoosterNfts, setOwnedBoosterNfts] = useState<any[]>([]);
  const [selectedBoosterNftsForStake, setSelectedBoosterNftsForStake] = useState<number[]>([]);
  const [isStakingBoosterNfts, setIsStakingBoosterNfts] = useState(false);

  const [isLoadingStakedBoosterNfts, setIsLoadingStakedBoosterNfts] = useState(false);
  const [stakedBoosterNfts, setStakedBoosterNfts] = useState<any[]>([]);
  const [selectedBoosterNftsForUnstake, setSelectedBoosterNftsForUnstake] = useState<number[]>([]);
  const [isUnstakingBoosterNfts, setIsUnstakingBoosterNfts] = useState(false);

  useEffect(() => {
    getPoolData();
  }, []);

  const getAllData = () => {
    getTokenAmount();
    getPoolData();
    getStakingUserData();
    getOwnedBoosterNfts();
    getStakedBoosterNfts();
  };
  useEffect(() => {
    getAllData();
  }, [wallet, getOwnedBoosterNftsAction]);

  const getTokenAmount = async () => {
    setTokenAmount(await getWOLFIESbalance());
  };

  const getPoolData = async () => {
    setPoolData(await getStakingPoolData());
  };

  const getStakingUserData = async () => {
    setUserData(await getUserStakeData());
  };

  const getOwnedBoosterNfts = async () => {
    (async () => {
      if (isLoadingOwnedBoosterNfts) return;
      setIsLoadingOwnedBoosterNfts(true);
      const _boosterNfts = await getOwnedBoosterNftsAction();
      setOwnedBoosterNfts(_boosterNfts);
      setIsLoadingOwnedBoosterNfts(false);
    })();
  };

  const getStakedBoosterNfts = async () => {
    (async () => {
      if (isLoadingStakedBoosterNfts) return;
      setIsLoadingStakedBoosterNfts(true);
      const _boosterNfts = await getStakedBoosterNftsAction();
      setStakedBoosterNfts(_boosterNfts);
      setIsLoadingStakedBoosterNfts(false);
    })();
  };

  const onStakeToken = async () => {
    try {
      if (Number(stakeAmount) > 0) {
        setIsStakeLoading(true);
        await stakeToken(Number(stakeAmount));
        setIsStakeLoading(false);
        openNotification('success', 'Stake Success!');
        await sleep(2000);
        getStakingPoolData();
      }
    } catch (err: any) {
      openNotification('error', err.message);
      setIsStakeLoading(false);
    }
  };

  const onUnStakeToken = async () => {
    try {
      setIsUnstakeLoading(true);
      await unStakeToken(Number(unstakeAmount));
      setIsUnstakeLoading(false);
      openNotification('success', 'Unstake Success!');
      getPoolData();
      getStakingUserData();
    } catch (err: any) {
      openNotification('error', err.message);
      setIsUnstakeLoading(false);
    }
  };

  const onClaimToken = async () => {
    try {
      setIsClaimLoading(true);
      await claimRewards();
      setIsClaimLoading(false);
      openNotification('success', 'Claim Reward Success!');
      getStakingUserData();
      getPoolData();
    } catch (err: any) {
      openNotification('error', err.message);
      setIsClaimLoading(false);
    }
  };

  const toggleSelectedBoosterNftsForStake = async (tokenId: number) => {
    const isSelected = selectedBoosterNftsForStake.findIndex((id) => id == tokenId) != -1;

    const newNfts = isSelected
      ? selectedBoosterNftsForStake.filter((id) => id != tokenId)
      : [...selectedBoosterNftsForStake, tokenId];
    setSelectedBoosterNftsForStake(newNfts);
  };

  const toggleSelectedBoosterNftsForUnstake = async (tokenId: number) => {
    const isSelected = selectedBoosterNftsForUnstake.findIndex((id) => id == tokenId) != -1;

    const newNfts = isSelected
      ? selectedBoosterNftsForUnstake.filter((id) => id != tokenId)
      : [...selectedBoosterNftsForUnstake, tokenId];
    setSelectedBoosterNftsForUnstake(newNfts);
  };

  const stakeBoosterNfts = useCallback(
    async (tokenIds: number[]) => {
      if (isStakingBoosterNfts) return;

      try {
        setIsStakingBoosterNfts(true);
        await stakeBoosterNftsAction(tokenIds);
        openNotification('success', 'Stake Success!');
        await sleep(2000);
        setSelectedBoosterNftsForStake([]);
      } catch (err: any) {
        openNotification('error', err.message);
      }
      setIsStakingBoosterNfts(false);

      getAllData();
    },
    [stakeBoosterNftsAction, isStakingBoosterNfts, setSelectedBoosterNftsForStake]
  );

  const onStakeBoosterNfts = useCallback(async () => {
    await stakeBoosterNfts(selectedBoosterNftsForStake);
  }, [selectedBoosterNftsForStake, stakeBoosterNfts]);

  const onStakeAllBoosterNfts = useCallback(async () => {
    await stakeBoosterNfts(ownedBoosterNfts.map((nft) => nft.tokenId));
  }, [ownedBoosterNfts, stakeBoosterNfts]);

  const unstakeBoosterNfts = useCallback(
    async (tokenIds: number[]) => {
      if (isUnstakingBoosterNfts) return;

      try {
        setIsUnstakingBoosterNfts(true);
        await unstakeBoosterNftsAction(tokenIds);
        openNotification('success', 'Unstake Success!');
        await sleep(2000);
        setSelectedBoosterNftsForUnstake([]);
      } catch (err: any) {
        openNotification('error', err.message);
      }
      setIsUnstakingBoosterNfts(false);

      getAllData();
    },
    [unstakeBoosterNftsAction, isUnstakingBoosterNfts]
  );

  const onUnstakeBoosterNfts = useCallback(async () => {
    await unstakeBoosterNfts(selectedBoosterNftsForUnstake);
  }, [selectedBoosterNftsForUnstake, unstakeBoosterNfts]);

  const onUnstakeAllBoosterNfts = useCallback(async () => {
    await unstakeBoosterNfts(stakedBoosterNfts.map((nft) => nft.tokenId));
  }, [stakedBoosterNfts, unstakeBoosterNfts]);

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
                : (userData == null
                    ? 2500
                    : Number(userData.rewardRate) == 0
                    ? 2500
                    : Number(userData.rewardRate)) /
                    100 +
                  ' %'}
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
                : BigInt(userData.amount) / BigInt(Math.pow(10, InfoStaking.token_decimals)) +
                  ' WOLFIES'}
            </p>
          </div>
          <div className="staking-main-panel-one-info">
            <p className="staking-main-panel-one-info-title">Reward</p>
            <p className="staking-main-panel-one-info-detail">
              {userData == null
                ? '-'
                : (
                    BigInt(userData.pendingReward) /
                    BigInt(Math.pow(10, InfoStaking.token_decimals))
                  ).toString() + ' WOLFIES'}
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
              onClick={onStakeToken}
            >
              {isStakeLoading ? (
                <CircularProgress sx={{ marginRight: '10px' }} size={16} color="inherit" />
              ) : (
                ''
              )}{' '}
              Stake
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
              color="success"
              className="staking-main-panel-action-detail-button btn-unstake"
              onClick={onUnStakeToken}
            >
              {isUnstakeLoading ? (
                <CircularProgress sx={{ marginRight: '10px' }} size={16} color="inherit" />
              ) : (
                ''
              )}{' '}
              Unstake
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
            onClick={onClaimToken}
          >
            {isClaimLoading ? (
              <CircularProgress sx={{ marginRight: '10px' }} size={16} color="inherit" />
            ) : (
              ''
            )}{' '}
            Claim Reward
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
              {ownedBoosterNfts.map(({ name, tokenId }) => {
                const isSelected =
                  selectedBoosterNftsForStake.findIndex((id) => id == tokenId) != -1;
                return (
                  <div
                    key={tokenId}
                    className="nft"
                    onClick={() => toggleSelectedBoosterNftsForStake(tokenId)}
                  >
                    <div className={'border ' + (isSelected ? 'selected-border' : 'normal-border')}>
                      <video autoPlay loop muted preload="auto">
                        <source src="/images/WolfieBoosterNFT.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <p>
                        {name} #{tokenId + 1}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="nft-staking-one-panel-actions">
            <div className="nft-staking-one-panel-action-wrapper">
              <Button variant="contained" color="success" onClick={onStakeBoosterNfts}>
                {isStakingBoosterNfts ? (
                  <CircularProgress sx={{ marginRight: '10px' }} size={16} color="inherit" />
                ) : (
                  ''
                )}{' '}
                Stake
              </Button>
            </div>
            <div className="nft-staking-one-panel-action-wrapper">
              <Button variant="outlined" color="success" onClick={onStakeAllBoosterNfts}>
                {isStakingBoosterNfts ? (
                  <CircularProgress sx={{ marginRight: '10px' }} size={16} color="inherit" />
                ) : (
                  ''
                )}{' '}
                Stake All
              </Button>
            </div>
          </div>
        </div>
        <div className="nft-staking-one-panel">
          <div className="nft-staking-one-panel-content">
            <div className="nft-staking-one-panel-content-body">
              {stakedBoosterNfts.map(({ name, tokenId }) => {
                const isSelected =
                  selectedBoosterNftsForUnstake.findIndex((id) => id == tokenId) != -1;
                return (
                  <div
                    key={tokenId}
                    className="nft"
                    onClick={() => toggleSelectedBoosterNftsForUnstake(tokenId)}
                  >
                    <div className={'border ' + (isSelected ? 'selected-border' : 'normal-border')}>
                      <video autoPlay loop muted preload="auto">
                        <source src="/images/WolfieBoosterNFT.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <p>
                        {name} #{tokenId + 1}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="nft-staking-one-panel-actions">
            <div className="nft-staking-one-panel-action-wrapper">
              <Button variant="contained" color="success" onClick={onUnstakeBoosterNfts}>
                {isUnstakingBoosterNfts ? (
                  <CircularProgress sx={{ marginRight: '10px' }} size={16} color="inherit" />
                ) : (
                  ''
                )}{' '}
                Unstake
              </Button>
            </div>
            <div className="nft-staking-one-panel-action-wrapper">
              <Button variant="outlined" color="success" onClick={onUnstakeAllBoosterNfts}>
                {isUnstakingBoosterNfts ? (
                  <CircularProgress sx={{ marginRight: '10px' }} size={16} color="inherit" />
                ) : (
                  ''
                )}{' '}
                Unstake All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
