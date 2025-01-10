import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Mega from '../../components/Mega';
import Power from '../../components/Power';
import mega from '../../../assets/mega.png'
import power from '../../../assets/power.png'

const LotteryDisplay = ({ lotteryData, loading, error }) => {
  const [selectedTicket, setSelectedTicket] = useState('mega');

  const handleSelect = (ticket) => {
    setSelectedTicket(ticket);
  };

  if (loading) {
    return (
      <View>
        <View style={styles.latestTicketContainer}>
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
          </View>
        </View>
        <View style={styles.olderTicketContainer}>
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
          </View>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.resultsContainer}>
      <View style={styles.latestTicketContainer}>
        {/* Selector */}
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

        <View style={styles.divider} />

        {/* Mega or Power Content */}
        {selectedTicket === 'mega' ? (
          lotteryData && lotteryData.length > 0 ? (
            <Mega results={lotteryData} />
          ) : (
            <Text>No Mega results available.</Text>
          )
        ) : (
          lotteryData && lotteryData.length > 0 ? (
            <Power results={lotteryData} />
          ) : (
            <Text>No Power results available.</Text>
          )
        )}
      </View>

      {/* "Xem thêm" Text */}
      <Text style={styles.more}>Xem thêm ></Text>
    </View>

  );
};

const styles = StyleSheet.create({
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#D30010',
    textAlign: 'center',
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 80,
    top: '2%'
  },
  selectionIndicator: {
    borderRadius: 10,
    paddingHorizontal: 10
  },
  activeSelection: {
    backgroundColor: '#FFC91F',
  },
  latestTicketContainer: {
    backgroundColor: 'transparent',
  },
  divider: {
    height: 3,
    backgroundColor: '#E0E0E0',
    top: '0.9%',
  },
  more: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
    textAlign: 'center'
  }
});

export default LotteryDisplay;