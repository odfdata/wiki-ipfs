import {Chain} from "wagmi";

export const wallaby: Chain = {
  id: 31415,
  name: 'Wallaby',
  network: 'wallaby',
  nativeCurrency: {
    decimals: 18,
    name: 'tFIL',
    symbol: 'tFIL',
  },
  rpcUrls: {
    default: { http: ['https://wallaby.node.glif.io/rpc/v0'] },
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://explorer.glif.io/?network=hyperspacenet' },
  },
}

