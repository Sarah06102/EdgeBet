import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useFonts } from 'expo-font';
import EdgeBetIcon from '../../assets/edgebet_icon_purple_text.png';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
    TrialPage: { phoneNumber: string; firstName: string };
    FinishedPersonalization: { phoneNumber: string; firstName: string };
};

const TrialPage = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'TrialPage'>>();
    const { phoneNumber, firstName } = route.params;

    const [fontsLoaded] = useFonts({
        'SFProDisplayRegular': require('../../assets/fonts/SFProDisplayRegular.otf'),
        'SFProDisplayBold': require('../../assets/fonts/SFProDisplayBold.otf'),
        'RobotoBold': require('../../assets/fonts/Roboto-Bold.ttf'),
        'WorkSansRegular': require('../../assets/fonts/WorkSans-Regular.ttf'),
        'WorkSansSemiBold': require('../../assets/fonts/WorkSans-SemiBold.ttf'),
        'RobotoRegular': require('../../assets/fonts/Roboto-Regular.ttf'),
        'RobotoSemiBold': require('../../assets/fonts/Roboto-SemiBold.ttf'),
        'RobotoLight': require('../../assets/fonts/Roboto-Light.ttf'),
        'InterRegular': require('../../assets/fonts/Inter_18pt-Regular.ttf'),
        'BunkenTech': require('../../assets/fonts/BunkenTechSansPro-ExBdIt.ttf'),
    });

    if (!fontsLoaded) return null;
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Image source={EdgeBetIcon} style={styles.logo} />
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Be the first to lock in line changes ⚡️</Text>
                </View>

                <View style={styles.textGroup}>
                    <Text style={styles.text}>🔥 Lines refreshed every 60 seconds</Text>
                    <Text style={styles.text}>✨ 5+ Sports & Special Tournaments</Text>
                    <Text style={styles.text}>🥇 Direct Link to Your Sportsbook</Text>
                </View>

                <View style={styles.trialGroup}>
                    <Text style={styles.trialTitle}>Pick the Right Bet.{'\n'}Everytime.</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('FinishedPersonalization', { phoneNumber, firstName })}><Text style={styles.trialText}>Unlock Free Trial 🔓</Text></TouchableOpacity>
                    <Text style={styles.trialSubText}>risk-free trial then $9.99/month</Text>
                </View>

                <Text style={styles.endText}>Email  •  Earn •  Restore</Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default TrialPage

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flexGrow: 1,
        paddingHorizontal: 24,
    },
    title: {
        fontFamily: 'WorkSansSemiBold',
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 38,
        marginTop: 24,
        top: 160,
        paddingHorizontal: 52
    },
    logo: {
        width: 95,
        height: 103,
        position: 'absolute',
        resizeMode: 'contain',
        top: 92,
        alignSelf: 'center',
    },
    contentContainer: {
        top: 40,
    },
    text: {
        fontFamily: 'RobotoRegular',
        color: '#E0E0E0',
        fontSize: 20,
        textAlign: 'center',
        top: 240,
    },
    textGroup: {
        gap: 20,
        paddingHorizontal: 20,
    },
    trialTitle: {
        fontFamily: 'RobotoBold',
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        lineHeight: 24,
    },
    trialText: {
        fontFamily: 'RobotoSemiBold',
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        fontWeight: 600,
        borderWidth: 3,
        borderColor: '#8001FF',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop: 20,
    },
    trialGroup: {
        top: 330,
        borderWidth: 4,
        borderColor: 'white',
        borderRadius: 25,
        paddingVertical: 32,
        paddingHorizontal: 20,
    },
    trialSubText: {
        color: 'white',
        fontFamily: 'RobotoLight',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginTop: 20,
    },
    endText: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontFamily: 'InterRegular',
        top: 375,
        textAlign: 'center'
    },
});