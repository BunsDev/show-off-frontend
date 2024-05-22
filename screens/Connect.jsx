import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAccount } from 'wagmi'
import { useNavigation } from '@react-navigation/native'
import { W3mButton } from '@web3modal/wagmi-react-native'
import { Ionicons } from '@expo/vector-icons';

export default function Connect() {
    const {address} = useAccount()
    const navigator = useNavigation()
  return (
    <>
      <View style={{flex:1, display: "flex", justifyContent: "space-around", alignItems:"center", flexDirection:"column"}} className='bg-black'>
          <Image source={require('../assets/Show-off1.png')} className='w-[120%] ml-4 h-72 -mt-24' />
          <View className='-mt-32'><W3mButton label={<Ionicons name="enter-outline" size={24} color="black" />} connectStyle={{backgroundColor: 'white'}} /></View>
      </View>
      <View className='fixed bottom-0 w-screen h-[100px] bg-black flex justify-center items-center'>
        <View className='border border-white w-[80%] flex justify-around items-center flex-row rounded-full p-2'>
          <TouchableOpacity onPress={() => {}}>
            <Image source={require('../assets/lens.jpeg')} className='w-10 h-10 rounded-lg' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => address && navigator.navigate('camera')}>
            <Image source={require('../assets/logo.gif')} className='w-16 h-16 rounded-lg' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Image source={require('../assets/warpcast.jpeg')} className='w-10 h-10 rounded-lg' />
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}