import React, { useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

import PowerPredict from '../../components/PowerPrediction/PowerPredict';
import MegaPredict from '../../components/MegaPrediction/MegaPredict';

import vietlott from '../../../assets/vietloff.png'
import megaBig from '../../../assets/megaBigger.png'
import max from '../../../assets/max.png'
import power from '../../../assets/power.png'
import megaSmall from '../../../assets/mega.png'
import vietlottBig from '../../../assets/vietlottbig.png'
import maxBig from '../../../assets/maxBig.png'
import powerBig from '../../../assets/powerBig.png'


const DiceScreen = () => {
    const navigation = useNavigation();

    const ticketOptions = [
        { id: 'megaSmall', source: megaSmall, highResSource: megaBig, apiUrl: 'http://192.168.1.52:3000/api/lottery-result' },
        { id: 'power', source: power, highResSource: powerBig, apiUrl: 'http://192.168.1.52:3000/api/power-result' },
    ];

    const [selectedTicket, setSelectedTicket] = useState(ticketOptions[0]?.id);

    const handleSelect = (id) => {
        setSelectedTicket(id);
    };

    // State to store numbers
    const [numbers, setNumbers] = useState(Array(6).fill(''));
    const [isNumberEntered, setIsNumberEntered] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [ticketTurn, setTicketTurn] = useState(0);

    useFocusEffect(
        useCallback(() => {
            return () => {
                setSelectedTicket(ticketOptions[0]?.id);
                setNumbers(Array(6).fill(''));
                setIsNumberEntered(false);
                setIsConfirmed(false);
            };
        }, [])
    );

    const handleInputChange = (text, index) => {
        if (!/^\d*$/.test(text)) return;
        const updateNumbers = [...numbers];
        updateNumbers[index] = text;
        setNumbers(updateNumbers);
        setIsNumberEntered(updateNumbers.some(num => num !== ''));
    }

    const fetchLotteryResults = async (selectedTicketId) => {
        try {
            const selectedTicket = ticketOptions.find(ticket => ticket.id === selectedTicketId);

            if (!selectedTicket) {
                throw new Error('Invalid ticket selection');
            }

            const response = await fetch(selectedTicket.apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();

            if (!Array.isArray(responseData) || responseData.length === 0) {
                throw new Error('No lottery data available');
            }

            const latestTicket = responseData[0];

            if (!latestTicket?.ticketTurn) {
                throw new Error('Invalid ticket data - missing ticketTurn');
            }

            // Calculate next ticket turn
            const currentTurn = parseInt(latestTicket.ticketTurn, 10);
            const nextTicketTurn = (currentTurn + 1).toString().padStart(5, '0');

            setTicketTurn(nextTicketTurn);

        } catch (error) {
            console.error('Error in fetchLotteryResults:', error.message);
            setError(error.message);
            setTicketTurn(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedTicket) {
            fetchLotteryResults(selectedTicket);
        }
    }, [selectedTicket]);


    // Handle form submission
    const handleSubmit = async () => {
        const formattedNumbers = numbers.filter(num => num !== '').map(num => parseInt(num, 10));

        if (formattedNumbers.length === 0) {
            Alert.alert('Vui lòng nhập ít nhất 1 số');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/guess', {
                ticketType: selectedTicket,
                ticketTurn: ticketTurn,
                numbers: formattedNumbers,
            });

            if (response.status === 201) {
                console.log("Ticket turn submitted: ", ticketTurn);
                setIsConfirmed(true);
            }
        } catch (error) {
            console.error('Error submitting guess: ', error);
            Alert.alert('Không thể lưu dự đoán, vui lòng thử lại');
        }
    };


    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Chọn số may mắn',
            headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 18
            },
        });
    }, [navigation]);

    const renderPredictionComponent = () => {
        if (selectedTicket === 'megaSmall') {
            console.log('Passing numbers: ', numbers)
            return <MegaPredict numbers={numbers} />;
        } else if (selectedTicket === 'power') {
            return <PowerPredict numbers={numbers} />;
        }
        return null;
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={[styles.chooseNumberContainer, isConfirmed && styles.expandedContainer]}>
                    {/* Title */}
                    {!isConfirmed && (
                        <>
                            <Text style={styles.title}>Chọn loại vé</Text>
                            <View style={styles.selector}>
                                {ticketOptions.map((ticket) => (
                                    <TouchableOpacity
                                        key={ticket.id}
                                        onPress={() => handleSelect(ticket.id)}
                                        style={[
                                            styles.imageWrapper,
                                            selectedTicket === ticket.id && styles.selectedImageWrapper,
                                            (ticket.id === 'vietlott' || ticket.id === 'power') && { marginTop: 3 },
                                        ]}
                                    >
                                        <Image source={ticket.source} style={styles.icon} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}

                    {/* Divider */}
                    <View style={styles.divider} />

                    {selectedTicket && (
                        <View style={styles.selectedTicketContainer}>
                            <Image
                                source={ticketOptions.find((ticket) => ticket.id === selectedTicket)?.highResSource}
                                style={styles.selectedTicketImage}
                            />
                        </View>
                    )}

                    {/* Number Input */}
                    <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', marginTop: 15 }}>
                        Số của bạn chọn
                    </Text>
                    <View style={styles.numberInputContainer}>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <TextInput
                                key={index}
                                style={styles.numberInput}
                                keyboardType="numeric"
                                maxLength={2}
                                textAlign="center"
                                value={numbers[index]}
                                onChangeText={(text) => handleInputChange(text, index)}
                                editable={!isConfirmed}
                            />
                        ))}
                    </View>

                    {/* Submit Button */}
                    {!isConfirmed && (
                        <TouchableOpacity
                            onPress={handleSubmit}
                            style={[styles.button, { backgroundColor: isNumberEntered ? '#D9112A' : '#B0B0B0' }]}
                            disabled={!isNumberEntered}
                        >
                            <Text style={styles.buttonText}>XÁC NHẬN</Text>
                        </TouchableOpacity>
                    )}

                    {/* Prediction Component */}
                    {isConfirmed && renderPredictionComponent()}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    expandedContainer: {
        height: '83%',
        bottom: '6%'
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 8
    },
    chooseNumberContainer: {
        width: '95%',
        height: 476,
        backgroundColor: '#FEECED',
        bottom: '17%',
        borderRadius: 15
    },
    selector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 80,
        paddingVertical: 10,
        alignContent: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#FFDADF',
        position: 'absolute',
        top: '20%',
        width: '91%',
        alignSelf: 'center'
    },
    imageWrapper: {
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    selectedImageWrapper: {
        backgroundColor: '#FFC91F',
    },
    selectedTicketContainer: {
        alignItems: 'center',
        marginTop: 15,
    },
    numberInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 15,
    },
    numberInput: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'red',
        textAlign: 'center',
        fontSize: 18,
        color: '#000',
        backgroundColor: '#fff',
        fontWeight: 'bold'
    },
    button: {
        position: 'absolute',
        top: 570,
        left: '2.5%',
        right: '2.5%',
        borderRadius: 15,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: '95%'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
    },
});

export default DiceScreen;