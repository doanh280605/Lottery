import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const MostFrequentTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLotteryResults = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.52:3000/api/lottery-result');
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
          const allNumbers = responseData.flatMap(item =>
            Array.isArray(item.resultNumbers) ? item.resultNumbers.map(num => parseInt(num, 10)) : []
          );

          const frequencyMap = allNumbers.reduce((acc, num) => {
            acc[num] = (acc[num] || 0) + 1;
            return acc;
          }, {});

          const filteredData = Object.entries(frequencyMap)
            .filter(([_, count]) => count >= 2)
            .sort((a, b) => b[1] - a[1])
            .map(([number, count]) => ({
              number: number,
              frequency: `${count} lần`,
            }));

          setData(filteredData);
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


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>NHIỀU NHẤT</Text>
      </View>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFA500" />
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : data.length === 0 ? (
        <Text style={styles.noDataText}>No frequent numbers found.</Text>
      ) : (
        data.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.number}>{item.number}</Text>
            <Text style={styles.frequency}>{item.frequency}</Text>
          </View>
        ))
      )}
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default MostFrequentTable;