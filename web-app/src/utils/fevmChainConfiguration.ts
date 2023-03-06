import {Chain} from "wagmi";


export const hyperspace: Chain = {
  id: 3141,
  name: 'hyperspace',
  network: 'hyperspace',
  nativeCurrency: {
    decimals: 18,
    name: 'tFIL',
    symbol: 'tFIL',
  },
  rpcUrls: {
    default: { http: ['https://api.hyperspace.node.glif.io/rpc/v1'] }
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://hyperspace.filfox.info/' },
  }
}

