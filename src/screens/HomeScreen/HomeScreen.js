import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.nothing}>
                Nothing here!
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    nothing: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default HomeScreen