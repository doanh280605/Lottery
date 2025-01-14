import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MegaData from '../../components/MegaData';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const Data = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Thống kê',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
    });
  }, [navigation]);


  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#fff',
        inactiveTintColor: '#888',
        style: { backgroundColor: '#3CB371' },
        indicatorStyle: { backgroundColor: '#FFD700' },
      }}
    >
      <Tab.Screen name="Mega" component={MegaData} />
      {/* <Tab.Screen name="Power" component={Power} /> */}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Data;