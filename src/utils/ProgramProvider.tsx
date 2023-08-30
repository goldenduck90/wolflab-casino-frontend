import { FC, useCallback, ReactNode, useMemo } from 'react';
import axios from 'axios';
import { ProgramContext } from './useProgram';
import {
  InfoStaking,
  InfoCoinflip,
  InfoDice,
  ERC20_ABI,
  FLIP_ABI,
  DICE_ABI,
  STAKING_ABI,
  BOOSTER_NFT_ABI,
} from './constants';
import { useWeb3 } from './useWeb3';
export interface ProgramProviderProps {
  children: ReactNode;
}

export const ProgramProvider: FC<ProgramProviderProps> = ({ children }) => {
  const web3 = useWeb3();
  const wallet = web3.walletAddress;
  const provider = web3.web3;

  const tokenContract = useMemo(
    () => (provider ? new provider.eth.Contract(ERC20_ABI, InfoCoinflip.token_type) : undefined),
    [provider]
  );

  const stakingContract = useMemo(
    () => (provider ? new provider.eth.Contract(STAKING_ABI, InfoStaking.contract) : undefined),
    [provider]
  );

  const coinFlipContract = useMemo(
    () => (provider ? new provider.eth.Contract(FLIP_ABI, InfoCoinflip.contract) : undefined),
    [provider]
  );

  const diceContract = useMemo(
    () => (provider ? new provider.eth.Contract(DICE_ABI, InfoDice.contract) : undefined),
    [provider]
  );

  const boosterNFTContract = useMemo(
    () =>
      provider
        ? new provider.eth.Contract(BOOSTER_NFT_ABI, InfoStaking.booster_nft_type)
        : undefined,
    [provider]
  );

  const getWOLFIESbalance = useCallback(async () => {
    try {
      let balance = await tokenContract.methods.balanceOf(wallet).call();
      return balance;
    } catch (err) {
      return 0;
    }
  }, [wallet, tokenContract]);

  const getStakingPoolData = useCallback(async () => {
    try {
      let tvl = await stakingContract.methods.tvl().call();
      return { tvl: tvl };
    } catch (err) {
      return null;
    }
  }, [stakingContract]);

  const getUserStakeData = useCallback(async () => {
    try {
      let userData = await stakingContract.methods.StakingData(wallet).call();
      return userData;
    } catch (err) {
      return null;
    }
  }, [wallet, stakingContract]);

  const getOwnedBoosterNfts = useCallback(async () => {
    try {
      const tokenIds: string[] = await boosterNFTContract.methods.tokensOfOwner(wallet).call();

      const nftsData = (
        await Promise.all(
          tokenIds.map(async (tokenId) => {
            try {
              const tokenUri = await boosterNFTContract.methods.tokenURI(tokenId).call();
              const { data: nftData } = await axios.get(tokenUri);
              return nftData;
            } catch {
              return null;
            }
          })
        )
      ).filter((nft) => nft != null);
      return nftsData;
    } catch (err) {
      return [];
    }
  }, [boosterNFTContract, wallet]);

  const getStakedNfts = useCallback(async () => {
    try {
      return [];
    } catch (err) {
      return [];
    }
  }, [stakingContract]);

  const stake_token = useCallback(
    async (_amount: number) => {
      let amount = BigInt(_amount * Math.pow(10, InfoStaking.token_decimals));

      let balance = await tokenContract.methods.balanceOf(wallet).call();
      if (balance < amount) throw new Error('Not Enough Token');

      let allowance = await tokenContract.methods.allowance(wallet, InfoStaking.contract).call();
      if (allowance < amount) {
        await tokenContract.methods
          .approve(InfoStaking.contract, '0x' + (amount - allowance).toString(16))
          .send({
            from: wallet,
            gas: 300000,
            gasPrice: 5000000000,
          });
      }

      await stakingContract.methods
        .stakeToken(InfoStaking.token_type, '0x' + amount.toString(16))
        .send({
          from: wallet,
          gas: 300000,
          gasPrice: 5000000000,
        });
    },
    [wallet, stakingContract, tokenContract]
  );

  const unstake_token = useCallback(
    async (_amount: number) => {
      let amount = _amount * Math.pow(10, InfoStaking.token_decimals);
      await stakingContract.methods
        .unstakeToken(InfoStaking.token_type, '0x' + amount.toString(16))
        .send({
          from: wallet,
          gas: 300000,
          gasPrice: 5000000000,
        });
    },
    [wallet, stakingContract]
  );

  const claim_rewards = useCallback(async () => {
    await stakingContract.methods.claimReward().send({
      from: wallet,
      gas: 300000,
      gasPrice: 5000000000,
    });
  }, [wallet, stakingContract]);

  const stake_nfts = useCallback(async (_items: string[]) => {}, [wallet]);

  const unstake_nfts = useCallback(async (_items: string[]) => {}, [wallet]);

  const coinflip_flip = useCallback(
    async (selectedSide: boolean, selectedAmount: number) => {
      let amount = BigInt(selectedAmount * Math.pow(10, InfoCoinflip.token_decimals));

      let balance = await tokenContract.methods.balanceOf(wallet).call();
      if (balance < amount) throw new Error('Not Enough Token');

      let allowance = await tokenContract.methods.allowance(wallet, InfoCoinflip.contract).call();
      if (allowance < amount) {
        await tokenContract.methods.approve(InfoCoinflip.contract, amount - allowance).send({
          from: wallet,
          gas: 300000,
          gasPrice: 5000000000,
        });
      }

      let result = await coinFlipContract.methods.flip(selectedSide, amount).send({
        from: wallet,
        gas: 300000,
        gasPrice: 5000000000,
      });

      return result.events.FlipFinished.returnValues;
    },
    [wallet, coinFlipContract, tokenContract]
  );

  const coinflip_claim = useCallback(async () => {
    let pendingAmount = await coinFlipContract.methods.pendingAmount(wallet).call();
    if (pendingAmount === 0) throw new Error('No Redeemable Tokens');

    await coinFlipContract.methods.claim().send({
      from: wallet,
      gas: 300000,
      gasPrice: 5000000000,
    });
  }, [wallet, coinFlipContract]);

  const getFlipLastPlay = useCallback(async () => {
    try {
      let pendingAmount = await coinFlipContract.methods.pendingAmount(wallet).call();

      return { pendingAmount: pendingAmount };
    } catch (err) {
      return false;
    }
  }, [wallet, coinFlipContract]);

  const dice_roll = useCallback(
    async (selectedCase: number, selectedAmount: number) => {
      let amount = BigInt(selectedAmount * Math.pow(10, InfoDice.token_decimals));

      let balance = await tokenContract.methods.balanceOf(wallet).call();
      if (balance < amount) throw new Error('Not Enough Token');

      let allowance = await tokenContract.methods.allowance(wallet, InfoDice.contract).call();
      if (allowance < amount) {
        await tokenContract.methods
          .approve(InfoDice.contract, '0x' + (amount - allowance).toString(16))
          .send({
            from: wallet,
            gas: 300000,
            gasPrice: 5000000000,
          });
      }

      let result = await diceContract.methods.flip(selectedCase, '0x' + amount.toString(16)).send({
        from: wallet,
        gas: 300000,
        gasPrice: 5000000000,
      });

      return result.events.DiceFinished.returnValues.betData;
    },
    [wallet, tokenContract, diceContract]
  );

  const dice_claim = useCallback(async () => {
    let userData = await diceContract.methods.DiceData(wallet).call();
    if (userData.result === false) throw new Error('No Redeemable Tokens');
    if (userData.claimed === true) throw new Error('Already Claimed');

    await diceContract.methods.claim().send({
      from: wallet,
      gas: 300000,
      gasPrice: 5000000000,
    });
  }, [wallet, diceContract]);

  const getDiceLastPlay = useCallback(async () => {
    try {
      let userData = await diceContract.methods.DiceData(wallet).call();

      return userData;
    } catch (err) {
      return null;
    }
  }, [wallet, diceContract]);

  const getAvailableBoosterMint = useCallback(async () => {
    try {
      let available = await boosterNFTContract.methods.whitelist(wallet).call();
      return Number(available);
    } catch (err) {
      return 0;
    }
  }, [wallet, boosterNFTContract]);

  const mintBoosterNFT = useCallback(
    async (amount: number) => {
      await boosterNFTContract.methods.mint(BigInt(amount)).send({
        from: wallet,
        gas: 300000,
        gasPrice: 5000000000,
      });
    },
    [wallet, boosterNFTContract]
  );

  return (
    <ProgramContext.Provider
      value={{
        getWOLFIESbalance,

        // Staking
        getUserStakeData,
        getOwnedBoosterNfts,
        getStakedNfts,
        getStakingPoolData,
        stake_token,
        unstake_token,
        claim_rewards,
        stake_nfts,
        unstake_nfts,

        // Coinflip
        // getUserCoinflipData,
        coinflip_claim,
        coinflip_flip,
        getFlipLastPlay,

        // Dice game
        // getUserDiceData,
        dice_roll,
        dice_claim,
        getDiceLastPlay,

        // NFT mint
        getAvailableBoosterMint,
        mintBoosterNFT,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};
