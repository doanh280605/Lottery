import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ConsecutiveTable = () => {
  const data = [
    { number: '06', frequency: '2 lần' },
    { number: '23', frequency: '2 lần' },
    { number: '29', frequency: '3 lần' },
    { number: '55', frequency: '3 lần' },
    { number: '68', frequency: '3 lần' },
    { number: '33', frequency: '3 lần' },
    { number: '77', frequency: '3 lần' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>LIÊN TIẾP</Text>
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

export default ConsecutiveTable;