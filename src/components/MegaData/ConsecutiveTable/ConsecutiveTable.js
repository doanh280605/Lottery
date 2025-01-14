import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const ConsecutiveTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
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
          const sortedData = responseData.sort((a, b) => new Date(a.date) - new Date(b.date));
          const consecutiveCounts = {};

          sortedData.forEach((day, index) => {
            const currentNumbers = new Set(day.resultNumbers);
            if (index > 0) {
              const prevNumbers = new Set(sortedData[index - 1].resultNumbers);
              currentNumbers.forEach(num => {
                if (prevNumbers.has(num)) {
                  consecutiveCounts[num] = (consecutiveCounts[num] || 1) + 1;
                }
              });
            }
          });

          const consecutiveArray = Object.entries(consecutiveCounts)
            .map(([number, frequency]) => ({ number, frequency }))
            .sort((a, b) => b.frequency - a.frequency)
            .map(({ number, frequency }) => ({ number, frequency: `${frequency} ngày` }))
            .slice(0, 10);

          setData(consecutiveArray);
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
        <Text style={styles.headerText}>LIÊN TIẾP</Text>
      </View>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFA500" />
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : data.length === 0 ? (
        <Text style={styles.noDataText}>KHÔNG CÓ SỐ LIÊN TIẾP</Text>
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
  },
  noDataText: {
    textAlign: 'center'
  }
});

export default ConsecutiveTable;