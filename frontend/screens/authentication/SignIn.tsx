import { Alert, Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState } from 'react';
import { useFonts } from 'expo-font';
import EdgeBetIcon from '../../assets/edgebet_icon_white.png';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
import { AsYouType } from 'libphonenumber-js';
import CountryPicker, { Country } from 'react-native-country-picker-modal'
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RootStackParamList = {
    NumVerification: undefined;
    Main: undefined;
};

const SignIn = () => {
    const [step, setStep] = useState<'signIn' | 'verify'>('signIn');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [rawPhone, setRawPhone] = useState('');
    const [callingCode, setCallingCode] = useState('+1');
    const [countryFlag, setCountryFlag] = useState('🇨🇦');
    const [code, setCode] = useState('');
    const codeInputRef = useRef<TextInput>(null);
    const [countryCode, setCountryCode] = useState('CA');
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');

    const [fontsLoaded] = useFonts({
        'SFProDisplayRegular': require('../../assets/fonts/SFProDisplayRegular.otf'),
        'SFProDisplayBold': require('../../assets/fonts/SFProDisplayBold.otf'),
    });

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleSignIn = async () => {
        const fullPhone = `${callingCode}${rawPhone}`;
        try {
          const res = await fetch('http://192.168.1.71:4000/api/users/send-code-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: fullPhone }),
          });
      
          const data = await res.json();
      
          if (res.ok) {
            Alert.alert('Code Sent', 'Please check your phone');
            setStep('verify');
          } else {
            Alert.alert('Error', data.message || 'Failed to send code');
          }
        } catch (err: any) {
          Alert.alert('Error', err.message || 'Something went wrong');
        }
    };
      
    const handleVerify = async () => {
        const fullPhone = `${callingCode}${rawPhone}`;
      
        if (code.length !== 6) {
          Alert.alert('Error', 'Enter the 6-digit code.');
          return;
        }
        try {
          const res = await fetch('http://192.168.1.71:4000/api/users/verify-code-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: fullPhone, code }),
          });
      
          const data = await res.json();
      
          if (res.ok) {
            Alert.alert('Success', 'Phone verified!');
            console.log('JWT Token:', data.token); 
            await AsyncStorage.setItem('token', data.token);
            navigation.replace('Main');
          } else {
            Alert.alert('Error', data.message || 'Verification failed.');
          }
        } catch (err: any) {
          Alert.alert('Error', err.message || 'Something went wrong');
        }
    };
      

    const handleResendCode = async () => {
        const fullPhone = `${callingCode}${rawPhone}`;
      
        try {
            const res = await fetch('http://192.168.1.71:4000/api/users/send-code-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: fullPhone }),
            });
      
            const data = await res.json();
      
            if (res.ok) {
                Alert.alert('Code Resent', 'Check your phone!');
            } else {
                Alert.alert('Error', data.message || 'Failed to resend');
            }
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Network issue');
        }
    };
      
      
    const handleCodeChange = (text: string) => {
        setCode(text);
    };

    const getFlagEmoji = (countryCode: string) => {
        return countryCode
            .toUpperCase()
            .replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
    };
    
   const handlePhoneNumberChange = (text: string) => {
        const cleaned = text.replace(/\D/g, '');

        if (cleaned === '') {
            setRawPhone('');
            setPhoneNumber('');
            return;
        }

        const isDeleting = cleaned.length < rawPhone.length;
        setRawPhone(cleaned);

        const formatter = new AsYouType(countryCode as CountryCode);
        const formatted = formatter.input(cleaned);

        setPhoneNumber(isDeleting ? cleaned : formatted);

        const parsed = parsePhoneNumberFromString(cleaned, countryCode as CountryCode);
        if (parsed?.countryCallingCode && parsed?.country) {
            setCallingCode('+' + parsed.countryCallingCode);
            setCountryFlag(getFlagEmoji(parsed.country));
            setCountryCode(parsed.country);
        }
    };

      
    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Image source={EdgeBetIcon} style={styles.logo} />
            <Text style={styles.title}>{step === 'signIn' ? 'Sign In' : 'Enter Code'}</Text>

            {step === 'signIn' ? (
                <>
                    <View style={styles.phoneInputWrapper}>
                    <CountryPicker withFilter withFlag withCallingCode withEmoji countryCode={countryCode as Country['cca2']} visible={isPickerVisible} withCallingCodeButton onClose={() => setIsPickerVisible(false)}
                        onSelect={(country: Country) => {
                          setCountryCode(country.cca2);
                          setCallingCode('+' + country.callingCode[0]);
                          setCountryFlag(getFlagEmoji(country.cca2));
                          setIsPickerVisible(false);
                        }}
                        renderFlagButton={() => (
                          <TouchableOpacity style={styles.countryBox} onPress={() => setIsPickerVisible(true)}>
                            <Text style={styles.countryText}>{countryFlag} {callingCode}</Text>
                          </TouchableOpacity>
                        )}
                      />
                      <TextInput style={styles.phoneInput} placeholder="Phone number" placeholderTextColor="#888" value={phoneNumber} onChangeText={handlePhoneNumberChange} keyboardType="number-pad"/>
                    </View>

                    <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
                        <Text style={styles.signInButtonText}>Continue</Text>
                    </TouchableOpacity>
                    <View style={styles.bottomTextWrapper}>
                        <Text style={styles.bottomText}>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('NumVerification')}>
                            <Text style={styles.registerText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <>
                    <View style={styles.subtitleRow}>
                        <Text style={styles.text}>We sent a code to {callingCode} {phoneNumber}</Text>
                        <TouchableOpacity onPress={() => setStep('signIn')}>
                            <Text style={styles.editButton}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => codeInputRef.current?.focus()} activeOpacity={1}>
                        <View style={styles.codeInputContainer}>
                            <TextInput ref={codeInputRef} style={styles.hiddenInput} value={code} onChangeText={handleCodeChange} keyboardType="number-pad" maxLength={6} autoFocus/>
                            {[...Array(6)].map((_, index) => (
                                <View key={index} style={[ styles.codeBox, code.length > index && styles.filledBox, index !== 5 && { marginRight: 10 },]}>
                                    <Text style={styles.codeDigit}>{code[index] || ''}</Text>
                                </View>
                            ))}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleVerify}>
                        <Text style={styles.buttonText}>Verify</Text>
                    </TouchableOpacity>  

                    <TouchableOpacity onPress={handleResendCode} style={styles.resendButton}>
                        <Text style={styles.resendText}>Resend Code</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

export default SignIn;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        flex: 1,
        alignItems: 'center',
        paddingTop: 150,
    },
    logo: {
        position: 'absolute',
        top: 35,
        left: 20,
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    title: {
        color: '#FFF',
        fontSize: 28,
        fontFamily: 'SFProDisplayBold',
        marginBottom: 40,
    },
    text: {
        fontFamily: 'SFProDisplayRegular',
        color: 'white',
        fontSize: 13,
    },
    phoneInput: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 12,
        fontSize: 16,
        color: 'white',
        fontFamily: 'SFProDisplayRegular',
    },
    phoneInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 14,
        width: 280,
        height: 55,
        marginBottom: 20,
        paddingHorizontal: 14,
        overflow: 'hidden',
    },
    countryCodeText: {
        color: 'white',
        fontSize: 17,
        fontFamily: 'SFProDisplayRegular',
        marginRight: 6,
    },
    signInButton: {
        width: 280,
        height: 50,
        backgroundColor: '#8001FF',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    signInButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'SFProDisplayBold',
    },
    bottomText: {
        fontFamily: 'SFProDisplayBold',
        color: 'white',
        fontSize: 16,
    },
    bottomTextWrapper: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 5
    },
    registerText: {
        fontFamily: 'SFProDisplayBold',
        color: '#8001FF',
        fontSize: 16,
    },
    subtitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 35,
        gap: 10
    },
    editButton: {
        color: '#8001FF',
        fontFamily: 'SFProDisplayBold',
        fontSize: 14,
    },
    codeDigit: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'SFProDisplayBold',
        textAlign: 'center',
    },
    button: {
        width: 329,
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
    resendButton: {
        backgroundColor: 'white',
        width: 329,
        height: 48,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 12
    },
    resendText: {
        color: 'black',
        fontFamily: 'SFProDisplayBold',
        fontSize: 16,
    },
    codeInputContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 40,
    },
    hiddenInput: {
        position: 'absolute',
        opacity: 0,
        width: '100%',
        height: '100%',
    },
    codeBox: {
        width: 48,
        height: 56,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filledBox: {
        borderColor: '#8001FF',
    },
    countryBox: {
        paddingRight: 13,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        height: '100%',
        borderRightWidth: 1,
        borderRightColor: 'white',
    },
    countryText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'SFProDisplayRegular',
    },
});
