import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableWithoutFeedback, Pressable, Modal, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import EdgeBetIcon from '../assets/edgebet_icon_white.png';
import { useFonts } from 'expo-font';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

type NavbarProps = {
    dropdownVisible: boolean;
    setDropdownVisible: React.Dispatch<React.SetStateAction<boolean>>;
    selected: { name: string; icon: any };
    setSelected: React.Dispatch<React.SetStateAction<{ name: string; icon: any }>>;
    onOpenSettings: () => void;
    selectedSport: string;
    setSelectedSport: React.Dispatch<React.SetStateAction<string>>;
};

const sportsOptions = [ 'Baseball ⚾️' , 'Basketball 🏀', 'Hockey 🏒','Soccer ⚽️','Specials 🎁'];

const Navbar = ({ dropdownVisible, setDropdownVisible, selected, setSelected, onOpenSettings, selectedSport, setSelectedSport }: NavbarProps) => {
    const [fontsLoaded] = useFonts({
        'SFProDisplayRegular': require('../assets/fonts/SFProDisplayRegular.otf'),
        'SFProDisplayBold': require('../assets/fonts/SFProDisplayBold.otf'),
        'RobotoBold': require('../assets/fonts/Roboto-Bold.ttf'),
        'WorkSansRegular': require('../assets/fonts/WorkSans-Regular.ttf'),
        'WorkSansSemiBold': require('../assets/fonts/WorkSans-SemiBold.ttf'),
        'RobotoRegular': require('../assets/fonts/Roboto-Regular.ttf'),
        'RobotoSemiBold': require('../assets/fonts/Roboto-SemiBold.ttf'),
        'RobotoLight': require('../assets/fonts/Roboto-Light.ttf'),
        'InterRegular': require('../assets/fonts/Inter_18pt-Regular.ttf'),
        'BunkenTech': require('../assets/fonts/BunkenTechSansPro-ExBdIt.ttf'),
        'DMSansBold': require('../assets/fonts/DMSans_24pt-Bold.ttf'),
        'DMSansLight': require('../assets/fonts/DMSans_18pt-Light.ttf'),
    });

    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.topBar}>
                {/* Left - Logo */}
                <View style={styles.sideItem}>
                    <Image source={EdgeBetIcon} style={styles.logo} />
                </View>

                {/* Center - Dropdown */}
                <View style={styles.centerItem}>
                    <TouchableOpacity style={styles.button} onPress={() => setDropdownVisible(!dropdownVisible)}>
                        <Image source={selected.icon} style={styles.selectedIcon} />
                        <AntDesign name="caretdown" size={12} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Right - More Icon */}
                <View style={styles.sideItem}>
                    <TouchableOpacity onPress={onOpenSettings}>
                        <Entypo name="dots-three-vertical" size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.title}>Your Daily Picks</Text>
            <View style={styles.sportsOptionsRow}>
                {sportsOptions.map((sport, index) => (
                    <TouchableOpacity key={index} onPress={() => setSelectedSport(sport)} style={styles.option}>
                        <Text style={styles.optionText}>{sport}</Text>
                        {selectedSport === sport && <View style={styles.underline} />}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default Navbar

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        paddingTop: 60,
        paddingBottom: 20
    },
    title: {
        fontFamily: 'RobotoBold',
        color: 'white',
        fontSize: 24,
        top: 35,
        paddingHorizontal: 16,
    },
    text: {
        fontFamily: 'WorkSansBold',
        color: 'white'
    },
    logo: {
        width: 53,
        height: 44,
        resizeMode: 'contain',
    },
    button: {
        backgroundColor: '#8001FF',
        padding: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        width: 130,
        height: 40, 
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 25,
        paddingHorizontal: 16,
    },
    sideItem: {
        width: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    centerItem: {
        flex: 1,
        alignItems: 'center',
    },
    sportsOptionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 60,
        borderBottomWidth: 2,
        borderBottomColor: '#222',
        paddingBottom: 8,
    },
    option: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative',
    },
    optionText: {
        color: 'white',
        fontFamily: 'WorkSansBold',
        fontSize: 11,
        paddingHorizontal: 12,
    },
    optionSelected: {
        borderBottomWidth: 2,
        borderBottomColor: '#8001FF',
    },
    underline: {
        position: 'absolute',
        bottom: -10,
        height: 2,
        width: '100%',
        backgroundColor: '#8001FF',
        borderRadius: 1,
    },
    selectedIcon: {
        width: 88,
        height: 55,
        resizeMode: 'contain',
    },
});