export const InfoStaking = {
  contract: '0xcFEa4b18cBF8afc4881bbc22c6700101f890A5EF',
  token_type: '0x314d7114d2dDdd32e9d6AAB5be32234f4ceBcE63',
  booster_nft_type: '0x310cf659C2DA5340870AD5A076dB44DEF33d1a8d',
  character_nft_type: '0x310cf659C2DA5340870AD5A076dB44DEF33d1a8d',
  token_decimals: 18,
};

export const InfoCoinflip = {
  contract: '0x46Da8821464d0E824855f972A5a3E00Bb47CD1B8',
  wager_amount: [500, 1000, 2000, 4000, 5000, 10000],
  token_type: '0x314d7114d2dDdd32e9d6AAB5be32234f4ceBcE63',
  token_decimals: 18
}

export const InfoDice = {
  contract: '0xaAc94E2330C1a97867c205Ba2cf6b70649A3874C',
  wager_amount: [500, 1000, 2000, 4000, 5000, 10000],
  token_type: '0x314d7114d2dDdd32e9d6AAB5be32234f4ceBcE63',
  token_decimals: 18
}

export { default as ERC20_ABI } from './abis/ERC20_Abi.json'
export { default as FLIP_ABI } from './abis/COINFLIP_Abi.json'
export { default as DICE_ABI } from './abis/DICE_Abi.json'
export { default as STAKING_ABI } from './abis/STAKING_Abi.json'
export { default as BOOSTER_NFT_ABI } from './abis/BOOSTER_NFT_Abi.json'

