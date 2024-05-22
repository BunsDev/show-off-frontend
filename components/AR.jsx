import React, { useRef, useState, memo } from 'react';
import { StyleSheet } from 'react-native';
import {
  ViroARScene,
  ViroARSceneNavigator, ViroTrackingStateConstants,
  ViroImage,
  ViroNode,
  ViroText
} from '@viro-community/react-viro';
// import * as MediaLibrary from 'expo-media-library';

const AR = ({main}) => {

  const sceneNavigatorRef = useRef(null);
  const [text, setText] = useState('Initializing AR...');
  const [xyz, setXyz] = useState({x: 0, y: 0, z: -5})
  const [xyz2, setXyz2] = useState({x: 0, y: -1, z: -6})
  const onInitialized = (state, reason) => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setText('Hello World!');
    }
  };

  function _onDrag(draggedToPosition, source) {
    console.log(
      "Dragged to: x" +
        draggedToPosition[0] +
        " y:" +
        draggedToPosition[1] +
        " z: " +
        draggedToPosition[2]
    );
    setXyz({x: draggedToPosition[0], y: draggedToPosition[1], z: draggedToPosition[2]})
  }

  function _onDrag2(draggedToPosition, source) {
    console.log(
      "Dragged to: x" +
        draggedToPosition[0] +
        " y:" +
        draggedToPosition[1] +
        " z: " +
        draggedToPosition[2]
    );
    setXyz2({x: draggedToPosition[0], y: draggedToPosition[1], z: draggedToPosition[2]})
  }

  function _onDrag3(draggedToPosition, source) {
    console.log(
      "Dragged to: x" +
        draggedToPosition[0] +
        " y:" +
        draggedToPosition[1] +
        " z: " +
        draggedToPosition[2]
    );
  }

  // const start = async () => {
  //   this.props.sceneNavigator.startVideoRecording('video',true, (err) => {
  //     console.log(err);
  //   })
  // }

  // const stop = async () => {
  //   let data = await ref.stopVideoRecording()
  //   console.log(data);
  // }

  // useEffect(() => {
  //   start()
  //   const time = setTimeout(() => {
  //     stop()
  //   }, 2000)
  //   return clearTimeout(time)
  // }, [])

  return (
      <ViroARSceneNavigator
      ref={sceneNavigatorRef}
        autofocus={true}
        initialScene={{
          scene: () => (
            <ViroARScene onTrackingUpdated={onInitialized}>
              {
                main.type == 'nft' 
                && <ViroImage
                    source={{uri: main.image}}
                    position={[xyz.x, xyz.y, xyz.z]}
                    onDrag={_onDrag}
                  />
              }
              {
                main.type == 'token' 
                && <ViroNode 
                    position={[xyz2.x, xyz2.y, xyz2.z]}
                    onDrag={_onDrag2}>
                  <ViroImage
                    source={{uri: main.image}}
                    className='rounded-lg'
                  />
                  <ViroText text={main.totalTokens}  position={[0, -1.5, -1]} />
                </ViroNode>
              }
            </ViroARScene>
          ),
        }}
        style={styles.f1}
      />
  );
};

export default memo(AR);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
    flex: 1,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  f1: {
    flex: 1,
  },
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
