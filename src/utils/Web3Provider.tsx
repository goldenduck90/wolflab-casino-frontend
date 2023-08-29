import { FC, ReactNode, useState } from 'react';
import { Web3Context } from './useWeb3';

export interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: FC<Web3ProviderProps> = ({ children }) => {
  const [web3, setWeb3] = useState<any>();
  const [walletAddress, setWalletAddress] = useState('');

  const handleSetWeb3 = (_web3: any) => {
    setWeb3(_web3);
  };

  const handleSetWalletAddress = (address: string) => {
    setWalletAddress(address);
  };

  return (
    <Web3Context.Provider
      value={{
        web3,
        walletAddress,
        handleSetWeb3,
        handleSetWalletAddress,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
