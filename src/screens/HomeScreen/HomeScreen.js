import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { XMLParser } from "fast-xml-parser";
import 'react-native-gesture-handler';

import DiceScreen from "../DiceScreen";
import SettingScreen from "../SettingScreen";
import LotteryDisplay from "../LotteryDisplay";
import Dice from '../../../assets/dice.png';
import Home from '../../../assets/Home.png';
import Account from '../../../assets/account.png';
import logo from '../../../assets/LotteryLogo.png';
import vector from '../../../assets/Vector_18.png'


const Tab = createBottomTabNavigator();
const size = 30;
const RSS_URL = 'http://localhost:3000/api/rss';

const AnimatedText = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const animationRef = useRef(null);

    useEffect(() => {
        if (!value) return;

        // Convert string like "53,382,262,500đ" to number
        const targetValue = parseInt(value.replace(/[^0-9]/g, ''));
        const startValue = 0;
        const duration = 3000; // 3 seconds animation
        const framesPerSecond = 60;
        const totalFrames = (duration / 1000) * framesPerSecond;
        let frame = 0;

        const animate = () => {
            frame++;
            const progress = frame / totalFrames;
            const easedProgress = easeOutExpo(progress);
            const current = Math.round(startValue + (targetValue - startValue) * easedProgress);

            setDisplayValue(current);

            if (frame < totalFrames) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        // Easing function for smooth animation
        const easeOutExpo = (x) => {
            return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [value]);

    // Format the number with commas and đ symbol
    const formattedValue = displayValue.toLocaleString('en-US') + 'đ';

    return (
        <Text style={styles.jackpotValue}>{formattedValue}</Text>
    );
};

const HomeScreen = () => {
    const [jackpotValue, setJackpotValue] = useState('');
    const [jackpotDate, setJackpotDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lotteryData, setLotteryData] = useState([]);

    const fetchRSS = async () => {
        setLoading(true);
        try {
            const response = await fetch(RSS_URL);
            const responseData = await response.text();

            const parser = new XMLParser({
                ignoreAttributes: false,
                attributeNamePrefix: "@_"
            });
            const parsedData = parser.parse(responseData);

            const description = parsedData?.rss?.channel?.item?.description;
            if (description) {
                // Split the description into jackpot value and date
                const jackpotParts = description.split('Draw Date: ');
                const jackpotValue = jackpotParts[0]?.replace('Jackpot Value: ', '').trim(); // Extracting the jackpot value
                const jackpotDate = jackpotParts[1]?.trim(); // Extracting the draw date

                setJackpotValue(jackpotValue);
                setJackpotDate(jackpotDate);
                setError(null);
            } else {
                setError('No jackpot data available');
            }
        } catch (error) {
            console.error("Error details:", error);
            setError(`Failed to load jackpot data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRSS();
        const intervalId = setInterval(fetchRSS, 300000); // Refresh every 5 minutes
        return () => clearInterval(intervalId);
    }, []);

    const fetchLotteryResults = async () => {
        setLoading(true); // Start loading indicator
        try {
            const response = await fetch('http://localhost:3000/api/lottery-result');
            const responseData = await response.json(); // Parse JSON response

            if (responseData && Array.isArray(responseData)) {
                // Map backend response to desired frontend structure
                const lotteryResults = responseData.map((item) => {
                    const numbers = Array.isArray(item.resultNumbers) ? item.resultNumbers : [];
                    const ticketTurn = item.ticketTurn || 'N/A';
                    const jackpotValue = item.jackpotValue || 'N/A';
                    const drawDate = item.drawDate || 'N/A';

                    return {
                        numbers,
                        ticketTurn,
                        jackpotValue,
                        drawDate,
                    };
                });

                setLotteryData(lotteryResults); // Update state with processed data
                setError(null); // Clear any existing error
            } else {
                console.error('No valid lottery data received.');
                setError('No lottery data available'); // Display error to user
            }
        } catch (error) {
            console.error('Error fetching lottery results:', error);
            setError('Failed to fetch lottery results. Please try again later.');
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };

    useEffect(() => {
        fetchLotteryResults(); // Initial fetch on component mount
        const intervalId = setInterval(fetchLotteryResults, 300000); // Refetch every 5 minutes
        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    return (
        <View style={styles.container}>
            <Image source={vector} style={styles.vector}/>
            <View style={styles.logoContainer}>
                <Image source={logo} style={styles.logo} />
            </View>

            {/* Jackpot Value */}
            <View style={styles.contentContainer}>
                <Text style={styles.label}>Jackpot</Text>
                <AnimatedText value={jackpotValue} style={styles.jackpotValue} />
                <Text style={styles.description}>
                    (Jackpot Mega 6/45 mở thưởng {jackpotDate})
                </Text>
            </View>
            <LotteryDisplay 
                lotteryData={lotteryData}
                loading={loading}
                error={error}
            />
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
    contentContainer: {
        padding: 5,
        backgroundColor: '#FFC91F',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginTop: 20,
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        borderColor: '#E09D00'
    },
    label: {
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    jackpotValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#c00',
        textAlign: 'center',
        paddingVertical: 10,
    },
    loading: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        fontSize: 16,
    },
    resultsContainer: {
        marginTop: 20,
        width: '90%'
    },
    ticketContainer: {
        marginBottom: 20,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    ticketTurnLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    ticketTurn: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
    },
    resultNumbersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    ball: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#D30010',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
    },
    ballText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    kyve: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10
    },
    vector: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover', 
        zIndex: -1, 
    },
});

export default MyTabs;
