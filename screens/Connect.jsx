import { View, Text, Image, TouchableOpacity, PermissionsAndroid, Button } from 'react-native'
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
        PermissionsAndroid.PERMISSIONS.CAMERA,
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
      <View style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "column" }} className='bg-black'>
        <View className='flex justify-between items-center flex-row w-full mt-4 px-2'>
          <Image source={require('../assets/newlogo2.png')} className='w-28 ml-4 h-12' />
          {isSupported && <View><W3mButton label={<Ionicons name="enter-outline" size={24} color="black" />} connectStyle={{ backgroundColor: 'white' }} /></View>}
        </View>
        <Image source={{uri: 'https://res.cloudinary.com/dm6aa7jlg/image/upload/v1717043314/eth_zqhyfk.gif'}} className='w-[105%] ml-4 h-60 -mt-24' />

        <View className='fixed bottom-0 w-screen h-[100px] bg-black flex justify-center items-center'>
          {isSupported ? <View className='flex justify-around w-full items-center flex-row-reverse'>

            <TouchableOpacity onPress={() => address && navigator.navigate('camera')} className='border border-white rounded-full p-4'>
              <Image source={{ uri: 'https://w7.pngwing.com/pngs/294/857/png-transparent-camera-lens-graphy-camera-lens-3d-computer-graphics-lens-video-cameras-thumbnail.png' }} className='w-16 h-16 rounded-full' />
            </TouchableOpacity>
          </View>
            : <View className='bg-white p-2 rounded-full'><Text className='text-black p-2'>This app is not supported on your device</Text></View>}
        </View>


      </View>
    </>
  )
}