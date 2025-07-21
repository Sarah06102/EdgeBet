import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Onboarding_2_icon from '../../assets/Onboarding_2_icon.png'
import { useFonts } from 'expo-font';

const Onboarding_2 = ({ goToNextSlide }: { goToNextSlide: () => void }) => {
    const [fontsLoaded] = useFonts({
        'SFProDisplayRegular': require('../../assets/fonts/SFProDisplayRegular.otf'),
        'SFProDisplayBold': require('../../assets/fonts/SFProDisplayBold.otf'),
    });

    if (!fontsLoaded) return null;
    
    return (
        <View style={styles.container}>
            <View style={styles.imageWrapper}>
                <Image source={Onboarding_2_icon} style={styles.image} />
            </View>
            <Text style={styles.title}>Get Push Notifications Delivered</Text>
            <Text style={styles.text}>Enjoy best in the market exchange rates</Text>
            <TouchableOpacity onPress={goToNextSlide} style={styles.button}><Text style={styles.buttonText}>Next</Text></TouchableOpacity>
        </View>
    );
};

export default Onboarding_2

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 24,
    },
    imageWrapper: {
        marginTop: 167,
        width: 288,
        height: 288,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 288,
        height: 288,
        resizeMode: 'contain',
    },
    title: {
        fontFamily:'SFProDisplayBold',
        fontWeight: '700',
        color: '#8001FF',
        fontSize: 18, 
        lineHeight: 22,
        letterSpacing: 0,
        textAlign: 'center',
        marginTop: 24,
    },
    text: {
        color: 'white',
        fontFamily:'SFProDisplayBold',
        fontSize: 24,
        textAlign: 'center',
        lineHeight: 28.8,
        marginTop: 8,
    },
    button: {
        position: 'absolute',
        top: 700,
        width: 329,
        height: 48,
        backgroundColor: '#8001FF',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 40
    },
    buttonText: {
        fontFamily: 'SFProDisplayBold',
        fontSize: 16,
        color: 'white',
        lineHeight: 19,
        textAlign: 'center',
    },
});