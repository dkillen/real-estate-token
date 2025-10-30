import { Chain } from 'wagmi'

export const dukong: Chain = {
  id: 5887,
  name: 'MANTRACHAIN Testnet',
  network: 'dukong',
  nativeCurrency: {
    name: 'OM',
    symbol: 'OM',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://evm.dukong.mantrachain.io'] },
    public:  { http: ['https://evm.dukong.mantrachain.io'] },
    webSocket: ['wss://evm.dukong.mantrachain.io/ws']
  },
  blockExplorers: {
    default: { name: 'MantraScan Dukong', url: 'https://mantrascan.io/dukong' }
  },
  testnet: true,
}

