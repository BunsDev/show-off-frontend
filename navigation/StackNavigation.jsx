import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Connect from "../screens/Connect";
import { useAccount } from "wagmi";
import CameraScreen from "../screens/CameraScreen";
import VideoList from "../screens/VideoList";
import { Entypo } from "@expo/vector-icons";

const Stack = createStackNavigator();

export default function StackNavigation() {

    const { address } = useAccount()
    const [initialScreen, setInitialScreen] = useState(address != null ? 'camera' : 'connect')

    return (
        <>
            <Stack.Navigator
                initialRouteName={initialScreen}
            >
                <Stack.Screen
                    name="connect"
                    component={Connect}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="camera"
                    component={CameraScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="videolist"
                    component={VideoList}
                    options={{
                        headerShown: true,
                        headerTitleStyle: {
                            fontSize: 18,
                        },
                        title: "Saved video links"
                    }}
                />
            </Stack.Navigator>
        </>
    );
}

