import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import Web3Modal, { IProviderOptions } from 'web3modal';
import WalletConnect from '@walletconnect/web3-provider';
import { useWeb3 } from '../utils/useWeb3';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

const node_url = 'https://eth-goerli.g.alchemy.com/v2/K2lUv_YYheHH8ivc6rXrVkffDzm6lStE';
const baseChainId = '0x5';
const baseScan = 'https://goerli.etherscan.io';
const getProviderOptions = (): IProviderOptions => {
  const providerOptions: IProviderOptions = {
    walletconnect: {
      package: WalletConnect,
      options: {
        network: 'Base Network',
        rpc: {
          5: node_url,
        },
      },
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK, // Required
      options: {
        appName: 'Wolf Game Lab',
        rpc: node_url, // Optional if `infuraId` is provided; otherwise it's required
        chainId: 5, // Optional. It defaults to 1 if not provided
        darkMode: false, // Optional. Use dark theme, defaults to false
      },
    },
    'custom-binancechainwallet': {
      display: {
        logo: 'https://lh3.googleusercontent.com/rs95LiHzLXNbJdlPYwQaeDaR_-2P9vMLBPwaKWaQ3h9jNU7TOYhEz72y95VidH_hUBqGXeia-X8fLtpE8Zfnvkwa=w128-h128-e365-rj-sc0x00ffffff',
        name: 'Binance Chain Wallet',
        description: 'Connect to your Binance Chain Wallet',
      },
      options: {
        appName: 'Wolf Game Lab',
        rpc: node_url,
        chainId: 5,
        darkMode: false,
      },
      package: true,
      connector: async () => {
        let provider = null;
        if (typeof window.BinanceChain !== 'undefined') {
          provider = window.BinanceChain;
          try {
            await provider.request({
              method: 'eth_requestAccounts',
            });
          } catch (error) {
            throw new Error('User Rejected');
          }
        } else {
          throw new Error('No Binance Chain Wallet found');
        }
        return provider;
      },
    },
  };
  return providerOptions;
};

export default function Header() {
  const { web3, handleSetWalletAddress, walletAddress, handleSetWeb3 } = useWeb3();
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const web3Modal = new Web3Modal({
    network: 'Base',
    cacheProvider: true,
    providerOptions: getProviderOptions(),
  });

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      onConnect();
      resetApp();
    }
  }, []);

  const subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }
    provider.on('close', () => resetApp());
    provider.on('accountsChanged', async (accounts: any[]) => {
      handleSetWalletAddress(accounts[0]);
      // setWeb3Data({ ...web3Data, address: accounts[0] });
      // await this.getAccountAssets();
    });
    provider.on('chainChanged', async (_chainId: any) => {
      // const { web3 } = web3Data;
      // const networkId = await web3.eth.net.getId();
      // setWeb3Data({ ...web3Data, chainId: chainId, networkId: networkId });
      // await this.getAccountAssets();
    });

    provider.on('networkChanged', async (_networkId: any) => {
      // const { web3 } = web3Data;
      // const chainId = await web3.eth.chainId();
      // setWeb3Data({ ...web3Data, chainId: chainId, networkId: networkId });
      // await this.getAccountAssets();
    });
  };

  const onConnect = async () => {
    try {
      const provider = await web3Modal.connect();
      await subscribeProvider(provider);
      await provider.enable();
      handleSetWeb3(new Web3(provider));
      const chainId = await provider.request({ method: 'eth_chainId' });
      if (chainId === baseChainId) {
      } else {
        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: baseChainId }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            try {
              await provider.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: baseChainId,
                    chainName: 'Goerli Network',
                    rpcUrls: [node_url],
                    blockExplorerUrls: [baseScan],
                    nativeCurrency: {
                      symbol: 'ETH',
                      decimals: 18,
                    },
                  },
                ],
              });
            } catch (addError) {
              // alert(addError);
            }
          }
          // alert("Failed to switch to the network")
          return;
        }
      }

      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });
      const account = accounts[0];
      handleSetWalletAddress(account);
    } catch (e) {}
  };

  const resetApp = async () => {
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    handleSetWalletAddress('');
    await web3Modal.clearCachedProvider();
    // setWeb3Data({ ...INITIAL_STATE });
  };

  function ellipseAddress(address = '', width = 10) {
    return `${address.slice(0, width)}...${address.slice(-width)}`;
  }

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(window.innerWidth);
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        component="nav"
        sx={{
          background: 'linear-gradient(90deg, rgb(11,24,14) 0%, rgb(11,66,17) 100%)',
          zIndex: 10000,
        }}
      >
        <Toolbar>
          <Typography
            variant="h4"
            component="div"
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              fontWeight: 'bold',
              lineHeight: '44px',
              fontFamily: 'IndustryBold',
              cursor: 'pointer !important',
            }}
          >
            <img src="/images/wolflab_logo.png" alt="logo" width="45px" />
            &nbsp;{windowSize > 580 ? 'WOLF GAME LAB' : ''}
          </Typography>
          <Box sx={{ display: 'block' }}>
            <button
              className="btn-wallet-connect"
              onClick={walletAddress === '' ? onConnect : resetApp}
            >
              {walletAddress === '' ? 'Connect Wallet' : ellipseAddress(walletAddress, 5)}
            </button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
