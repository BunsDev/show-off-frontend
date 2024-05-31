import React, { useState, useRef, useEffect } from 'react';
import '@walletconnect/react-native-compat';
import { Alert, Animated, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Linking, TextInput } from 'react-native';
import { View, Dimensions, Button } from 'react-native';
import { W3mButton } from '@web3modal/wagmi-react-native'
import '@walletconnect/react-native-compat';
import { queryExample } from '../Lens/ExampleLenss';
import { useAccount, useContractRead, useContractWrite, useEnsName } from 'wagmi';
import NFTs from '../components/NFTs';
import axios from 'axios'
import Carousel from 'react-native-snap-carousel'
import chains from '../chains'
import { AntDesign, Entypo } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import ScreenRecorder from 'react-native-screen-mic-recorder'
import * as MediaLibrary from 'expo-media-library'
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import { Dialog, Portal } from 'react-native-paper';

export const SLIDER_WIDTH = Dimensions.get('window').width + 80
export const SLIDER_HEIGHT = Dimensions.get('window').height
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

import AR from '../components/AR';
import DataFeed from '../components/DataFeed';
import Web3 from 'web3';
import { useNavigation } from '@react-navigation/native';
import { zkSync_sepolia_contract_address } from '../constants';
import { zkSync_Contract_ABI } from '../zkSync_Contract_ABI';

export default function CameraScreen() {
  const [isAREnabled, setAREnabled] = useState(true)

  const [display, setDisplay] = useState('block')
  const [lensHandle, setLensHandle] = useState([]);
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();

  const isCarousel = React.useRef(null)
  const [page, setPage] = useState(0)
  const [prevPage, setPrevPage] = useState(null)
  const [tokens, setTokens] = useState([])

  const [main, setMain] = useState('')

  const [isPlaying, setIsPlaying] = useState(false);
  const [key, setKey] = useState(0);
  const [videoUri, setVideoUri] = useState('')
  const [sharableUri, setSharableUri] = useState('')
  const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [modal3, setModal3] = useState(false);
  const [loading, setLoading] = useState(null)
  const [isSharableLoading, setIsSharableLoading] = useState(false)
  const [visibleDialog, setVisibleDialog] = React.useState(false);
  const [savingToContract, setSavingToContract] = React.useState(false);
  const navigator = useNavigation()
  const [lensMessege, setLensMessege] = useState('')
  const [displayObject, setDisplayObject] = useState(false)
  const [mic, setMic] = useState(true)
  
  const ens = useEnsName({
    address,
  })
  
  console.log(ens.data);
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: zkSync_sepolia_contract_address,
    abi: zkSync_Contract_ABI,
    functionName: 'addData',
    chainId: 300
  })

  const query = `query Profiles {
    profiles(
      request: {
      where: {
        ownedBy: "${address}"
      }
    }) {
      items {
        id
        handle {
          localName
        }
      }
    }
  }`
  
  const options = {
    mic, // defaults to true
    bitsPerSample: 16
  }

  const handleLongPress = async () => {
    setDisplay('none')
    const res = await ScreenRecorder.startRecording(options).catch((error) => {
      console.warn(error) // handle native error
    })

    if (res !== 'started') {
      Alert.alert('access denied')
    }
    setIsPlaying(true);
  };

  const handlePressOut = async () => {
    setDisplay('block')
    const uri = await ScreenRecorder.stopRecording().catch((error) =>
      console.warn(error) // handle native error
    )
    setVideoUri(uri)
    setIsPlaying(false);
    setKey(prevKey => prevKey + 1); // Reset timer by changing key

  };


  const saveToMediaLibrary = async () => {
    try {
      setIsSharableLoading(true)
      const { status } = await MediaLibrary.requestPermissionsAsync();
  
      if (status === 'granted') {
          // Save the file to the media library
          const asset = await MediaLibrary.createAssetAsync(videoUri);
          
          // Get the asset details
          const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
          const formData = new FormData();
          formData.append('file', {
            uri: assetInfo.uri,
            name: assetInfo.filename,
            type: 'video/mp4',
          });

          const response = await fetch('https://show-off-backend-bw57.onrender.com/video_upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          });
          const res = await response.json();
          setSharableUri(res.result)
          setVideoUri('')
          console.log(res.result);
          setSavingToContract(true)
          setTimeout(() => {
            console.log('writing');
            write({
              args: [String(res.result)],
              from: address
            })
            setSavingToContract(false)
            setIsSharableLoading(false)

          }, 2000)
      }

    }
    catch (error) {
      console.error('Error saving image to media library:', error);
    }
  }
  

  const lensData = async () => {
    setLensHandle((await queryExample(query)).profiles.items[0].handle.localName)
  }

  const fetchTokens = async () => {
    setLoading(true)
    const data = await axios.post('https://show-off-backend-bw57.onrender.com/balance', {
      address,
      chain: chains[page].chainId
    },
      {
        headers: {
          "Content-Type": "application/json"
        },
      })
    setTokens((data.data.result).filter(item => item.logo != null))
    setLoading(false)
  }

  const loadAR = () => {
    setAREnabled(false)
    setTimeout(() => setAREnabled(true), 2000)
  }

  useEffect(() => {
    lensData()
  }, [address])

  useEffect(() => {
    if (modal1 && page != prevPage) {
      setPrevPage(page)
      fetchTokens()
    }
  }, [page, modal1])


  return (

    <>
      <View style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 0 }}>

        {
          isAREnabled
          ? <AR main={main} setDisplayObject={setDisplayObject} />
          : <View className='flex-1 bg-[black] flex justify-start items-center'>
            <View className='w-screen h-screen bg-black'>
            <ActivityIndicator animating={true} color={'#fff'} size={'large'} className='mt-20' />
            </View>
          </View>           
        }   

        <View style={{ position: 'absolute', zIndex: 20, bottom: 10, marginLeft: -40, display: display }}>
          <Carousel
            layout="default" // default | stack | tinder
            layoutCardOffset={9}
            ref={isCarousel}
            data={chains}
            renderItem={({ item, index }) => (
              page !== index - 3
                ? <View key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                  <Image source={{ uri: item.logo }} width={60} height={60} style={{ borderRadius: 100, borderColor: 'black', borderWidth: 1 }} />
                </View>
                : <Pressable
                  key={index} style={{ marginTop: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 15, marginTop: -5 }}
                  onPress={handleLongPress}
                >
                  <CountdownCircleTimer
                    key={key}
                    isPlaying={isPlaying}
                    duration={10}
                    colors={["#ffffff"]}
                    strokeWidth={5}
                    onComplete={() => {
                      handlePressOut()
                      setIsPlaying(false);
                      setKey(prevKey => prevKey + 1); // Reset timer after completion
                    }}
                    size={100}
                    isSmoothColorTransition={true}
                  >
                  </CountdownCircleTimer>
                  <Image source={{ uri: item.logo }} width={80} height={80} style={{ borderRadius: 100, borderColor: 'black', borderWidth: 1, position: "absolute" }} />

                </Pressable>
            )}
            hasParallaxImages={true}
            sliderWidth={SLIDER_WIDTH} 
            itemWidth={100}
            inactiveSlideShift={0}
            useScrollView={true}
            onSnapToItem={(index) => setPage(index)}
            loop={true}
          />
        </View>

        {/* nfts */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modal2}
          onRequestClose={() => setModal2(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => setModal2(false)}
              style={styles.closeModalButton}
            >
              <Text style={styles.closeModalText}>
                <Entypo name="cross" size={24} color="white" />
              </Text>
            </TouchableOpacity>
            <View style={styles.modalContent}>
              <NFTs setMain={setMain} index={page} modal2={modal2} loadAR={loadAR} />
            </View>
          </View>
        </Modal>
        <TouchableOpacity className='absolute top-[116px] opacity-80 left-2 bg-[#87029694] p-1 rounded-md flex justify-start items-center flex-row z-2' style={{ display: display }} onPress={() => setModal2(true)}>
          <Image source={{uri: 'https://as2.ftcdn.net/v2/jpg/04/36/71/89/1000_F_436718960_NVJ7n914NCszZdCR2w50WAgwCx5WcNOp.jpg'}} className='w-10 h-10 rounded-full' />
        </TouchableOpacity>

        {/* data feed */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal3}
          onRequestClose={() => setModal3(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => setModal3(false)}
              style={styles.closeModalButton}
            >
              <Text style={styles.closeModalText}>
                <Entypo name="cross" size={24} color="white" />
              </Text>
            </TouchableOpacity>
            <View style={styles.modalContent}>
              <DataFeed setMain={setMain} loadAR={loadAR} />
            </View>
          </View>
        </Modal>
        <TouchableOpacity className='absolute top-[170px] opacity-80 left-2 bg-[#87029694] p-1 rounded-md flex justify-start items-center flex-row z-2' style={{ display: display }} onPress={() => setModal3(true)}>
          <Image source={require('../assets/chainlink_datafedd.png')} className='w-10 h-10 rounded-full bg-white' />
        </TouchableOpacity>

        {/* tokens */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal1}
          onRequestClose={() => setModal1(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => setModal1(false)}
              style={styles.closeModalButton}
            >
              <Text style={styles.closeModalText}>
                <Entypo name="cross" size={24} color="white" />
              </Text>
            </TouchableOpacity>
            <View style={styles.modalContent}>
              {
                !loading
                  ? <View className='flex justify-start items-center flex-row flex-wrap w-screen'>
                      {
                        tokens.length != 0
                        ? tokens.map((item, index) => (
                            item.name == 'USD Coin' 
                            ? <TouchableOpacity className='p-1 flex justify-center items-center rounded-md w-36 h-36 m-4' key={index}
                                onPress={() => {
                                  loadAR()
                                  setMain({type:'token', image:item.logo, totalTokens:`${(item.balance / 1E6).toFixed(4)} ${item.name}`})
                                }}
                              >
                                <Image source={{ uri: item.logo }} width={50} height={50} />
                                <Text className='text-slate-400 text-sm mt-2'>{(item.balance / 1E6).toFixed(2)} {item.name}</Text>
                              </TouchableOpacity>
                            : <TouchableOpacity className='p-1 flex justify-center items-center rounded-md w-36 h-36 m-4' key={index}
                                onPress={() => {
                                  loadAR()
                                  setMain({type:'token', image:item.logo, totalTokens:`${(item.balance / 1E18).toFixed(2)} ${item.name}`})
                                }}
                              >
                                <Image source={{ uri: item.logo }} width={50} height={50} />
                                <Text className='text-slate-400 text-sm mt-2'>{(item.balance / 1E18).toFixed(4)} {item.name}</Text>
                              </TouchableOpacity>
                          ))
                        : <View className='flex-1 w-full mt-24 flex justify-center items-center'><Text className='text-slate-700'>No Tokens Found! </Text></View>
                      }
                    </View>
                  : <View className='flex-1 flex justify-center items-center h-full w-screen'><ActivityIndicator animating={true} color={'rgb(148 163 184)'} size={'large'} /></View>
              }
            </View>
          </View>
        </Modal>

        {/* token button */}
        <TouchableOpacity className='absolute top-16 px-4 opacity-80 left-2 bg-[#87029694] p-1 rounded-md flex justify-start items-center flex-row z-20' style={{ display: display }} onPress={() => setModal1(true)}>
          <Image source={{uri: 'https://banner2.cleanpng.com/20180204/dve/kisspng-token-coin-initial-coin-offering-r-l-stevens-plasc-token-cliparts-5a76aca3596111.0557334415177268833661.jpg'}} className='w-10 h-10 rounded-full' />
        </TouchableOpacity>

        {/* lens button */}
        <TouchableOpacity className='absolute top-2 px-4 left-2 opacity-80 bg-[#87029694] p-1 rounded-md flex justify-start items-center flex-row z-20' style={{ display: display }} 
          onPress={() => {
            loadAR()
            setMain({type: 'lens', lensHandle})
          }}>
          <Image source={require('../assets/lens.jpeg')} className='w-10 h-10 rounded-full' />
        </TouchableOpacity>

        {/* ens button */}
        <TouchableOpacity className='absolute top-[225px] px-4 left-2 opacity-80 bg-[#87029694] p-1 rounded-md flex justify-start items-center flex-row z-20' style={{ display: display }} 
          onPress={() => {
            loadAR()
            setMain({type: 'ens', ensHandle: ens.data})
          }}>
          <Image source={{uri : 'https://cryptologos.cc/logos/ethereum-name-service-ens-logo.png'}} className='w-10 h-10 rounded-full bg-white' />
        </TouchableOpacity>

        {/* download button */}
        {videoUri != '' && <TouchableOpacity className='absolute bottom-60 right-0 bg-[#00000080] p-2 rounded-tl-full rounded-bl-full flex justify-start items-center flex-row z-20' style={{ display: display }} onPress={saveToMediaLibrary}>
          <Feather name="download" size={20} color="white" style={{marginLeft: 2, marginRight: 2}} />
        </TouchableOpacity>}

        {/* share button */}
        {sharableUri != '' && <TouchableOpacity className='absolute bottom-48 right-0 bg-[#00000080] p-2 rounded-tl-full rounded-bl-full flex justify-start items-center flex-row z-20' style={{ display: display }} 
          onPress={() => setVisibleDialog(!visibleDialog)}>
          <MaterialCommunityIcons name="share" size={20} color="white" style={{marginLeft: 2, marginRight: 2}} />
        </TouchableOpacity>} 
     
        {/* rotate logo */}
        <TouchableOpacity className='absolute top-14 right-2 bg-[#00000080] p-2 rounded-full flex justify-start items-center flex-row z-20' onPress={loadAR} style={{ display: display }}>
          <Ionicons name="reload" size={24} color="white" style={{marginLeft: 2, marginRight: 2}} />
        </TouchableOpacity>
        
        {/* mic */}
        <TouchableOpacity className='absolute bottom-32 right-2 bg-[#00000080] p-2 rounded-full flex justify-start items-center flex-row z-20' onPress={() => setMic(!mic)} style={{ display: display }}>
          {mic ? <Feather name="mic" size={24} color="white" style={{marginLeft: 2, marginRight: 2}} />
          : <Feather name="mic-off" size={24} color="white" style={{marginLeft: 2, marginRight: 2}} />}
        </TouchableOpacity>

        {/* album */}
        <TouchableOpacity className='absolute top-28 right-2 opacity-80 bg-[#00000080] p-2 rounded-full flex justify-start items-center flex-row z-20' style={{ display: display }} onPress={() => navigator.navigate('videolist')}>
          <Ionicons name="albums-outline" size={24} color="white" style={{marginLeft: 2, marginRight: 2}} />
        </TouchableOpacity>

        <View className='absolute top-2 right-2'>
          <W3mButton />
        </View> 

        {/* load sharable link button */}
        {
          isSharableLoading
          &&  <View className='flex-1 absolute flex justify-center items-center w-screen bg-[#00000090] z-40' style={{height: SLIDER_HEIGHT + 100}}>
            <ActivityIndicator animating={true} color={'#fff'} size={'large'} />
            {savingToContract ? <Text className='text-slate-300 mt-2'>Saving link to smart contract...</Text> : <Text className='text-slate-300 mt-2'>Saving to Media & Creating Sharable Link...</Text>}
          </View>
        }

        {/* loading object */}
        
        {
          displayObject && <View className='flex-1 absolute flex justify-center items-center w-screen bg-[#00000090] z-40' style={{height: SLIDER_HEIGHT + 100}}>
            <ActivityIndicator animating={true} color={'#fff'} size={'large'} />
            <Text className='text-slate-300 mt-2'>Loading 3D Model...</Text>
          </View>
        }
        
        <Portal>
          <Dialog visible={visibleDialog} onDismiss={() => setVisibleDialog(!visibleDialog)} className='bg-slate-200'>
            <Dialog.Content>
            <TextInput
              placeholder="Message on lens"
              value={lensMessege}
              onChangeText={text => setLensMessege(text)}
              className='border border-black rounded-lg p-2'
            />
              <TouchableOpacity className='mt-4 rounded-lg bg-black text-center p-2' onPress={() => Linking.openURL(`https://lenster.xyz/?text=${lensMessege}&url=${sharableUri}&via=showoff&hashtags=lens,web3,showoff`)}><Text className='text-white text-center'>Share with captured video 🔗 on hey(lenster)</Text></TouchableOpacity>
            </Dialog.Content>
          </Dialog>
        </Portal>

      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nftsContainer: {
    position: 'absolute',
    zIndex: 20,
    top: 60,
    left: 0,
    bottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokensContainer: {
    position: 'absolute',
    zIndex: 20,
    top: 60,
    right: 0,
    bottom: 190,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    top: 2,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    marginRight: 10,
  },
  nfts: {
    padding: 20,
    backgroundColor: 'lightblue',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    height: "70%",
    justifyContent: "flex-start",
    backgroundColor: "rgb(15 23 42)",
    display:"flex",
    alignItems:'center',
    flexDirection:'row',
    flexWrap:'wrap',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    padding: 20,
    paddingBottom: 0,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  closeModalButton: {
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  closeModalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 100,
  },
});