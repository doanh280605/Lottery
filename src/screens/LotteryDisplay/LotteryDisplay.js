import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Mega from '../../components/Mega';
import Power from '../../components/Power';
import mega from '../../../assets/mega.png'
import power from '../../../assets/power.png'

const LotteryDisplay = () => {
  const [selectedTicket, setSelectedTicket] = useState('mega');

  const handleSelect = (ticket) => {
    setSelectedTicket(ticket);
  };

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

        {/* Mega or Power Content */}
        {selectedTicket === 'mega' ? (
          <Mega />
        ) : (
          <Power />
        )}

      </View>

      <Text style={styles.more}>Xem thêm ></Text>
    </View>

  );
};

const styles = StyleSheet.create({
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  olderTicketContainer: {
    backgroundColor: 'white',
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
    height: 120
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
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 80,
    top: '2%',
    borderBottomWidth: 4,
    borderBottomColor: '#E0E0E0',
    width: 350,
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
  latestTicketContainer: {
    backgroundColor: 'transparent',
  },
  more: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
    textAlign: 'center'
  }
});

export default LotteryDisplay;