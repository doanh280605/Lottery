import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Image, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import rectangle from '../../../assets/LotteryLogo.png';
import HomeScreen from "../HomeScreen";

const SplashScreen = () => {
  const navigation = useNavigation();
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(rotation, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        navigation.replace("home");
      }, 300);
    });
  }, [rotation, navigation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={[styles.container, { backgroundColor: "#F32034" }]}>
      <Animated.View
        style={[
          styles.logoContainer,
          { transform: [{ rotateY: rotate }] },
        ]}
      >
        <Image source={rectangle} style={styles.logo} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: '80%',  // Adjust width if needed
    height: 200,   // Ensure the height fits well
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Make sure the image fits without distortion
  },
});

export default SplashScreen;
