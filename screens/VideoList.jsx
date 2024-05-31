import { View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet, Linking, Clipboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import { ActivityIndicator } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import { zkSync_Contract_ABI } from '../zkSync_Contract_ABI'
import { zkSync_sepolia_contract_address } from '../constants'

export default function VideoList() {

  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const { address } = useAccount()

  const getVideosFromContract = async () => {
    setLoading(true)
    const web3 = new Web3("https://rpc.ankr.com/zksync_era_sepolia")
    const data = new web3.eth.Contract(zkSync_Contract_ABI, zkSync_sepolia_contract_address)
    const d1 = await data.methods.getDataOf(address).call()
    setVideos(d1);
    setLoading(false)
  }

  const copyToClipboard = (imageLink) => {
      Clipboard.setString(imageLink)
  };

  useEffect(() => {
    getVideosFromContract()
  }, [])


  return (
    <View className='flex-1 bg-slate-900'>
        {
          !loading ? <ScrollView className='h-screen w-screen mt-2' showsVerticalScrollIndicator={false}>
            <View className=' flex justify-start items-center flex-col w-screen'>
              {videos.length != 0 ?
                videos.map((item, index) => (
                  <TouchableOpacity className='w-[90vw] bg-slate-700 p-4 py-2 mb-2 rounded-md flex justify-between flex-row items-center' key={index}
                    onPress={() => Linking.openURL(item)}
                  >
                      <Text className='text-slate-400 w-[90%]'>{item}</Text>
                      <TouchableOpacity onPress={() => copyToClipboard(item)} className='bg-slate-600 p-2 rounded-md'>
                          <Ionicons name="copy-outline" size={18} color="white" />
                      </TouchableOpacity>
                  </TouchableOpacity>
                ))
                : <View className='flex-1 flex justify-center items-center h-full w-screen mt-[200px]'><ActivityIndicator animating={true} color={'#fff'} size={'large'} /></View>
              }
            </View>
          </ScrollView>
            : <View className='flex-1 flex justify-center items-center h-full w-screen'><ActivityIndicator animating={true} color={'#fff'} size={'large'} /></View>

        }
      
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
  },
});