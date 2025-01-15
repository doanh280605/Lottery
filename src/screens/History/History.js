import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const History = () => {
    const navigation = useNavigation();
    const [latestPrediction, setLatestPrediction] = useState([]);
    const [nextTicketTurn, setNextTicketTurn] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Lịch sử dự đoán',
            headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 18
            },
        });
    }, [navigation]);

    const fetchNextTicketTurn = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/lottery-result');
            const data = await response.json();
            if (data && Array.isArray(data) && data.length > 0) {
                const currentTurn = data[0].ticketTurn;
                const nextTurn = (parseInt(currentTurn) + 1).toString().padStart(5, '0');
                setNextTicketTurn(nextTurn);
                return nextTurn;
            }
        } catch (error) {
            console.error('Error fetching next ticket turn:', error);
            setError('Failed to fetch ticket turn.');
        } finally {
            setLoading(false);
        }
    };

    const fetchLatestPrediction = async (turn) => {
        if (!turn) return;
        
        try {
            const response = await fetch(`http://localhost:3000/api/prediction/latest?currentTurn=${turn}`);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error fetching prediction:', errorText);
                setError('Failed to fetch prediction data.');
                return;
            }
    
            const data = await response.json();
            if (data && data.predictedNumbers) {
                setLatestPrediction(data.predictedNumbers);
                console.log('Latest prediction for turn:', data.ticketTurn);
            } else {
                setError('No prediction data available');
            }
        } catch (error) {
            console.error('Error fetching prediction:', error);
            setError('Failed to fetch prediction data.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const nextTurn = await fetchNextTicketTurn();
            if (nextTurn) {
                await fetchLatestPrediction(nextTurn);
            }
        };
        
        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#C7000F" />
            </View>
        );
    }
    

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.olderTicketContainer}>
                <View style={styles.kyve}>
                    <Text style={{fontSize: 16}}>Kỳ quay </Text>
                    <Text style={styles.ticketTurn}>#{nextTicketTurn}</Text>
                </View>

                <View style={styles.predictionLabelContainer}>
                    <Text style={styles.predictionLabel}>Dự đoán các số</Text>
                </View>

                <View style={styles.olderNumbersContainer}>
                    {Array.isArray(latestPrediction) && latestPrediction.map((number, index) => (
                        <View key={index} style={styles.olderBall}>
                            <Text style={styles.olderBallText}>
                                {number?.toString().padStart(2, '0') || '00'}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center'
    },
    olderTicketContainer: {
        backgroundColor: 'white',
        marginVertical: 10,
        borderRadius: 10,
        elevation: 2,
        height: 128,
        width: 370
    },
    kyve: {
        alignItems: 'center',
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10
    },
    ticketTurn: {
        fontWeight: 'bold',
        color: 'red',
        fontSize: 16
    },
    olderNumbersContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10
    },
    olderBall: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFD2D6',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    olderBallText: {
        color: '#C7000F',
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    predictionLabelContainer: {
        alignItems: 'center',
    },
    predictionLabel: {
        fontSize: 16
    }
});

export default History;