export const InfoStaking = {
  contract: '0xeE756c9C994bC9c14dBfE85DaB439DC8575ebBE6',
  token_type: '0x4B8F444b313AeBAC210A8B39Efd397a884D94c01',
  booster_nft_type: '0xa3e135E91937296C51766917ca2F4E881d0e7Ef4',
  character_nft_type: '0xa3e135E91937296C51766917ca2F4E881d0e7Ef4',
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

