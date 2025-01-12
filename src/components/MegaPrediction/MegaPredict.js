import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const MegaPredict = ({ numbers }) => {
    const [predictedNumbers, setPredictedNumbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lotteryResults, setLotteryResults] = useState([]);
    const [error, setError] = useState(null);

    const fetchLotteryResults = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/lottery-result');
            const contentType = response.headers.get('Content-Type');

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error fetching lottery results:', errorText);
                setError('Failed to fetch lottery results.');
                return;
            }

            if (contentType && contentType.includes('application/json')) {
                const responseData = await response.json();

                if (responseData && Array.isArray(responseData)) {
                    const formattedResults = responseData.map(item => ({
                        resultNumbers: Array.isArray(item.resultNumbers)
                            ? item.resultNumbers.map(num => parseInt(num, 10))
                            : [],
                    }));
                    setLotteryResults(formattedResults);
                    setError(null);
                } else {
                    setError('No lottery data available.');
                }
            } else {
                const errorText = await response.text();
                console.error('Unexpected response format:', errorText);
                setError('Unexpected response format.');
            }
        } catch (error) {
            console.error('Error fetching lottery results:', error);
            setError('Failed to fetch lottery results.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLotteryResults();
    }, []);

    const calculatePredictedNumbers = () => {
        if (lotteryResults.length === 0) {
            setError('No data to predict from.');
            return;
        }

        const previousResults = lotteryResults.map(item => item.resultNumbers);
        const allNumbers = previousResults.flat().map(Number);
        const frequencyMap = {};

        allNumbers.forEach(num => {
            frequencyMap[num] = (frequencyMap[num] || 0) + 1;
        });

        const sortedByFrequency = Object.keys(frequencyMap)
            .sort((a, b) => frequencyMap[b] - frequencyMap[a])
            .map(Number);

        const predictedNumbersSet = new Set();

        while (predictedNumbersSet.size < 3 && sortedByFrequency.length > 0) {
            const num = sortedByFrequency.shift();
            if (Math.random() < 0.6) {
                predictedNumbersSet.add(num);
            }
        }

        while (predictedNumbersSet.size < 6) {
            const randomNum = Math.floor(Math.random() * 46);
            predictedNumbersSet.add(randomNum);
        }

        setPredictedNumbers(Array.from(predictedNumbersSet).sort((a, b) => a - b));
        setError(null);
    };

    // useEffect to fetch data once when the component mounts
    useEffect(() => {
        if (lotteryResults.length > 0) {
            calculatePredictedNumbers();
        }
    }, [lotteryResults]);

    const matchingNumbers = numbers
        .filter(num => num !== '')
        .map(num => parseInt(num, 10))
        .filter(num => predictedNumbers.includes(num));

    return (
        <View style={styles.container}>
            {/* Prediction Percentage Section */}
            <View style={styles.percentageContainer}>
                <Text style={styles.percentageLabel}>
                    Dự đoán xác suất cho kỳ quay lần sau
                </Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#ff0000" style={{marginTop: 10, paddingBottom: 16}} />
                ) : (
                    <Text style={styles.percentageValue}>78%</Text>
                )}
            </View>

            {/* Predicted Numbers Section */}
            <View style={styles.predictedContainer}>
                <Text style={styles.predictLabel}>Dự đoán các số sẽ có</Text>
                <View style={styles.numbersContainer}>
                    {loading ? (
                        Array(6).fill().map((_, index) => (
                            <View key={index} style={styles.numberCircle}>
                                <Text style={styles.numberText}>...</Text>
                            </View>
                        ))
                    ) : predictedNumbers.length > 0 ? (
                        predictedNumbers.map((number, index) => (
                            <View key={index} style={styles.numberCircle}>
                                <Text style={styles.numberText}>
                                    {number.toString().padStart(2, '0')}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noPredictionText}>Chưa có dữ liệu dự đoán</Text>
                    )}
                    <Text style={styles.disclaimer}>
                        *Con số dự đoán xác suất chỉ mang tính giải trí, hệ thống không hoàn toàn chịu trách nhiệm
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.matchingContainer}>
                    <Text style={styles.matchingLabel}>Trùng khớp số bạn chọn: </Text>
                    <Text style={styles.matchingNumbers}>
                        {matchingNumbers.map(num => num.toString().padStart(2, '0')).join(', ')}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    percentageContainer: {
        alignItems: 'center',
        marginBottom: 20,
        width: 350,
        backgroundColor: 'white',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        padding: 10,
        top: '15%'
    },
    percentageLabel: {
        fontSize: 16,
        color: 'black',
        marginBottom: 8,
    },
    percentageValue: {
        fontSize: 52,
        fontWeight: 'bold',
        color: '#ff0000',
    },
    predictedContainer: {
        marginBottom: 15,
        alignItems: 'center',
        top: '11%',
        backgroundColor: 'white',
        width: 350,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        paddingVertical: 15,
    },
    predictLabel: {
        fontSize: 16,
        color: 'black',
        marginBottom: 10,
    },
    numbersContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    numberCircle: {
        width: 38,
        height: 38,
        borderRadius: 20,
        backgroundColor: '#FFD2D6',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    numberText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#C7000F',
    },
    matchingContainer: {
        top: '20%',
        alignItems: 'flex-start',
        width: 350,
        paddingLeft: 10,
        flexDirection: 'row',
        height: 40,
        paddingBottom: 10
    },
    matchingLabel: {
        fontSize: 14,
        color: '#333',
        textAlign: 'left'
    },
    disclaimer: {
        fontSize: 10,
        color: '#999',
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 10
    },
    divider: {
        height: 1,
        backgroundColor: '#FFDADF',
        position: 'absolute',
        top: '97%',
        width: '100%',
        alignSelf: 'center'
    },
    matchingNumbers: {
        fontWeight: 'bold',
        color: '#C7000F'
    }
});

export default MegaPredict;