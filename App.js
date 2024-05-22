import React from 'react';
import '@walletconnect/react-native-compat';
import { WagmiConfig } from 'wagmi';
import { mainnet, polygon, arbitrum } from 'viem/chains';
import { createWeb3Modal, defaultWagmiConfig, Web3Modal } from '@web3modal/wagmi-react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './navigation/StackNavigation';
import 'expo-dev-client';
// 1. Get projectId at https://cloud.walletconnect.com
const projectId = 'e2bb5a774ec442b502bdd2d5b0404f5f'

// 2. Create config
const metadata = {
  name: 'Web3Modal RN',
  description: 'Web3Modal RN Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com'
  }
}

const chains = [mainnet, polygon, arbitrum]

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({
  projectId,
  chains,
  wagmiConfig,
  enableAnalytics: true // Optional - defaults to your Cloud configuration
})

export default function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <NavigationContainer>
          <StackNavigation />
        </NavigationContainer>
        <Web3Modal />
      </WagmiConfig>
    </>
  );
}