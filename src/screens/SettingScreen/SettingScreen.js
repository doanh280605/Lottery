import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Switch } from 'react-native-switch';

const SettingScreen = () => {
    const navigation = useNavigation();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [language, setLanguage] = useState('VN')
    const [isVietnamese, setIsVietnamese] = useState(true);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Cài đặt',
            headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 18
            },
        });
    }, [navigation]);

    const toggleTheme = () => {
        setIsDarkMode(previousState => !previousState);
    }
    const toggleLanguage = () => {
        setIsVietnamese(prevState => !prevState);
        setLanguage(prevState => (prevState === 'VN' ? 'EN' : 'VN'));
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('data')}>
                <Image source={require('../../../assets/Data.png')} style={styles.icon} />
                <Text style={styles.text}>Thống kê cơ bản</Text>
                <Text style={styles.arrow}>{'>'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.item, { marginTop: 1 }]} onPress={() => navigation.navigate('history')}>
                <Image source={require('../../../assets/Setting.png')} style={styles.icon} />
                <Text style={styles.text}>Lịch sử dự đoán</Text>
                <Text style={styles.arrow}>{'>'}</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.item}>
                <Image source={require('../../../assets/Eye.png')} style={styles.icon} />
                <Text style={styles.text}>Giao Diện</Text>
                <Switch
                    value={isDarkMode}
                    onValueChange={toggleTheme}
                    disabled={false}
                    circleSize={30}
                    barHeight={32}
                    backgroundActive={'#D9112A'}
                    backgroundInactive={'#767577'}
                    circleActiveColor={'#ffffff'}
                    circleInActiveColor={'#f4f3f4'}
                    changeValueImmediately={true}
                    innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                    switchWidthMultiplier={2}
                    switchBorderRadius={16}
                    switchLeftPx={15} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                    switchRightPx={19}
                    renderActiveText={true}
                    renderInActiveText={true}
                />
            </View>

            <View style={[styles.item, { marginTop: 1 }]}>
                <Image source={require('../../../assets/Language.png')} style={styles.icon} />
                <Text style={styles.text}>Ngôn Ngữ</Text>

                <Switch
                    value={isVietnamese}
                    onValueChange={toggleLanguage}
                    disabled={false}
                    activeText={'VN'}
                    inActiveText={'EN'}
                    circleSize={30}
                    barHeight={32}
                    backgroundActive={'#D9112A'}
                    backgroundInactive={'#767577'}
                    circleActiveColor={'#ffffff'}
                    circleInActiveColor={'#f4f3f4'}
                    changeValueImmediately={true}
                    innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                    switchWidthMultiplier={2}
                    switchBorderRadius={16}
                    switchLeftPx={15} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                    switchRightPx={8}
                    renderActiveText={true}
                    renderInActiveText={true}
                    activeTextStyle={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: '#ffffff'
                    }}
                    inactiveTextStyle={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: '#ffffff'
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: 'white',
        paddingHorizontal: 15,
        bottom: '34%'
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 15
    },
    text: {
        flex: 1,
        fontsize: 16
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 10
    },
    languageSwitchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    languageLabel: {
        fontSize: 14,
        color: '#B0B0B0',
        marginHorizontal: 5,
        fontWeight: 'bold',
    },

    activeLanguageLabel: {
        color: '#D9112A',
    },
    activeButton: {
        backgroundColor: '#D9112A',
    },
    inactiveButton: {
        backgroundColor: '#B0B0B0',
    },
    languageText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default SettingScreen;