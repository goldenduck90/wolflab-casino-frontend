import { createContext, useContext } from "react";

export interface ProgramContextState {
    getWOLFIESbalance(): Promise<number>;

    // Staking
    getUserStakeData(): Promise<any>;
    getStakingPoolData(): Promise<any>;
    getOwnedBoosterNfts(): Promise<any[]>;
    getStakedBoosterNfts(): Promise<any[]>;
    stakeToken(amount: number): Promise<void>;
    unStakeToken(amount: number): Promise<void>;
    claimRewards(): Promise<void>;
    stakeBoosterNfts(item: number[]): Promise<void>;
    unStakeBoosterNfts(item: number[]): Promise<void>;

    // Coinflip
    coinflipFlip(side: boolean, amount: number): Promise<any>;
    coinflipClaim(): Promise<void>;
    getFlipLastPlay(): Promise<any>;

    // Dice game
    diceRoll(select: number, amount: number): Promise<any>;
    diceClaim(): Promise<void>;
    getDiceLastPlay(): Promise<any>;

    // NFT mint
    getAvailableBoosterMint(): Promise<number>;
    mintBoosterNFT: (amount: number) => Promise<void>
}

export const ProgramContext = createContext<ProgramContextState>({
} as ProgramContextState)

export function useProgram(): ProgramContextState {
    return useContext(ProgramContext)
}