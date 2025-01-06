import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import 'react-native-gesture-handler';

import DiceScreen from "../DiceScreen";
import SettingScreen from "../SettingScreen";
import Dice from '../../../assets/dice.png';
import Home from '../../../assets/Home.png';
import Account from '../../../assets/account.png';
import logo from '../../../assets/LotteryLogo.png';


const Tab = createBottomTabNavigator();
const size = 30;

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={logo} style={styles.logo} />
            </View>
        </View>
    );
};

function MyTabs() {
    return (
        <Tab.Navigator 
            screenOptions={{ 
                headerShown: false,
                tabBarStyle: {
                    height: 75,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    backgroundColor: 'white',
                    position: 'absolute',
                    bottom: 0,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            style={{ width: size, height: size }}
                            source={Home}
                        />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text style={[styles.tabBarLabel, { color: focused ? 'red' : 'black', fontSize: 16 }]}>
                            Home
                        </Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Dice"
                component={DiceScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.diceContainer}>
                            <Image
                                style={{ width: size, height: size }}
                                source={Dice}
                            />
                        </View>
                    ),
                    tabBarLabel: () => null
                }}
            />
            <Tab.Screen
                name="Setting"
                component={SettingScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            style={{ width: size, height: size }}
                            source={Account}
                        />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text style={[styles.tabBarLabel, { color: focused ? 'red' : 'black', fontSize: 16 }]}>
                            Settings
                        </Text>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    nothing: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',  // Align children to the top of the screen
        alignItems: 'center',
        backgroundColor: '#A6000C'
    },
    logoContainer: {
        marginTop: 40,  // Optional, to give space from top
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        marginTop: 20,
    },
    diceContainer: {
        width: 70,
        height: 70,
        backgroundColor: '#E74C3C',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default MyTabs;
