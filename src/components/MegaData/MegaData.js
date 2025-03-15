import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import API_URL from '../../utils/config';

import MostFrequentTable from './MostFrequent/MostFrequentTable';
import LeastFrequentTable from './LeastFrequent/LeastFrequentTable';
import ConsecutiveTable from './ConsecutiveTable';
import NotAppearedTable from './NotAppearedTable';

const MegaData = () => {
    const [lotteryData, setLotteryData] = useState([]);
    const [userGuesses, setUserGuesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalGuesses, setTotalGuesses] = useState(0);
    const [totalMatches, setTotalMatches] = useState(0);
    const [totalUnmatched, setTotalUnmatched] = useState(0);

    const chartData = [
        { name: 'Tổng dự đoán', population: totalGuesses, color: '#3944BC' },
        { name: 'Tổng số trúng', population: totalMatches, color: '#3CB371' },
        { name: 'Tổng số trật', population: totalUnmatched, color: '#DC143C' },
    ];

    const renderLegendItem = ({ name, population, color }) => (
        <View style={styles.legendItem} key={name}>
            <View style={styles.legendDot(color)} />
            <Text style={styles.legendText}>{name}</Text>
            <Text style={styles.populationText(color)}>{population}</Text>
        </View>
    );

    const fetchLotteryResults = async () => {
        try {
            const response = await fetch(`${API_URL}/lottery-result`);
            const responseData = await response.json();

            if (responseData && Array.isArray(responseData)) {
                const lotteryResults = responseData.map((item) => ({
                    numbers: Array.isArray(item.resultNumbers) ? item.resultNumbers : [],
                    ticketTurn: item.ticketTurn || 'N/A',
                }));
                setLotteryData(lotteryResults);
                setError(null);
            } else {
                setError('No lottery data available');
            }
        } catch (error) {
            setError('Failed to fetch lottery results. Please try again later.');
        } finally {
            setLoading(false); 
        }
    };

    const fetchAllGuesses = async (ticketType) => {
        try {
            const response = await fetch(`${API_URL}/allguess?ticketType=${ticketType}`);

            if (!response.ok) {
                throw new Error('Failed to fetch guesses');
            }

            const guesses = await response.json();
            setUserGuesses(guesses);
            console.log('Fetched guesses:', guesses);
        } catch (error) {
            console.error('Error fetching guesses:', error);
        } finally {
            setLoading(false);
        }
    };

    const compareGuessesToLotteryResults = () => {
        const results = userGuesses.map((guess) => {
            const matchingResult = lotteryData.find((lotteryResult) => lotteryResult.ticketTurn === guess.ticketTurn);
            if (!matchingResult) {
                return { ticketTurn: guess.ticketTurn, matchCount: 0, unmatchedCount: guess.numbers.length };
            }

            const matches = guess.numbers.filter((num) => matchingResult.numbers.includes(num));
            const matchCount = matches.length;
            const unmatchedCount = guess.numbers.length - matchCount;

            return {
                ticketTurn: guess.ticketTurn,
                matchCount: matchCount,
                unmatchedCount: unmatchedCount,
            };
        });

        return results;
    };

    const calculateGuessStatistics = () => {
        const comparisonResults = compareGuessesToLotteryResults();
        const totalGuesses = comparisonResults.length;
        const totalMatches = comparisonResults.reduce((acc, result) => acc + result.matchCount, 0);
        const totalUnmatched = comparisonResults.reduce((acc, result) => acc + result.unmatchedCount, 0);

        setTotalGuesses(totalGuesses);
        setTotalMatches(totalMatches);
        setTotalUnmatched(totalUnmatched);
    };

    useEffect(() => {
        fetchLotteryResults();
        fetchAllGuesses('megaSmall'); 
    }, []);

    useEffect(() => {
        if (lotteryData.length > 0 && userGuesses.length > 0) {
            calculateGuessStatistics();
        }
    }, [lotteryData, userGuesses]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.contentContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#DC143C" />
                ) : (
                    <View style={styles.chartContainer}>
                        <PieChart
                            data={chartData}
                            width={Dimensions.get('window').width - 40}
                            height={140}
                            chartConfig={{
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor={'population'}
                            backgroundColor={'transparent'}
                            absolute
                            hasLegend={false}
                        />
                    </View>
                )}

                <View style={styles.legendContainer}>
                    {chartData.map(renderLegendItem)}
                </View>
            </View>

            {/* Tables Section */}
            <View style={styles.tablesContainer}>
                <View style={styles.tableRow}>
                    <View style={styles.tableColumn}>
                        <MostFrequentTable />
                    </View>
                    <View style={styles.tableColumn}>
                        <LeastFrequentTable />
                    </View>
                </View>
                <View style={styles.tableRow}>
                    <View style={styles.tableColumn}>
                        <NotAppearedTable />
                    </View>
                    <View style={styles.tableColumn}>
                        <ConsecutiveTable />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    chartContainer: {
        flex: 1,
        right: '5%',
    },
    legendContainer: {
        flex: 1,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    legendDot: (color) => ({
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: color,
        marginRight: 10,
    }),
    legendText: {
        flex: 1,
        fontSize: 14,
        color: 'black',
    },
    populationText: (color) => ({
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 10,
        color: color,
    }),
    // New styles for tables section
    tablesContainer: {
        marginTop: 10,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    tableColumn: {
        flex: 1,
        marginHorizontal: 5,
    },
});

export default MegaData