import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import { registerLoggerConfig } from "react-native-reanimated/lib/typescript/logger";
import API_URL from "../../utils/config";

const Power = ({ }) => {
    const [lotteryData, setLotteryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    const fetchPowerLotteryResults = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/power-result`);
            const responseData = await response.json();

            if (responseData && Array.isArray(responseData)) {
                const lotteryResults = responseData.map((item) => ({
                    // Regular numbers array
                    numbers: Array.isArray(item.resultNumbers) ? item.resultNumbers : [],
                    // Special number as a separate field
                    specialNumber: item.specialNumber || 'N/A',
                    // Two jackpot values
                    jackpot1Value: item.jackpot1Value || 'N/A',
                    jackpot2Value: item.jackpot2Value || 'N/A',
                    // Other details
                    ticketTurn: item.ticketTurn || 'N/A',
                    drawDate: item.drawDate || 'N/A',
                }));

                setLotteryData(lotteryResults);
                setError(null);
            } else {
                setError('No lottery data available');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Failed to fetch lottery results. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPowerLotteryResults();
        // Fetch every 24 hours (86400000 milliseconds)
        const intervalId = setInterval(fetchPowerLotteryResults, 86400000);
        return () => clearInterval(intervalId);
    }, []);

    const navigateToDetail = (result) => {
        navigation.navigate('power-detail', {
          ticketTurn: result.ticketTurn,
          result: {
            numbers: result.numbers,
            specialNumber: result.specialNumber,
            ticketTurn: result.ticketTurn,
            jackpot1Value: result.jackpot1Value,
            jackpot2Value: result.jackpot2Value,
            drawDate: result.drawDate,
          },
          lotteryData: lotteryData
        });
    };

    // Example of how to destructure the first result for latest display
    const [latestResult, ...olderResults] = lotteryData.length > 0 ? lotteryData : [null, []];

    const renderLatestResult = (result) => {
        if(loading){
            return (
              <View style={{
                    backgroundColor: 'white',
                    marginVertical: 10,
                    borderBottomLeftRadius: 15,
                    borderBottomRightRadius: 15,
                    elevation: 3,
                    overflow: 'hidden',
                    height: 458,
                    bottom: 8,
                    width: 350,
                    justifyContent: 'center',
              }}>
                <ActivityIndicator size="large" color="black" />
              </View>
            )
        }

        if (!latestResult || !latestResult.numbers) return null;

        return (
            <TouchableOpacity
                onPress={() => navigateToDetail(result)}
                style={styles.latestTicketContainer}
            >
                <View style={styles.infoContainer}>
                    <Text style={[{
                        fontSize: 20,
                        textAlign: 'center',
                        fontWeight: 'bold'
                    }]}
                    >Kết quả sổ xố Vietlott Power 6/55 {latestResult.drawDate}</Text>
                </View>
                <View style={{ bottom: 4 }}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>SỐ TRÚNG THƯỞNG</Text>
                    </View>

                    <View style={styles.drawInfo}>
                        <Text style={styles.drawDetails}>
                            Kỳ vé: #{latestResult.ticketTurn} | Ngày quay thưởng {latestResult.drawDate}
                        </Text>
                    </View>

                    <View style={styles.latestNumbersContainer}>
                        {/* Regular numbers */}
                        {latestResult.numbers.map((number, index) => (
                            <View key={index} style={styles.latestBall}>
                                <Text style={styles.latestBallText}>
                                    {number.toString().padStart(2, '0')}
                                </Text>
                            </View>
                        ))}

                        {/* Special number */}
                        <View style={[styles.latestBall, styles.specialBall]}>
                            <Text style={styles.latestBallText}>
                                {latestResult.specialNumber.toString().padStart(2, '0')}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.prizeTable}>
                        <View style={styles.prizeHeader}>
                            <Text style={[styles.prizeHeaderText, { flex: 3, textAlign: 'left' }]}>Giải thưởng</Text>
                            <Text style={[styles.prizeHeaderText, { flex: 3, textAlign: 'left', paddingLeft: 15 }]}>Trùng khớp</Text>
                            <Text style={[styles.prizeHeaderText, { flex: 4, textAlign: 'right' }]}>Giá trị giải</Text>
                        </View>

                        <View style={[styles.prizeRow, styles.pinkRow]}>
                            <Text style={[styles.prizeType, { flex: 2 }]}>Jackpot 1</Text>
                            <View style={[styles.matchDotsContainer, { flex: 3 }]}>
                                <View style={styles.matchDots}>
                                    {[...Array(7)].map((_, i) => (
                                        <View key={i} style={[styles.dot, i === 5 ? styles.dotMatched : styles.dotUnmatched]} />
                                    ))}
                                </View>
                            </View>
                            <Text style={[styles.prizeValue, { flex: 4 }]}>{latestResult.jackpot1Value}</Text>
                        </View>

                        <View style={[styles.prizeRow, styles.whiteRow]}>
                            <Text style={[styles.prizeType, { flex: 2 }]}>Jackpot 2</Text>
                            <View style={[styles.matchDotsContainer, { flex: 3 }]}>
                                <View style={styles.matchDots}>
                                    {[...Array(7)].map((_, i) => (
                                        <View key={i} style={[styles.dot, i === 5 ? styles.dotMatched : styles.dotUnmatched]} />
                                    ))}
                                </View>
                            </View>
                            <Text style={[styles.prizeValue, { flex: 4 }]}>{latestResult.jackpot2Value}</Text>
                        </View>

                        <View style={[styles.prizeRow, styles.pinkRow]}>
                            <Text style={[styles.prizeType, { flex: 2 }]}>Giải nhất</Text>
                            <View style={[styles.matchDotsContainer, { flex: 3 }]}>
                                <View style={styles.matchDots}>
                                    {[...Array(5)].map((_, i) => (
                                        <View key={i} style={[styles.dot, i >= 3 ? styles.dotMatched : styles.dotUnmatched]} />
                                    ))}
                                </View>
                            </View>
                            <Text style={[styles.prizeValue, { flex: 4 }]}>40,000,000đ</Text>
                        </View>

                        <View style={[styles.prizeRow, styles.whiteRow]}>
                            <Text style={[styles.prizeType, { flex: 2 }]}>Giải nhì</Text>
                            <View style={[styles.matchDotsContainer, { flex: 3 }]}>
                                <View style={styles.matchDots}>
                                    {[...Array(4)].map((_, i) => (
                                        <View key={i} style={[styles.dot, styles.dotUnmatched]} />
                                    ))}
                                </View>
                            </View>
                            <Text style={[styles.prizeValue, { flex: 4 }]}>500,000đ</Text>
                        </View>

                        <View style={[styles.prizeRow, styles.pinkRow]}>
                            <Text style={[styles.prizeType, { flex: 2 }]}>Giải ba</Text>
                            <View style={[styles.matchDotsContainer, { flex: 3 }]}>
                                <View style={styles.matchDots}>
                                    {[...Array(3)].map((_, i) => (
                                        <View key={i} style={[styles.dot, styles.dotUnmatched]} />
                                    ))}
                                </View>
                            </View>
                            <Text style={[styles.prizeValue, { flex: 4 }]}>50,000đ</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <>
            {renderLatestResult(latestResult)}

            {olderResults.map((result) => (
                <TouchableOpacity
                    key={result.ticketTurn}
                    onPress={() => navigateToDetail(result)}
                    style={styles.olderTicketContainer}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={styles.kyve}>
                            <Text>Kỳ quay </Text>
                            <Text style={styles.ticketTurn}>#{result.ticketTurn}</Text>
                            <Text> - {result.drawDate}</Text>
                        </View>
                        <Text style={{ marginRight: 20, color: 'red' }}>{'>'}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.olderNumbersContainer}>
                        {Array.isArray(result.numbers) && result.numbers.map((number, index) => (
                            <View key={index} style={styles.olderBall}>
                            <Text style={styles.olderBallText}>
                                {number?.toString().padStart(2, '0') || '00'}
                            </Text>
                            </View>
                        ))}
                        {result?.specialNumber !== undefined && (
                            <View style={[styles.olderBall, styles.olderSpecialBall]}>
                            <Text style={styles.olderBallText}>
                                {result.specialNumber?.toString().padStart(2, '0') || '00'}
                            </Text>
                            </View>
                        )}
                    </View>

                </TouchableOpacity>
            ))}
        </>
    );
};

const styles = StyleSheet.create({
    resultsContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    latestTicketContainer: {
        backgroundColor: 'white',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        overflow: 'hidden',
        height: 458,
        marginTop: 10,
        width: 350
    },
    headerContainer: {
        backgroundColor: '#D30010',
        padding: 15,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    infoContainer: {
        paddingTop: 15,
        flex: 1,
        alignItems: 'center'
    },
    drawInfo: {
        padding: 10,
    },
    drawDetails: {
        fontSize: 12,
        color: '#666',
        textAlign: 'right'
    },
    latestNumbersContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingBottom: 15
    },
    latestBall: {
        width: 35,
        height: 35,
        borderRadius: 23,
        backgroundColor: '#D30010',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    specialBall: {
        backgroundColor: '#FFA500',
    },
    latestBallText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    // Prize table styles
    prizeTable: {
        backgroundColor: 'white',
    },
    prizeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: '#FFF8E7',
        padding: 15
    },
    prizeHeaderText: {
        flex: 1,
        fontSize: 14,
        textAlign: 'left',
    },
    prizeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        padding: 15
    },
    prizeType: {
        flex: 1,
        fontSize: 12,
        fontWeight: 'bold'
    },
    matchDotsContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: 40
    },
    matchDots: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 6,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 2,
    },
    dotFilled: {
        backgroundColor: '#D30010',
    },
    prizeValue: {
        flex: 1,
        fontSize: 12,
        textAlign: 'right',
        fontWeight: 'bold'
    },
    whiteRow: {
        backgroundColor: 'white',
    },
    pinkRow: {
        backgroundColor: '#FFF0F0',
    },
    // Older result styles
    olderTicketContainer: {
        backgroundColor: 'white',
        marginVertical: 10,
        borderRadius: 10,
        elevation: 2,
        height: 120
    },
    kyve: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15
    },
    ticketTurn: {
        fontWeight: 'bold',
        color: 'red'
    },
    olderNumbersContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 13
    },
    olderBall: {
        width: 35,
        height: 35,
        borderRadius: 20,
        backgroundColor: '#FFA500',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    olderSpecialBall: {
        backgroundColor: '#D30010',
    },
    olderBallText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    more: {
        fontSize: 18,
        color: 'white',
        marginTop: 20,
        textAlign: 'center'
    },
})

export default Power