import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SplashScreen from "../SplashScreen";
import HomeScreen from "../HomeScreen";
import DrawDetail from "../DrawDetail";
import PowerDetail from "../PowerDetail";
import DiceScreen from "../DiceScreen";
const Stack = createNativeStackNavigator();

export default function Navigation() {

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='splash' screenOptions={{ headerShown: false }}>
                <Stack.Screen name='home' component={HomeScreen} />
                <Stack.Screen name='splash' component={SplashScreen} />
                <Stack.Screen
                    name="draw-detail"
                    component={DrawDetail}
                    options={{ headerShown: true,
                               headerBackTitleVisible: false,
                               headerStyle: {
                                backgroundColor: '#A80D05'
                               },
                               headerTintColor: 'white'
                    }}
                />
                <Stack.Screen
                    name="power-detail"
                    component={PowerDetail}
                    options={{ headerShown: true,
                               headerBackTitleVisible: false,
                               headerStyle: {
                                backgroundColor: '#A80D05'
                               },
                               headerTintColor: 'white'
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}