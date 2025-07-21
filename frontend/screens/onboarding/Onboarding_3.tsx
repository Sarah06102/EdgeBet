import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Onboarding_3_icon from '../../assets/Onboarding_3_icon.png'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';

export type RootStackParamList = {
    Onboarding: undefined;
    NumVerification: undefined;
    SignIn: undefined;
};

const Onboarding_3 = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [fontsLoaded] = useFonts({
          'SFProDisplayBold': require('../../assets/fonts/SFProDisplayBold.otf'),
    });
    if (!fontsLoaded) return null;
    
    return (
        <View style={styles.container}>
            <View style={styles.imageWrapper}>
                <Image source={Onboarding_3_icon} style={styles.image} />
            </View>
            <Text style={styles.title}>Use Your Favourite Sportsbooks</Text>
            <Text style={styles.text}>Supporting 6 of the Hottest Sportsbooks 🔥</Text>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity onPress={() => navigation.navigate('NumVerification')} style={styles.button}><Text style={styles.buttonText}>Register</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={styles.button}><Text style={styles.buttonText}>Sign in</Text></TouchableOpacity>
            </View>
        </View>
    );
}

export default Onboarding_3;

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
    buttonWrapper: {
        position: 'absolute',
        top: 700,
        alignSelf: 'center',
        gap: 16,
        flexDirection: 'row',
    },
    button: {
        width: 157,
        height: 48,
        backgroundColor: '#8001FF',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 40,
    },
    buttonText: {
        fontFamily: 'SFProDisplayBold',
        fontSize: 16,
        color: 'white',
        lineHeight: 19,
        textAlign: 'center',
    },
});