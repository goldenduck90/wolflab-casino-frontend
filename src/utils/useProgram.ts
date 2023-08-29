import { createContext, useContext } from "react";

export interface ProgramContextState {
    getWOLFIESbalance(): Promise<number>;

    // Staking
    getUserStakeData(): Promise<any>;
    getStakingPoolData(): Promise<any>;
    getOwnedNfts(): Promise<any[]>;
    getStakedNfts(): Promise<any[]>;
    stake_token(amount: number): void;
    unstake_token(amount: number): void;
    claim_rewards(): void;
    stake_nfts(item: string[]): void;
    unstake_nfts(item: string[]): void;

    // Coinflip
    coinflip_flip(side: boolean, amount: number): Promise<any>;
    coinflip_claim(): void;
    getFlipLastPlay(): Promise<any>;

    // Dice game
    dice_roll(select: number, amount: number): Promise<any>;
    dice_claim(): void;
    getDiceLastPlay(): Promise<any>;
}

export const ProgramContext = createContext<ProgramContextState>({
} as ProgramContextState)

export function useProgram(): ProgramContextState {
    return useContext(ProgramContext)
}