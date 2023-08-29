import { createContext, useContext } from "react";

export interface Web3ContextState {
    web3: any;
    walletAddress: string;
    handleSetWeb3(web3: any): void;
    handleSetWalletAddress(address: string): void;
}

export const Web3Context = createContext<Web3ContextState>({
    walletAddress: "",
} as Web3ContextState)

export function useWeb3(): Web3ContextState {
    return useContext(Web3Context)
}