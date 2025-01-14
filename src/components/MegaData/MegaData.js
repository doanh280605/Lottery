import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

import MostFrequentTable from './MostFrequent/MostFrequentTable';
import LeastFrequentTable from './LeastFrequent/LeastFrequentTable';
import ConsecutiveTable from './ConsecutiveTable';
import NotAppearedTable from './NotAppearedTable';

const MegaData = () => {
    const chartData = [
        { name: 'Tổng dự đoán', population: 16, color: '#3CB371' },
        { name: 'Tổng số trúng', population: 12, color: '#FFD700' },
        { name: 'Tổng số trật', population: 68, color: '#DC143C' },
    ];
    const renderLegendItem = ({ name, population, color }) => (
        <View style={styles.legendItem} key={name}>
            <View style={styles.legendDot(color)} />
            <Text style={styles.legendText}>{name}</Text>
            <Text style={styles.populationText(color)}>{population}</Text>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Pie Chart Section */}
            <View style={styles.contentContainer}>
                <View style={styles.chartContainer}>
                    <PieChart
                        data={chartData}
                        width={Dimensions.get('window').width - 40}
                        height={140}
                        chartConfig={{
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor={'population'}
                        backgroundColor={'transparent'}
                        absolute
                        hasLegend={false}
                    />
                </View>
                <View style={styles.legendContainer}>
                    {chartData.map(renderLegendItem)}
                </View>
            </View>

            {/* Tables Section */}
            <View style={styles.tablesContainer}>
                <View style={styles.tableRow}>
                    <View style={styles.tableColumn}>
                        <MostFrequentTable />
                    </View>
                    <View style={styles.tableColumn}>
                        <LeastFrequentTable />
                    </View>
                </View>
                <View style={styles.tableRow}>
                    <View style={styles.tableColumn}>
                        <NotAppearedTable />
                    </View>
                    <View style={styles.tableColumn}>
                        <ConsecutiveTable />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    chartContainer: {
        flex: 1,
        right: '10%',
    },
    legendContainer: {
        flex: 1,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    legendDot: (color) => ({
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: color,
        marginRight: 10,
    }),
    legendText: {
        flex: 1,
        fontSize: 14,
        color: 'black',
    },
    populationText: (color) => ({
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 10,
        color: color,
    }),
    // New styles for tables section
    tablesContainer: {
        marginTop: 10,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    tableColumn: {
        flex: 1,
        marginHorizontal: 5,
    },
});

export default MegaData