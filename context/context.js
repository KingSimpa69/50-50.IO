'use client'

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

const projectId = 'b0f5281f045a5480f17fec4f8791a837'

const base = {
  chainId: 8453,
  name: 'Base Mainnet',
  currency: 'ETH',
  explorerUrl: 'https://basescan.org',
  rpcUrl: 'https://mainnet.base.org'
}

const baseSepolia = {
  chainId: 84532,
  name: 'Base Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia-explorer.base.org',
  rpcUrl: 'https://sepolia.base.org'
}

const metadata = {
  name: "50/50",
  description: "A decentralized on-chain 50/50 for project fundraisers",
  url: 'https://50-50.io',
  icons: ['https://50-50.io']
}

const ethersConfig = defaultConfig({
  metadata,
  auth: {
    email: false, 
    socials: ['google', 'apple'],
    showWallets: true, // default to true
    walletFeatures: true
  },
  coinbasePreference: "all",
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true, 
  rpcUrl: '...',
  defaultChainId: 8453
})

createWeb3Modal({
  allWallets: 'HIDE',
  ethersConfig,
  chains: [base,baseSepolia],
  projectId,
  enableAnalytics: true, 
  enableOnramp: true 
})

export function Web3Modal({ children }) {
  return children
}