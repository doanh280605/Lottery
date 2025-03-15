import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import mega from '../../../assets/mega.png'
import power from '../../../assets/power.png'

const History = () => {
    const navigation = useNavigation();
    const [predictions, setPredictions] = useState([])
    const [nextTicketTurn, setNextTicketTurn] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [selectedTicket, setSelectedTicket] = useState('mega');

    const handleSelect = (ticketType) => {
        setSelectedTicket(ticketType);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Lịch sử dự đoán',
            headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 18
            },
        });
    }, [navigation]);

    const fetchPredictions = async () => {
        setLoading(true);
        try {
            const userId = await AsyncStorage.getItem('app_user_id');
            const response = await fetch(`http://192.168.1.52:3000/api/prediction/history?ticketType=${selectedTicket}&userId=${userId}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error fetching predictions:', errorText);
                setError('Không thể tải dự đoán.');
                return;
            }

            const data = await response.json();
            if (data && Array.isArray(data)) {
                const latestPredictionsMap = data.reduce((acc, prediction) => {
                    const { ticketTurn, createdAt } = prediction;
                    if (!acc[ticketTurn] || new Date(acc[ticketTurn].createdAt) < new Date(createdAt)) {
                        acc[ticketTurn] = prediction;
                    }
                    return acc;
                }, {});

                const latestPredictions = Object.values(latestPredictionsMap).sort((a, b) => b.ticketTurn - a.ticketTurn);
                setPredictions(latestPredictions);
            } else {
                setError('Chưa có dự đoán.');
            }
        } catch (error) {
            console.error('Error fetching predictions:', error);
            setError('Không thể tải dự đoán.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPredictions();
        const interval = setInterval(fetchPredictions, 100000);

        return () => clearInterval(interval);
    }, [selectedTicket]);


    if (loading) {
        return (
            <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#C7000F" />
            </View>
        );
    }


    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    return (
        <>
            <View style={styles.selectorContainer}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>Loại vé</Text>
                <View style={styles.selector}>
                    <TouchableOpacity onPress={() => handleSelect('mega')}>
                        <View
                            style={[
                                styles.selectionIndicator,
                                selectedTicket === 'mega' && styles.activeSelection,
                            ]}
                        >
                            <Image source={mega} style={styles.icon} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSelect('power')}>
                        <View
                            style={[
                                styles.selectionIndicator,
                                selectedTicket === 'power' && styles.activeSelection,
                            ]}
                        >
                            <Image source={power} style={styles.icon} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
            >
                {/* Display Predictions */}
                {predictions
                    .filter((prediction) => prediction.ticketType === selectedTicket)
                    .map((prediction, index) => (
                        <View key={index} style={styles.olderTicketContainer}>
                            <View style={styles.kyve}>
                                <Text style={{ fontSize: 16 }}>Kỳ quay </Text>
                                <Text style={styles.ticketTurn}>#{prediction.ticketTurn}</Text>
                            </View>

                            <View style={styles.predictionLabelContainer}>
                                <Text style={styles.predictionLabel}>Dự đoán các số</Text>
                            </View>

                            <View style={styles.olderNumbersContainer}>
                                {Array.isArray(prediction.predictedNumbers) &&
                                    prediction.predictedNumbers.map((number, idx) => (
                                        <View key={idx} style={styles.olderBall}>
                                            <Text style={styles.olderBallText}>
                                                {number.toString().padStart(2, '0')}
                                            </Text>
                                        </View>
                                    ))}
                            </View>
                        </View>
                    ))}
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        bottom: '2%'
    },
    selectorContainer: {
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    selector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        marginVertical: 10,
        paddingTop: 10,
        paddingHorizontal: 80,
        width: 370,
    },
    selectionIndicator: {
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    activeSelection: {
        backgroundColor: '#FFC91F',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20
    },
    contentContainer: {
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