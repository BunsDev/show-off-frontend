import { View, Text, Image, TouchableOpacity, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useNavigation } from '@react-navigation/native'
import { W3mButton } from '@web3modal/wagmi-react-native'
import { Ionicons } from '@expo/vector-icons';
import { isARSupportedOnDevice } from '@viro-community/react-viro'

export default function Connect() {
  const { address } = useAccount()
  const navigator = useNavigation()

  const [isSupported, setSupported] = useState(null)

  const checkSupport = async () => {
    try {
      let granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log(granted)
      const result = await isARSupportedOnDevice();
      setSupported(result.isARSupported);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {  
    checkSupport() 
  }, [])

  return (
    <>
      <View style={{ flex: 1, display: "flex", justifyContent: "space-around", alignItems: "center", flexDirection: "column" }} className='bg-black'>
        <Image source={require('../assets/Show-off1.png')} className='w-[90%] ml-4 h-48 -mt-24' />
        <Image source={require('../assets/newlogo2.png')} className='w-[80%] ml-4 h-32 -mt-24' />

      </View>
      <View className='fixed bottom-0 w-screen h-[100px] bg-black flex justify-center items-center'>
        {isSupported ? <View className='flex justify-around w-full items-center flex-row-reverse'> 
        <TouchableOpacity onPress={() => address && navigator.navigate('camera')} className='border border-white rounded-full p-4'>
          <Image source={{ uri: 'https://w7.pngwing.com/pngs/294/857/png-transparent-camera-lens-graphy-camera-lens-3d-computer-graphics-lens-video-cameras-thumbnail.png' }} className='w-16 h-16 rounded-full' />
        </TouchableOpacity>
        <View><W3mButton label={<Ionicons name="enter-outline" size={24} color="black" />} connectStyle={{ backgroundColor: 'white' }} /></View></View>
          : <View className='bg-white p-2 rounded-full'><Text className='text-black p-2'>This app is not supported on your device</Text></View>}
      </View>
    </>
  )
}