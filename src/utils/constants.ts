export const InfoStaking = {
  contract: '0xee5623AF9fDbAC78Ad5D5a3e0C26D78058845258',
  token_type: '0x4d404B8d621b160FC910d5d4C57880D3f80EB23F',
  booster_nft_type: '0x37AAD5A16E6716e8096148FD10D4B6E86B7f5348',
  character_nft_type: '0x37AAD5A16E6716e8096148FD10D4B6E86B7f5348',
  token_decimals: 18,
};

export const InfoCoinflip = {
  contract: '0x8B90bFa66253995c06b5eAfA2306DaA24fCAA8C8',
  wager_amount: [500, 1000, 2000, 4000, 5000, 10000],
  token_type: '0x4d404B8d621b160FC910d5d4C57880D3f80EB23F',
  token_decimals: 18
}

export const InfoDice = {
  contract: '0x6cbB99E36446B7fC315D3aC89d25e347AeC4A519',
  wager_amount: [500, 1000, 2000, 4000, 5000, 10000],
  token_type: '0x4d404B8d621b160FC910d5d4C57880D3f80EB23F',
  token_decimals: 18
}

export { default as ERC20_ABI } from './abis/ERC20_Abi.json'
export { default as FLIP_ABI } from './abis/COINFLIP_Abi.json'
export { default as DICE_ABI } from './abis/DICE_Abi.json'
export { default as STAKING_ABI } from './abis/STAKING_Abi.json'
export { default as BOOSTER_NFT_ABI } from './abis/BOOSTER_NFT_Abi.json'

