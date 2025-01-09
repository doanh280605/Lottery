import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import ticket from '../../../assets/ticket.png'
import vietlott from '../../../assets/vietloff.png'
import mega from '../../../assets/megaBigger.png'
import max from '../../../assets/max.png'
import power from '../../../assets/power.png'

const DrawDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const { result, lotteryData } = route.params;

    useLayoutEffect(() => {
        navigation.setOptions({
            title: `Kết quả quay kỳ #${result.ticketTurn}`,
            headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 18
            },
        });
    }, [navigation, result.ticketTurn]);


    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <View style={styles.ticketContainer}>
                    <Image
                        source={ticket}
                        style={styles.ticketImage}
                        resizeMode="contain"
                    />
                    <Image
                        source={mega}
                        style={{ position: 'absolute', top: '15%', width: 94.75, height: 54 }}
                    />
                    <View style={styles.divider} />
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 16,
                        color: 'red',
                        position: 'absolute',
                        top: '43%'
                    }}>Kỳ QSMT : {result.drawDate} - #{result.ticketTurn}</Text>
                    <View style={styles.latestNumbersContainer}>
                        {result.numbers.map((number, index) => (
                            <View key={index} style={styles.latestBall}>
                                <Text style={styles.latestBallText}>
                                    {number.toString().padStart(2, '0')}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.prizeTable}>
                    <View style={styles.prizeHeader}>
                        <Text style={[styles.prizeHeaderText, { flex: 3, textAlign: 'left' }]}>Giải thưởng</Text>
                        <Text style={[styles.prizeHeaderText, { flex: 3, textAlign: 'left', paddingLeft: 15 }]}>Trùng khớp</Text>
                        <Text style={[styles.prizeHeaderText, { flex: 4, textAlign: 'right' }]}>Giá trị giải</Text>
                    </View>

                    {/* Jackpot Row */}
                    <View style={[styles.prizeRow, styles.whiteRow]}>
                        <Text style={[styles.prizeType, { flex: 2 }]}>Jackpot</Text>
                        <View style={[styles.matchDotsContainer, { flex: 3 }]}>
                            <View style={styles.matchDots}>
                                {[...Array(6)].map((_, i) => (
                                    <View key={i} style={[styles.dot, i === 5 ? styles.dotFilled : null]} />
                                ))}
                            </View>
                        </View>
                        <Text style={[styles.prizeValue, { flex: 4 }]}>{result.jackpotValue}</Text>
                    </View>

                    {/* First Prize Row */}
                    <View style={[styles.prizeRow, styles.pinkRow]}>
                        <Text style={[styles.prizeType, { flex: 2 }]}>Giải nhất</Text>
                        <View style={[styles.matchDotsContainer, { flex: 3 }]}>
                            <View style={styles.matchDots}>
                                {[...Array(5)].map((_, i) => (
                                    <View key={i} style={[styles.dot, i >= 3 ? styles.dotFilled : null]} />
                                ))}
                            </View>
                        </View>
                        <Text style={[styles.prizeValue, { flex: 4 }]}>10,000,000đ</Text>
                    </View>

                    {/* Second Prize Row */}
                    <View style={[styles.prizeRow, styles.whiteRow]}>
                        <Text style={[styles.prizeType, { flex: 2 }]}>Giải nhì</Text>
                        <View style={[styles.matchDotsContainer, { flex: 3 }]}>
                            <View style={styles.matchDots}>
                                {[...Array(4)].map((_, i) => (
                                    <View key={i} style={[styles.dot]} />
                                ))}
                            </View>
                        </View>
                        <Text style={[styles.prizeValue, { flex: 4 }]}>300,000đ</Text>
                    </View>

                    {/* Third Prize Row */}
                    <View style={[styles.prizeRow, styles.pinkRow]}>
                        <Text style={[styles.prizeType, { flex: 2 }]}>Giải ba</Text>
                        <View style={[styles.matchDotsContainer, { flex: 3 }]}>
                            <View style={styles.matchDots}>
                                {[...Array(3)].map((_, i) => (
                                    <View key={i} style={[styles.dot]} />
                                ))}
                            </View>
                        </View>
                        <Text style={[styles.prizeValue, { flex: 4 }]}>30,000đ</Text>
                    </View>
                </View>
                <View style={styles.choosenNumber}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Số của bạn chọn</Text>
                    <View style={styles.userChooseNumber}>
                        {result.numbers.map((number, index) => (
                            <View key={index} style={styles.userBall}>
                                <Text style={styles.userBallText}>
                                    {number.toString().padStart(2, '0')}
                                </Text>
                            </View>
                        ))}
                    </View>
                    <View style={{
                        height: 1,
                        backgroundColor: '#E09D00',
                        position: 'absolute',
                        top: '85%',
                        width: '110%',
                        alignSelf: 'center'
                    }} />
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        top: '27%'
                    }}>
                        <Text>Trùng khớp: </Text>
                        <Text>Xác suất: <Text style={{ fontWeight: 'bold', color: 'red' }}>0%</Text></Text>
                    </View>
                </View>
                <View style={{
                    backgroundColor: '#FF883A',
                    marginTop: 20,
                    padding: 10,
                    width: '110%',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold'
                    }}>CÁC KỲ QUAY KHÁC</Text>
                </View>
                {lotteryData
                    .filter(ticket => ticket.ticketTurn !== result.ticketTurn)
                    .sort((a, b) => b.ticketTurn - a.ticketTurn)
                    .map(ticket => (
                        <TouchableOpacity
                            key={ticket.ticketTurn}
                            onPress={() => navigation.replace('draw-detail', {
                                result: ticket,
                                lotteryData: lotteryData
                            })}
                        >
                            <View style={styles.olderTicketContainer}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View style={styles.kyve}>
                                        <Text>Kỳ quay </Text>
                                        <Text style={styles.ticketTurn}>#{ticket.ticketTurn}</Text>
                                        <Text> - {ticket.drawDate}</Text>
                                    </View>
                                    <Text style={{ marginRight: 20, color: 'red' }}>></Text>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.olderNumbersContainer}>
                                    {ticket.numbers.map((number, index) => (
                                        <View key={index} style={styles.olderBall}>
                                            <Text style={styles.olderBallText}>
                                                {number.toString().padStart(2, '0')}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 10,
        width: '100%',
    },
    ticketContainer: {
        width: '100%',
        alignItems: 'center',
        position: 'relative',
        marginTop: 0,
    },
    ticketImage: {
        width: '105%',
    },
    latestNumbersContainer: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        top: '55%',
        width: '100%',
    },
    latestBall: {
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: '#D30010',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    latestBallText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#FFDADF',
        position: 'absolute',
        top: '40%',
        width: '91%',
        alignSelf: 'center'
    },
    prizeTable: {
        backgroundColor: 'white',
        width: '97%',
        borderRadius: 15,
        overflow: 'hidden',
        bottom: 15
    },
    prizeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: '#FFD2D6',
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
    choosenNumber: {
        width: '97%',
        backgroundColor: '#FFC91F',
        borderRadius: 15,
        overflow: 'hidden',
        alignItems: 'center',
        height: 150,
        padding: 15
    },
    userChooseNumber: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        top: '5%'
    },
    userBall: {
        width: 38,
        height: 38,
        borderRadius: 23,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    userBallText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
    olderTicketContainer: {
        backgroundColor: 'white',
        marginVertical: 10,
        borderRadius: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        width: '95%',
        marginTop: 20
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
        padding: 10
    },
    olderBall: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFA500',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    olderBallText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});


export default DrawDetailScreen;
