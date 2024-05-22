import { View, Text, Button } from 'react-native'
import React from 'react'
// import '@farcaster/auth-kit/styles.css';

import { AuthKitProvider } from '@farcaster/auth-kit';
import { SignInButton } from '@farcaster/auth-kit';
const config = {
    rpcUrl: 'https://mainnet.optimism.io',
    domain: 'example.com',
    siweUri: 'https://example.com/login',
  };

export default function Pinata() {
    return (
        <AuthKitProvider config={config}>
            <SignInButton />
        </AuthKitProvider>
      );
    
}