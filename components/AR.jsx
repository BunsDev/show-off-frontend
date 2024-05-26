import React, { useRef, useState, memo } from 'react';
import { StyleSheet } from 'react-native';
import {
  ViroARScene,
  ViroARSceneNavigator, ViroTrackingStateConstants,
  ViroImage,
  ViroNode,
  ViroText,
  Viro3DObject
} from '@viro-community/react-viro';

const AR = ({ main }) => {

  const sceneNavigatorRef = useRef(null);
  const [text, setText] = useState('Hello World!');
  const [xyz, setXyz] = useState({ x: 0, y: 0, z: -5 })
  const [xyz2, setXyz2] = useState({ x: 0, y: -1, z: -6 })
  const [xyz3, setXyz3] = useState({ x: 0, y: -1, z: -6 })

  const onInitialized = (state, reason) => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setText('Hello World!');
    }
  };
  console.log(main);

  function _onDrag(draggedToPosition, source) {
    setXyz({ x: draggedToPosition[0], y: draggedToPosition[1], z: draggedToPosition[2] })
  }

  function _onDrag2(draggedToPosition, source) {
    setXyz2({ x: draggedToPosition[0], y: draggedToPosition[1], z: draggedToPosition[2] })
  }

  function _onDrag3(draggedToPosition, source) {
    setXyz3({ x: draggedToPosition[0], y: draggedToPosition[1], z: draggedToPosition[2] })
  }

  // const recording = () => {
  //   console.log(this); 
  // }

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
      // ref={recording}
      autofocus={true}
      initialScene={{
        scene: () => (
          <ViroARScene onTrackingUpdated={onInitialized}>
            {
              main.type == 'nft'
              && <ViroImage
                source={{ uri: main.image }}
                position={[xyz.x, xyz.y, xyz.z-3]}
                onDrag={_onDrag}
              />
            }
            {
              main.type == 'token'
              && <ViroNode
              scale={[0, -1, -1]}
                position={[xyz2.x, xyz2.y, xyz2.z]}
                onDrag={_onDrag2}>
                <ViroImage
                  position={[xyz2.x, xyz2.y, xyz2.z + 1]}
                  source={{ uri: main.image }}
                />
                <ViroText text={main.totalTokens} position={[xyz2.x + 0.1, xyz2.y - 1.2, xyz2.z + 1]} />
              </ViroNode>
            }
            {
              main.type == 'data_feed'
              && <ViroNode
                position={[xyz3.x, xyz3.y, xyz3.z]}
                onDrag={_onDrag3}>
                <ViroImage
                  source={{ uri: main.image1 }}
                  position={[xyz3.x, xyz3.y, xyz3.z + 0.1]}
                  className='rounded-full z-10'
                />
                <ViroImage
                  source={{ uri: main.image2 }}
                  position={[xyz3.x + 0.7, xyz3.y, xyz3.z]}
                  className='rounded-full'
                  style={{
                    borderRadius: 100
                  }}
                />
                <ViroText text={main.pair}
                  width={3}
                  style={{
                    fontFamily: "Arial",
                    fontSize: 40,
                    fontStyle: "italic",
                    color: "#fff"
                  }}
                  position={[xyz3.x + 1, xyz3.y - 1.5, xyz3.z]}
                />
                <ViroText text={`$ ${Number(main.price).toFixed(2)}`}
                  width={3}
                  style={{
                    fontFamily: "Arial",
                    fontSize: 40,
                    fontStyle: "italic",
                    color: "#fff"
                  }}
                  position={[xyz3.x + 1, xyz3.y - 2, xyz3.z]}
                />
              </ViroNode>
            }
            {main.type == 'lens' &&
              <ViroNode
                position={[xyz3.x, xyz3.y, xyz3.z]}
                onDrag={_onDrag3}>
                <ViroImage
                  source={require('../assets/lens.jpeg')}
                  position={[xyz3.x + 0.3, xyz3.y, xyz3.z]}
                  width={1.5}
                  height={1.5}
                />
                <ViroText text={`@${main.lensHandle}`}
                  width={2}
                  style={{
                    fontFamily: "Arial",
                    fontSize: 40,
                    fontStyle: "italic",
                    color: "#fff"
                  }}
                  position={[xyz3.x + 0.5, xyz3.y - 1.5, xyz3.z]}
                />
              </ViroNode>
            }
            {
              (main.type != 'lens' && main.type != 'data_feed' && main.type != 'nft' && main.type != '3DNft') &&
              <ViroText text={text} position={[0, 0, -4]} />
            }
            {
              main.type == '3DNft' &&
              <Viro3DObject
                source={{uri:main.obj}}
                position={[-0.0, -5.5, -1.15]}
                // materials={["heart"]}
                type="GLB" />
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
