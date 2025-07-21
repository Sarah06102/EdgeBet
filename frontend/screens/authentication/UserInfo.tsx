import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import EdgeBetIcon from '../../assets/edgebet_icon_white.png';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../components/Router';
import { RouteProp, useRoute } from '@react-navigation/native';

type UserInfoRouteProp = RouteProp<RootStackParamList, 'UserInfo'>;

const UserInfo = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const route = useRoute<UserInfoRouteProp>();
    const phoneNumber = route.params.phoneNumber;

    if (!phoneNumber) {
        return <Text style={{ color: 'white', marginTop: 100 }}>No phone number provided</Text>;
    }


    const [fontsLoaded] = useFonts({
        'SFProDisplayRegular': require('../../assets/fonts/SFProDisplayRegular.otf'),
        'SFProDisplayBold': require('../../assets/fonts/SFProDisplayBold.otf'),
    });
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleSubmit = async () => {
        try {
          await fetch('http://localhost:4000/api/users/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phoneNumber,
                    firstName,
                    lastName,
                    email,
                }),
            });
            navigation.navigate('Questions', { phoneNumber, firstName, });
        } catch (err) {
            console.error('Failed to save user info:', err);
        }
    };
      

    if (!fontsLoaded) return null;

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Image source={EdgeBetIcon} style={styles.logo} />
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Lastly, tell us more about yourself</Text>
                    <Text style={styles.text}>Please enter your legal name. This information will be used to verify your account.</Text>

                    <Text style={styles.label}>First name</Text>
                    <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholderTextColor="#888"/>

                    <Text style={styles.label}>Last name</Text>
                    <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholderTextColor="#888"/>

                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#888"/>
                </View>

                <View style={styles.buttonWrapper}>
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Start Personalizing EdgeBet</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default UserInfo;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 80,
        paddingBottom: 40,
    },
    contentContainer: {
        top: 60,
    },
    title: {
        fontFamily: 'SFProDisplayBold',
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    text: {
        fontFamily: 'SFProDisplayRegular',
        color: 'white',
        fontSize: 15,
        marginBottom: 25,
    },
    label: {
        color: 'white',
        fontSize: 14,
        marginBottom: 15,
    },
    input: {
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: 'white',
        marginBottom: 24,
        width: 350,
        height: 56,
    },
    button: {
        backgroundColor: '#8001FF',
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 'auto',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    logo: {
        width: 53,
        height: 44,
        position: 'absolute',
        resizeMode: 'contain',
        top: 59,
        left: 23,
    },
    buttonWrapper: {
        top: 210,
    },
});
