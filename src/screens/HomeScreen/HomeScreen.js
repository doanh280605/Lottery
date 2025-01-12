import React, { useEffect, useState, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, ActivityIndicator, TouchableOpacity, Linking } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { XMLParser } from "fast-xml-parser";
import Carousel from "react-native-reanimated-carousel";
import 'react-native-gesture-handler';
import axios from "axios";

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
const deviceWidth = Dimensions.get('window').width;

const AnimatedText = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const animationRef = useRef(null);
    useEffect(() => {
        if (!value) return;
        // Convert string like "53,382,262,500đ" to number
        const targetValue = parseInt(value.replace(/[^0-9]/g, ''));
        const startValue = 0;
        const duration = 2000; // 2 seconds animation
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
    const [news, setNews] = useState([]);

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
        const intervalId = setInterval(fetchRSS, 86400000); // Refresh every 5 minutes
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/vietlottnews');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setNews(data);
            } catch (err) {
                console.error('Detailed error:', {
                    message: err.message,
                    stack: err.stack,
                });
                setError(err.message);
            }
        };

        fetchNews();
    }, []);

    const renderItem = ({ item }) => {
        const isBase64 = item.imageUrl.startsWith('data:image/gif;base64');
        const fallbackImageUrl = 'https://example.com/path/to/fallback-image.jpg';
    
        return (
            <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
                <View style={styles.newsItem}>
                    <Image 
                        source={{ uri: isBase64 ? fallbackImageUrl : item.imageUrl }} 
                        style={styles.newsImage} 
                    />
                    <View style={styles.newsTitleContainer}>
                        <Text style={styles.newsTitle}>{item.title}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    
    const memoizedCarousel = useMemo(() => (
        <Carousel
            loop
            data={news.slice(0, 6)}
            renderItem={renderItem}
            width={deviceWidth * 0.9}
            height={deviceWidth}
            autoPlay
            autoPlayInterval={3000}
        />
    ), [news]);


    return (
        <View style={styles.container}>
            <Image source={vector} style={styles.vector} />
            <View style={styles.logoContainer}>
                <Image source={logo} style={styles.logo} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.contentContainer}>
                    <Text style={styles.label}>Jackpot</Text>
                    <AnimatedText value={jackpotValue} style={styles.jackpotValue} />
                    <Text style={styles.description}>
                        (Jackpot Mega 6/45 mở thưởng {jackpotDate})
                    </Text>
                </View>
                <LotteryDisplay/>

                <View style={styles.divider} />
                <Text style={styles.newsHeader}>Tin tức mới</Text>
                
                <View style={styles.newsContainer}>
                    {error ? (
                        <Text style={styles.errorText}>Error: {error}</Text>
                    ) : (
                        memoizedCarousel
                    )}
                </View>
            </ScrollView>
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
                    tabBarLabel: () => null,
                    headerShown: true,
                    headerBackTitleVisible: true,
                    headerStyle: {
                        backgroundColor: '#A80D05'
                    },
                    headerTintColor: 'white'
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
                    headerShown: true,
                    headerBackTitleVisible: true,
                    headerStyle: {
                        backgroundColor: '#A80D05'
                    },
                    headerTintColor: 'white'
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
        width: '95%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        borderColor: '#E09D00',
        width: 350
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
    newsContainer: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    newsItem: {
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        alignItems: 'center',
    },
    newsImage: {
        width: '100%',
        height: 220,
        borderRadius: 15,
        resizeMode: 'cover',
        overflow: 'hidden'
    },
    newsTitleContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'rgba(128, 128, 128, 0.7)',
        paddingVertical: 5,
        alignItems: 'center',
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15
    },
    newsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    divider: {
        height: 3,
        backgroundColor: '#E0E0E0', 
        marginVertical: 20, 
        width: '100%'
    },
    newsHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'left',
        marginLeft: 4
    },
    scrollViewContent: {
        paddingBottom: 0,
        flexGrow: 1
    }
});

export default MyTabs;
