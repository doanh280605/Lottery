import React, {useLayoutEffect} from "react";
import {View, Text, StyleSheet} from 'react-native';
import { useNavigation } from "@react-navigation/native";

const History = () => {
    const navigation = useNavigation();
    
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Lịch sử dự đoán',
            headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 18
            },
        });
    }, [navigation]);
    return (
        <View>
            <Text>Nothing here</Text>
        </View>
    )
}

const styles = StyleSheet.create({

})

export default History