import { createContext, useContext } from "react";

export interface ProgramContextState {
    getWOLFIESbalance(): Promise<number>;

    // Staking
    getUserStakeData(): Promise<any>;
    getStakingPoolData(): Promise<any>;
    getOwnedNfts(): Promise<any[]>;
    getStakedNfts(): Promise<any[]>;
    stake_token(amount: number): Promise<void>;
    unstake_token(amount: number): Promise<void>;
    claim_rewards(): Promise<void>;
    stake_nfts(item: string[]): Promise<void>;
    unstake_nfts(item: string[]): Promise<void>;

    // Coinflip
    coinflip_flip(side: boolean, amount: number): Promise<any>;
    coinflip_claim(): Promise<void>;
    getFlipLastPlay(): Promise<any>;

    // Dice game
    dice_roll(select: number, amount: number): Promise<any>;
    dice_claim(): Promise<void>;
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