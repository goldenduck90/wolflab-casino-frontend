export const InfoStaking = {
  contract: '0xFF5322505fC22302fC14A0A157759F0A88252128',
  token_type: '0x314d7114d2dDdd32e9d6AAB5be32234f4ceBcE63',
  booster_nft_type: '0x3Dd37284759aa40416E9008393B10f334c03e68E',
  token_decimals: 18,
};

export const InfoCoinflip = {
  contract: '0xe63B516832A411984A3135C4601c42CbA8327551',
  wager_amount: [500, 1000, 2000, 4000, 5000, 10000],
  token_type: '0x314d7114d2dDdd32e9d6AAB5be32234f4ceBcE63',
  token_decimals: 18
}

export const InfoDice = {
  contract: '0x7B7e95aB069286568D0c2E263B4979fCc8B41B88',
  wager_amount: [500, 1000, 2000, 4000, 5000, 10000],
  token_type: '0x314d7114d2dDdd32e9d6AAB5be32234f4ceBcE63',
  token_decimals: 18
}

export { default as ERC20_ABI } from './abis/ERC20_Abi.json'
export { default as FLIP_ABI } from './abis/COINFLIP_Abi.json'
export { default as DICE_ABI } from './abis/DICE_Abi.json'
export { default as STAKING_ABI } from './abis/STAKING_Abi.json'
export { default as BOOSTER_NFT_ABI } from './abis/BOOSTER_NFT_Abi.json'

