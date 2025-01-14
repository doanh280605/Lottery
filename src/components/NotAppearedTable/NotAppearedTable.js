import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotAppearedTable = () => {
  const data = [
    { number: '71', frequency: '10 lần' },
    { number: '17', frequency: '10 lần' },
    { number: '55', frequency: '9 lần' },
    { number: '22', frequency: '9 lần' },
    { number: '24', frequency: '8 lần' },
    { number: '46', frequency: '8 lần' },
    { number: '47', frequency: '7 lần' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>CHƯA VỀ</Text>
      </View>
      {data.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.number}>{item.number}</Text>
          <Text style={styles.frequency}>{item.frequency}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    margin: 5,
  },
  header: {
    backgroundColor: '#FFA500',
    padding: 10,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  number: {
    color: 'red',
    fontSize: 14,
  },
  frequency: {
    color: 'blue',
    fontSize: 14,
  },
});

export default NotAppearedTable;