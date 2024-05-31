import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi';
import axios from 'axios';
import chains from '../chains'
import { API_KEY } from '../alchemyApi';

export default function NFTs({ setMain, index, modal2, loadAR }) {

  const { address } = useAccount()
  const [nftsList, setNftsList] = useState([])
  const [storeIndex, setStoreIndex] = useState(null)
  const [loading, setLoading] = useState(null)
  var nftList = []

  const fetchNft = async () => {
    setLoading(true)
    if (chains[index].NftRef == '') {
      setNftsList([])
      return
    }
    if (nftList) {
      const baseURL = `https://${chains[index].NftRef}.g.alchemy.com/v2/${API_KEY}/getNFTs/?owner=${address}`;

      const response = await axios.get(baseURL);
      const res_data = (response.data.ownedNfts).filter(item => Object.keys(item.metadata).length !== 0)

      for (let i = 0; i < res_data.length; i++) {

        let filter = Object.keys(res_data[i].metadata).find(item => item == 'animation_url') != undefined
        let image = res_data[i].metadata.image;
 
        if (image != undefined) {
          if (image.startsWith("ipfs")) {
            let img = image.replace('ipfs://', 'https://ipfs.io/ipfs/')
            if(filter && (res_data[i].metadata.animation_url).endsWith('.glb')) {
              nftList.push({ image, obj: res_data[i].metadata.animation_url })
            } else if (filter && (res_data[i].metadata.animation_url).endsWith('.mp4')) {
              nftList.push({ image, video: res_data[i].metadata.animation_url })
            } else {
              nftList.push({ image: img })
            }

          } else if (image.endsWith(".jpg") || image.endsWith(".png") || image.endsWith(".JPG") || image.endsWith(".PNG")) {

            if(filter && (res_data[i].metadata.animation_url).endsWith('.glb')) {
              nftList.push({ image, obj: res_data[i].metadata.animation_url })
            } else if (filter && (res_data[i].metadata.animation_url).endsWith('.mp4')) {
              nftList.push({ image, video: res_data[i].metadata.animation_url })
            } else {
              nftList.push({ image })
            }

          } else if (image.startsWith("data")) {

            if(filter && (res_data[i].metadata.animation_url).endsWith('.glb')) {
              nftList.push({ image, obj: res_data[i].metadata.animation_url })
            } else if (filter && (res_data[i].metadata.animation_url).endsWith('.mp4')) {
              nftList.push({ image, video: res_data[i].metadata.animation_url })
            } else {
              nftList.push({ id: 0, image })
            }

          } else {

            if(filter && ((res_data[i].metadata.animation_url).endsWith('.glb') || (res_data[i].metadata.animation_url).endsWith('.obj') || (res_data[i].metadata.animation_url).endsWith('.fbx'))) {
              nftList.push({ image, obj: res_data[i].metadata.animation_url })
            } else if (filter && (res_data[i].metadata.animation_url).endsWith('.mp4')) {
              nftList.push({ image, video: res_data[i].metadata.animation_url })
            } else {
              nftList.push({ image })
            }
            
          }
        }

      }
      setNftsList(nftList)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (modal2 && index != storeIndex) {
      console.log('nft called!');
      setMain('')
      setStoreIndex(index)
      fetchNft()
    }
  }, [index, modal2])

  return (
    <>
      {
        !loading
          ? <ScrollView className='flex-1 ml-1 mt-4' showsVerticalScrollIndicator={false}>
            <View className=' flex justify-start items-center flex-row flex-wrap w-screen'>
              {nftsList.length != 0 ?
                nftsList.map((item, index) => (
                  item.id == 0
                    ? <TouchableOpacity key={index} onPress={() => {
                        loadAR()
                        setMain(Object.keys(item).find(i => i == 'obj') ? {type:'3DNft', obj: item.obj} : (Object.keys(item).find(i => i == 'video') ? {type: 'videoNft', video: item.video} : {type: 'nft', image: item.image}))
                      }}><Image source={{ uri: item.image }} style={{ height: 70, width: 70 }} /></TouchableOpacity>
                    : <TouchableOpacity key={index} onPress={() => {
                        loadAR()
                        setMain(Object.keys(item).find(i => i == 'obj') ? {type:'3DNft', obj: item.obj} : {type: 'nft', image: item.image})
                      }}><Image style={{ borderRadius: 10, margin: 5 }} className='w-36 h-36 m-4' source={{ uri: item.image }} /></TouchableOpacity>
                ))
                : <View className='flex-1 w-full mt-24 flex justify-center items-center'><Text className='text-slate-700'>No NFTs Found! </Text></View>
              }
            </View>
          </ScrollView>
          : <View className='flex-1 flex justify-center items-center h-full w-screen'><ActivityIndicator animating={true} color={'rgb(148 163 184)'} size={'large'} /></View>
      }
    </>
  )
}