import React, { useState, useRef, useEffect } from 'react';
import '@walletconnect/react-native-compat';
import { Alert, Animated, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { View, Dimensions, Button } from 'react-native';
import { W3mButton } from '@web3modal/wagmi-react-native'
import '@walletconnect/react-native-compat';
import { queryExample } from '../Lens/ExampleLenss';
import { useAccount } from 'wagmi';
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


export const SLIDER_WIDTH = Dimensions.get('window').width + 80
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/abc/video/upload';
const CLOUDINARY_UPLOAD_PRESET = 'fcvnveyw';

import AR from '../components/AR';
import { encode } from 'base-64';


const options = {
  mic: false, // defaults to true
  bitsPerSample: 60
  // width: ? // Defaults to Dimensions.get('window').width, ignored on Android
  // height: ? // Defaults to Dimensions.get('window').height, ignored on Android
  // androidBannerStopRecordingHandler: fn() // Android Only: Callback function to handle stop recording from notification baner
}


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
  const [loading, setLoading] = useState(null)
  const [isSharableLoading, setIsSharableLoading] = useState(false)

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
          console.log(assetInfo);
          const formData = new FormData();
          formData.append('file', {
            uri: assetInfo.uri,
            name: assetInfo.filename,
            type: 'video/mp4',
          });

          const response = await fetch('http://192.168.1.6:3000/video_upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          });
          const res = await response.json();
          setSharableUri(res.result)
          setVideoUri('')
          setIsSharableLoading(false)
          console.log('Success:', res.result);
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
    const data = await axios.post('http://192.168.1.6:3000/balance', {
      address,
      chain: chains[page].chainId
    },
      {
        headers: {
          "Content-Type": "application/json"
        },
      })
    console.log(data.data);
    setTokens((data.data.result).filter(item => item.logo != null))
    setLoading(false)
  }

  async function onSignIn(tokens, profile) {
    console.log('tokens: ', tokens)
    console.log('profile: ', profile)
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
      // fetchTokens()
    }
  }, [page, modal1])

  return (
    <>
      <View style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 40 }}>

        {
          isAREnabled
          ? <AR main={main} />
          : <View className='flex-1 bg-black flex justify-start items-center'>
            <Image source={require('../assets/download.gif')} className='w-screen h-32 mt-24' />
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
        <TouchableOpacity className='absolute top-2 left-2 bg-white p-2 rounded-full flex justify-start items-center flex-row z-2' style={{ display: display }} onPress={() => setModal2(true)}>
          <AntDesign name="CodeSandbox" size={24} color="black" style={{ margin: 4 }} />
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
                                <Text className='text-slate-300 text-sm mt-2'>{(item.balance / 1E6).toFixed(4)} {item.name}</Text>
                              </TouchableOpacity>
                            : <TouchableOpacity className='p-1 flex justify-center items-center rounded-md w-36 h-36 m-4' key={index}
                                onPress={() => {
                                  loadAR()
                                  setMain({type:'token', image:item.logo, totalTokens:`${(item.balance / 1E18).toFixed(4)} ${item.name}`})
                                }}
                              >
                                <Image source={{ uri: item.logo }} width={50} height={50} />
                                <Text className='text-slate-300 text-sm mt-2'>{(item.balance / 1E18).toFixed(4)} {item.name}</Text>
                              </TouchableOpacity>
                          ))
                        : <View className='flex-1 w-full mt-24 flex justify-center items-center'><Text className='text-slate-300'>No Tokens Found! </Text></View>
                      }
                    </View>
                  : <View className='flex-1 flex justify-center items-center h-full w-screen'><ActivityIndicator animating={true} color={'#fff'} size={'large'} /></View>
              }
            </View>
          </View>
        </Modal>

        {/* token button */}
        <TouchableOpacity className='absolute top-16 px-4 left-2 bg-white p-2 rounded-full flex justify-start items-center flex-row z-20' style={{ display: display }} onPress={() => setModal1(true)}>
          <FontAwesome6 name="ethereum" size={28} color="black" style={{marginLeft: 6, marginRight: 6}} />
        </TouchableOpacity>

        {/* download button */}
        {videoUri != '' && <TouchableOpacity className='absolute bottom-36 right-0 bg-white p-2 rounded-tl-full rounded-bl-full flex justify-start items-center flex-row z-20' style={{ display: display }} onPress={saveToMediaLibrary}>
          <Feather name="download" size={24} color="black" style={{marginLeft: 2, marginRight: 2}} />
        </TouchableOpacity>}

        {/* share button */}
        {sharableUri != '' && <TouchableOpacity className='absolute bottom-48 right-0 bg-white p-2 rounded-tl-full rounded-bl-full flex justify-start items-center flex-row z-20' style={{ display: display }} 
          onPress={() => Linking.openURL(`https://lenster.xyz/?text=Hello%20World!&url=${sharableUri}&via=showoff&hashtags=lens,web3,showoff`)}>
          <MaterialCommunityIcons name="share" size={24} color="black" style={{marginLeft: 2, marginRight: 2}} />
        </TouchableOpacity>}

        {/* rotate logo */}
        <TouchableOpacity className='absolute top-2 right-[43.5%] bg-black rounded-full flex justify-start items-center flex-row z-20' onPress={loadAR}>
          <Image source={require('../assets/logo2.png')} className='w-12 h-12' />
        </TouchableOpacity>

        <View className='absolute top-2 right-2'>
          <W3mButton />
        </View>

{/* load sharable link button */}
        {
          isSharableLoading
          &&  <View className='flex-1 absolute flex justify-center items-center w-screen h-screen bg-[#00000090] z-40'>
            <Image source={require('../assets/loading 2.gif')} className='w-24 h-24' />
          </View>
        }

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
    backgroundColor: "#000",
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