import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import vietlott from '../../../assets/vietloff.png'
import mega from '../../../assets/mega.png'
import max from '../../../assets/max.png'
import power from '../../../assets/power.png'

const LotteryDisplay = ({ lotteryData, loading, error }) => {
  const renderLatestResult = (result) => (
    <View style={styles.latestTicketContainer}>
      <View style={styles.selector}>
        <Image source={vietlott} style={[styles.icon, {marginTop: 3}]}/>
        <Image source={mega} style={styles.icon}/>
        <Image source={max} style={styles.icon}/>
        <Image source={power} style={[styles.icon, {marginTop: 3}]}/>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoContainer}>
        <Text style={[{fontSize: 20, 
                       textAlign: 'center', 
                       fontWeight: 'bold'}]}
                      >Kết quả sổ xố Vietlott MEGA 6/45 {result.drawDate}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>SỐ TRÚNG THƯỞNG</Text>
      </View>

      <View style={styles.drawInfo}>
        <Text style={styles.drawDetails}>
          Kỳ vé: #{result.ticketTurn} | Ngày quay thưởng {result.drawDate}
        </Text>
      </View>

      <View style={styles.latestNumbersContainer}>
        {result.numbers.map((number, index) => (
          <View key={index} style={styles.latestBall}>
            <Text style={styles.latestBallText}>
              {number.toString().padStart(2, '0')}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.prizeTable}>
        <View style={styles.prizeHeader}>
          <Text style={[styles.prizeHeaderText, { flex: 3, textAlign: 'left' }]}>Giải thưởng</Text>
          <Text style={[styles.prizeHeaderText, { flex: 3, textAlign: 'left', paddingLeft: 15 }]}>Trùng khớp</Text>
          <Text style={[styles.prizeHeaderText, { flex: 4, textAlign: 'right' }]}>Giá trị giải</Text>
        </View>

        <View style={[styles.prizeRow, styles.whiteRow]}>
          <Text style={[styles.prizeType, { flex: 2 }]}>Jackpot</Text>
          <View style={[styles.matchDotsContainer, { flex: 3 }]}>
            <View style={styles.matchDots}>
              {[...Array(6)].map((_, i) => (
                <View key={i} style={[styles.dot, i === 5 ? styles.dotMatched : styles.dotUnmatched]} />
              ))}
            </View>
          </View>
          <Text style={[styles.prizeValue, { flex: 4 }]}>{result.jackpotValue}</Text>
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
          <Text style={[styles.prizeValue, { flex: 4 }]}>10,000,000đ</Text>
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
          <Text style={[styles.prizeValue, { flex: 4 }]}>300,000đ</Text>
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
          <Text style={[styles.prizeValue, { flex: 4 }]}>30,000đ</Text>
        </View>
      </View>
    </View>
  );


  const renderOlderResult = (result) => (
    <View style={styles.olderTicketContainer}>
      <View style={styles.kyve}>
        <Text>Kỳ quay </Text>
        <Text style={styles.ticketTurn}>#{result.ticketTurn}</Text>
        <Text> - {result.drawDate}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.olderNumbersContainer}>
        {result.numbers.map((number, index) => (
          <View key={index} style={styles.olderBall}>
            <Text style={styles.olderBallText}>
              {number.toString().padStart(2, '0')}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
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
    <View
      style={styles.resultsContainer}
    >
      {lotteryData.map((result, index) => (
        <View key={result.ticketTurn || index}>
          {index === 0 ? renderLatestResult(result) : renderOlderResult(result)}
        </View>
      ))}
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
  // Latest result styles
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 35,
    paddingVertical: 10,
    alignContent: 'center'
  },
  latestTicketContainer: {
    backgroundColor: 'white',
    marginVertical: 10,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
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
  infoContainer:{
    padding: 15,
    flex: 1,
    alignItems: 'center'
  },
  drawInfo: {
    padding: 10,
  },
  drawDetails: {
    fontSize: 14,
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
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  more: {
    fontSize: 18,
    color: 'white',
    marginTop: 20,
    textAlign: 'center'
  }
});

export default LotteryDisplay;