export const InfoStaking = {
  contract: '0x08821F0aF8Bf60d4fa1545D689D0b29E01d3043D',
  token_type: '0x4B8F444b313AeBAC210A8B39Efd397a884D94c01',
  booster_nft_type: '0xDC1A8b159D012fa0981DB21659Da8130D0ca2C6A',
  character_nft_type: '0xDC1A8b159D012fa0981DB21659Da8130D0ca2C6A',
  token_decimals: 18,
};

export const InfoCoinflip = {
  contract: '0x2D871163968f9C03e0961Cb46297025F05e21134',
  wager_amount: [500, 1000, 2000, 4000, 5000, 10000],
  token_type: '0x4B8F444b313AeBAC210A8B39Efd397a884D94c01',
  token_decimals: 18
}

export const InfoDice = {
  contract: '0x314d7114d2dDdd32e9d6AAB5be32234f4ceBcE63',
  wager_amount: [500, 1000, 2000, 4000, 5000, 10000],
  token_type: '0x4B8F444b313AeBAC210A8B39Efd397a884D94c01',
  token_decimals: 18
}

export { default as ERC20_ABI } from './abis/ERC20_Abi.json'
export { default as FLIP_ABI } from './abis/COINFLIP_Abi.json'
export { default as DICE_ABI } from './abis/DICE_Abi.json'
export { default as STAKING_ABI } from './abis/STAKING_Abi.json'
export { default as BOOSTER_NFT_ABI } from './abis/BOOSTER_NFT_Abi.json'

