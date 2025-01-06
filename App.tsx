import React from "react";
import { StyleSheet, View, StatusBar } from 'react-native'
import SplashScreen from "./src/screens/SplashScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import Navigation from "./src/screens/navigation/navigation";

export default function App() {
  return (
    <SafeAreaView style={styles.root} edges={['bottom', 'left', 'right']}>
      <Navigation/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FBFC',
  }
})