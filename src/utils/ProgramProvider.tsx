import { FC, useCallback, ReactNode } from 'react';
import { ProgramContext } from './useProgram';
import {
  InfoStaking,
  InfoCoinflip,
  InfoDice,
  ERC20_ABI,
  FLIP_ABI,
  DICE_ABI,
  STAKING_ABI,
} from './constants';
import { useWeb3 } from './useWeb3';
export interface ProgramProviderProps {
  children: ReactNode;
}

export const ProgramProvider: FC<ProgramProviderProps> = ({ children }) => {
  const web3 = useWeb3();
  const wallet = web3.walletAddress;
  const provider = web3.web3;

  const getWOLFIESbalance = async () => {
    try {
      let tokenContract = new web3.web3.eth.Contract(ERC20_ABI, InfoCoinflip.token_type);
      let balance = await tokenContract.methods.balanceOf(wallet).call();
      return balance;
    } catch (err) {
      return 0;
    }
  };

  const getStakingPoolData = async () => {
    try {
      let StakingContract = new web3.web3.eth.Contract(STAKING_ABI, InfoStaking.contract);
      let tvl = await StakingContract.methods.tvl().call();
      return { tvl: tvl };
    } catch (err) {
      return null;
    }
  };

  const getUserStakeData = async () => {
    try {
      let StakingContract = new web3.web3.eth.Contract(STAKING_ABI, InfoStaking.contract);
      let userData = await StakingContract.methods.StakingData(wallet).call();
      return userData;
    } catch (err) {
      return null;
    }
  };

  const getOwnedNfts = async () => {
    try {
      return [];
    } catch (err) {
      return [];
    }
  };

  const getStakedNfts = async () => {
    try {
      return [];
    } catch (err) {
      return [];
    }
  };

  const stake_token = useCallback(
    async (_amount: number) => {
      let tokenContract = new web3.web3.eth.Contract(ERC20_ABI, InfoCoinflip.token_type);
      let StakingContract = new web3.web3.eth.Contract(STAKING_ABI, InfoStaking.contract);

      let amount = _amount * Math.pow(10, InfoStaking.token_decimals);

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

      await StakingContract.methods
        .stakeToken(InfoStaking.token_type, '0x' + amount.toString(16))
        .send({
          from: wallet,
          gas: 300000,
          gasPrice: 5000000000,
        });
    },
    [wallet, provider]
  );

  const unstake_token = useCallback(
    async (_amount: number) => {
      let StakingContract = new web3.web3.eth.Contract(STAKING_ABI, InfoStaking.contract);
      let amount = _amount * Math.pow(10, InfoStaking.token_decimals);
      await StakingContract.methods
        .unstakeToken(InfoStaking.token_type, '0x' + amount.toString(16))
        .send({
          from: wallet,
          gas: 300000,
          gasPrice: 5000000000,
        });
    },
    [wallet]
  );

  const claim_rewards = useCallback(async () => {
    let StakingContract = new web3.web3.eth.Contract(STAKING_ABI, InfoStaking.contract);
    await StakingContract.methods.claimReward().send({
      from: wallet,
      gas: 300000,
      gasPrice: 5000000000,
    });
  }, [wallet]);

  const stake_nfts = useCallback(async (_items: string[]) => {}, [wallet]);

  const unstake_nfts = useCallback(async (_items: string[]) => {}, [wallet]);

  const coinflip_flip = useCallback(
    async (selectedSide: boolean, selectedAmount: number) => {
      let tokenContract = new web3.web3.eth.Contract(ERC20_ABI, InfoCoinflip.token_type);
      let coinFlipContract = new web3.web3.eth.Contract(FLIP_ABI, InfoCoinflip.contract);

      let amount = selectedAmount * Math.pow(10, InfoCoinflip.token_decimals);

      let balance = await tokenContract.methods.balanceOf(wallet).call();
      if (balance < amount) throw new Error('Not Enough Token');

      let allowance = await tokenContract.methods.allowance(wallet, InfoCoinflip.contract).call();
      if (allowance < amount) {
        await tokenContract.methods
          .approve(InfoCoinflip.contract, '0x' + (amount - allowance).toString(16))
          .send({
            from: wallet,
            gas: 300000,
            gasPrice: 5000000000,
          });
      }

      let result = await coinFlipContract.methods
        .flip(selectedSide, '0x' + amount.toString(16))
        .send({
          from: wallet,
          gas: 300000,
          gasPrice: 5000000000,
        });

      return result.events.FlipFinished.returnValues;
    },
    [wallet, provider]
  );

  const coinflip_claim = useCallback(async () => {
    let coinFlipContract = new web3.web3.eth.Contract(FLIP_ABI, InfoCoinflip.contract);

    let pendingAmount = await coinFlipContract.methods.pendingAmount(wallet).call();
    if (pendingAmount === 0) throw new Error('No Redeemable Tokens');

    await coinFlipContract.methods.claim().send({
      from: wallet,
      gas: 300000,
      gasPrice: 5000000000,
    });
  }, [wallet]);

  const getFlipLastPlay = async () => {
    try {
      let coinFlipContract = new web3.web3.eth.Contract(FLIP_ABI, InfoCoinflip.contract);
      let pendingAmount = await coinFlipContract.methods.pendingAmount(wallet).call();

      return { pendingAmount: pendingAmount };
    } catch (err) {
      return false;
    }
  };

  const dice_roll = useCallback(
    async (selectedCase: number, selectedAmount: number) => {
      let tokenContract = new web3.web3.eth.Contract(ERC20_ABI, InfoCoinflip.token_type);
      let diceContract = new web3.web3.eth.Contract(DICE_ABI, InfoDice.contract);

      let amount = selectedAmount * Math.pow(10, InfoDice.token_decimals);

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
      console.log(result);

      return result.events.DiceFinished.returnValues.betData;
    },
    [wallet, provider]
  );

  const dice_claim = useCallback(async () => {
    let diceContract = new web3.web3.eth.Contract(DICE_ABI, InfoDice.contract);

    let userData = await diceContract.methods.DiceData(wallet).call();
    if (userData.result === false) throw new Error('No Redeemable Tokens');
    if (userData.claimed === true) throw new Error('Already Claimed');

    await diceContract.methods.claim().send({
      from: wallet,
      gas: 300000,
      gasPrice: 5000000000,
    });
  }, [wallet]);

  const getDiceLastPlay = async () => {
    try {
      let diceContract = new web3.web3.eth.Contract(DICE_ABI, InfoDice.contract);
      let userData = await diceContract.methods.DiceData(wallet).call();

      return userData;
    } catch (err) {
      return null;
    }
  };

  return (
    <ProgramContext.Provider
      value={{
        getWOLFIESbalance: getWOLFIESbalance,

        // Staking
        getUserStakeData,
        getOwnedNfts,
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
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};
