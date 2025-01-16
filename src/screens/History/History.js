import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const History = () => {
    const navigation = useNavigation();
    const [predictions, setPredictions] = useState([])
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

    const fetchPredictions = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/prediction/history');
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error fetching predictions:', errorText);
                setError('Không thể tải dự đoán.');
                return;
            }

            const data = await response.json();
            if (data && Array.isArray(data)) {
                // Sort predictions by ticketTurn in descending order (newest first)
                const latestPredictionsMap = data.reduce((acc, prediction) => {
                    const { ticketTurn, createdAt } = prediction;
                    if (!acc[ticketTurn] || new Date(acc[ticketTurn].createdAt) < new Date(createdAt)) {
                        acc[ticketTurn] = prediction;
                    }
                    return acc;
                }, {});
    
                // Convert the map to an array and sort by ticketTurn descending
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

        return() => clearInterval(interval)
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
        <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            {predictions.map((prediction, index) => (
                <View key={index} style={styles.olderTicketContainer}>
                    <View style={styles.kyve}>
                        <Text style={{fontSize: 16}}>Kỳ quay </Text>
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: { 
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