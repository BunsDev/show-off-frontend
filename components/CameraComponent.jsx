import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { View, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { useAccount } from 'wagmi';
import { FontAwesome6 } from '@expo/vector-icons';

export const SLIDER_WIDTH = Dimensions.get('window').width + 80
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

export default function CameraComponent({ display, main }) {

  const [hasPermission, setHasPermission] = useState(null);
  const [faces, setFaces] = useState([]);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleFacesDetected = ({ faces }) => {
    setFaces(faces);
  };

  const toggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.front
        ? Camera.Constants.Type.back
        : Camera.Constants.Type.front
    );
  };
  return (
    <>
      {address && <View style={{ position: 'relative', height: windowHeight * 0.62 }}>

        <Camera
          style={{
            zIndex: 0,
            width: windowWidth * 1.5,
            height: windowHeight,
            marginLeft: -80
          }}

          type={cameraType}
          onFacesDetected={handleFacesDetected}
          faceDetectorSettings={{
            mode: 'fast',
            minDetectionInterval: 10,
            tracking: true,
          }}
        />
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center', zIndex: 20 }}>
          {main != '' && faces.map((face, index) => (
            <View
              key={index}
              style={{
                color: 'white',
                padding: 5,
                marginLeft: face.bounds.origin.x - 130,
                marginTop: face.bounds.origin.y - 200,
              }}
            >
              <Image style={{ width: 100, height: 100 }} className='rounded-md' source={{ uri: main }} />
            </View>
          ))}
        </View>
      </View>}

      {/* flip camera */}

      <TouchableOpacity className='absolute bottom-32 right-0 p-2 pr-4 bg-white rounded-tl-full rounded-bl-full' style={{ display: display }} onPress={toggleCameraType}>
        <FontAwesome6 name="rotate" size={20} color="black" />
      </TouchableOpacity>

    </>
  );
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
});