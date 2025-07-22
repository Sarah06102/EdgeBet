import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, Animated, Easing, StatusBar, Alert } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import EdgeBetIcon from '../../assets/edgebet_icon_white.png';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
import CountryPicker, { Country } from 'react-native-country-picker-modal';
import { AsYouType } from 'libphonenumber-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RootStackParamList = {
  Onboarding: undefined;
  NumVerification: undefined;
  UserInfo: { phoneNumber: string };
  Questions: { phoneNumber: string };
  SignIn: undefined;
};

const NumberVerification = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('CA');
  const [callingCode, setCallingCode] = useState('+1');
  const [countryFlag, setCountryFlag] = useState('🇨🇦');
  const [rawPhone, setRawPhone] = useState('');
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [step, setStep] = useState<'enterNumber' | 'verifyCode' | 'verified'>('enterNumber');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const codeInputRef = useRef<TextInput>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const buttonY = useRef(new Animated.Value(700)).current;
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [fontsLoaded] = useFonts({
    'SFProDisplayRegular': require('../../assets/fonts/SFProDisplayRegular.otf'),
    'SFProDisplayBold': require('../../assets/fonts/SFProDisplayBold.otf'),
  });

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

  const getFlagEmoji = (countryCode: string) => {
    return countryCode
      .toUpperCase()
      .replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
  };

  const handleCodeChange = (text: string) => {
    setCode(text);
  };    

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardWillShow', () => {
      Animated.timing(buttonY, {
        toValue: 424,
        duration: 250,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }).start();
    });
  
    const hideSub = Keyboard.addListener('keyboardWillHide', () => {
      Animated.timing(buttonY, {
        toValue: 700,
        duration: 250,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }).start();
    });
  
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []); 
  
  const handleSendCode = async () => {
    const fullPhone = callingCode + rawPhone;
    try {
      const response = await fetch('http://192.168.1.71:4000/api/users/send-code-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: fullPhone }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setVerificationId(data.verificationId);
        setStep('verifyCode');
      } else {
        Alert.alert('Error', data.message || 'Failed to send code');
      }
    } catch (err) {
      console.error('Send code error:', err);
      Alert.alert('Network error', 'Could not reach the server');
    }
  };

  const handleVerifyCode = async () => {
    const fullPhone = callingCode + rawPhone;
    try {
      const response = await fetch('http://192.168.1.71:4000/api/users/verify-code-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: fullPhone, code }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Verification success:', data);
        await AsyncStorage.setItem('authToken', data.token);
        setStep('verified');
      } else {
        Alert.alert('Verification failed', data.message);
      }
    } catch (err) {
      console.error('Verification failed:', err);
      Alert.alert('Verification Error', 'Something went wrong.');
    }
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);  

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    const fullPhone = callingCode + rawPhone;
    try {
      const response = await fetch('http://192.168.1.71:4000/api/users/send-code-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: fullPhone }),
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert('Code sent', 'A new code was sent to your phone');
        setResendCooldown(30); // 30 seconds cooldown
      } else {
        Alert.alert('Failed to send code', data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error('Resend error:', err);
      Alert.alert('Network error', 'Could not reach the server');
    }
  };

  if (!fontsLoaded) return null;     
  
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            {step !== 'verified' && (
              <Image source={EdgeBetIcon} style={styles.logo} />
            )}

            {step === 'enterNumber' ? (
              <>
                <StatusBar hidden={true} />
                <View style={styles.contentContainer}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>Verify your phone number with code</Text>
                    <Text style={styles.text}>We’ll send you a code. It helps keep your account secure</Text>
                  </View>
        
                  <View style={styles.numberContainer}>
                    <Text style={styles.label}>Your Phone number</Text>
                    <View style={styles.inputRow}>
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
                  </View>
        
                  <View style={styles.bottomTextWrapper}>
                    <Text style={styles.bottomText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                      <Text style={styles.signInText}> Sign in</Text>
                    </TouchableOpacity>
                  </View>
                </View>
        
                <Animated.View style={[styles.buttonWrapper, { top: buttonY }]}>
                  <TouchableOpacity onPress={() => { if (!rawPhone || rawPhone.length < 8) { Alert.alert('Error', 'Please enter a valid phone number'); return; } handleSendCode();}} style={styles.button}>
                    <Text style={styles.buttonText}>Next</Text>
                  </TouchableOpacity>
                </Animated.View>
              </>
            ) : step === 'verifyCode' ? (
              <>
                <StatusBar hidden={true} />
                <View style={styles.contentContainer}>
                  <Text style={styles.title}>Verify Your Number</Text>

                  <View style={styles.subtitleRow}>
                    <Text style={styles.text}>We sent a code to {callingCode} {phoneNumber}</Text>
                    <TouchableOpacity onPress={() => setStep('enterNumber')}>
                      <Text style={styles.editButton}>Edit</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity onPress={() => codeInputRef.current?.focus()} activeOpacity={1}>
                    <View style={styles.codeInputContainer}>
                      <TextInput ref={codeInputRef} style={styles.hiddenInput} value={code} onChangeText={handleCodeChange} keyboardType="number-pad" maxLength={6} autoFocus />
                      {[...Array(6)].map((_, index) => (
                        <View key={index} style={[styles.codeBox, code.length > index && styles.filledBox]}>
                          <Text style={styles.codeDigit}>{code[index] || ''}</Text>
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>
                </View>
                <Animated.View style={[styles.buttonGroup, { top: buttonY }]}>
                  <TouchableOpacity onPress={() => { if (code.length !== 6) { Alert.alert('Error', 'Enter the 6-digit code.'); return; } handleVerifyCode(); }} style={styles.continueButton}>
                    <Text style={styles.buttonText}>Continue</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleResendCode} style={styles.resendButton}>
                    <Text style={styles.resendText}>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}</Text>
                  </TouchableOpacity>
                </Animated.View>
              </>
            ) : step === 'verified' ? (
              <>
                <StatusBar hidden={false} translucent={false} barStyle="light-content" backgroundColor="black"/>
                <View style={styles.contentContainerVerified}>
                  <View style={{ alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                    <Image source={require('../../assets/check.png')} style={{ width: 200, height: 200, marginBottom: 32 }} />
                    <Text style={[styles.title, { textAlign: 'center', marginBottom: 12 }]}>Verification complete</Text>
                    <Text style={[styles.text, { textAlign: 'center', marginBottom: 48 }]}>Your Phone number has been verified.</Text>
                  </View>

                  <View style={{ paddingBottom: 65 }}>
                    <TouchableOpacity onPress={() => {const fullPhone = callingCode + rawPhone ; navigation.navigate('UserInfo', { phoneNumber: fullPhone });}} style={[styles.resendButton, { width: '100%' }]}>
                      <Text style={styles.resendText}>Continue</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </> 
            ) : null}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default NumberVerification

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center',
  },
  contentContainer: {
    top: 118,
    paddingHorizontal: 23,
    width: '100%',
    gap: 32,
  },
  titleContainer: {
    gap: 12,
  },
  title: {
    fontFamily: 'SFProDisplayBold',
    color: 'white',
    fontSize: 28,
    textAlign: 'left',
  },
  text: {
    fontFamily: 'SFProDisplayRegular',
    color: 'white',
    fontSize: 13,
  },
  numberContainer: {
    gap: 8,
  },
  label: {
    fontFamily: 'SFProDisplayRegular',
    color: 'white',
    fontSize: 13,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  countryBox: {
    paddingRight: 13,
    paddingLeft: 10, 
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'SFProDisplayRegular',
  },
  phoneInput: {
    width: 260,
    height: 56,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 16,
    fontSize: 16,
    color: 'white',
    fontFamily: 'SFProDisplayRegular',
  },
  numberInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  countryCode: {
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: 'white',
    marginRight: 8,
  },
  numberInput: {
    color: 'white',
    flex: 1,
    fontSize: 16,
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
  bottomText: {
    fontFamily: 'SFProDisplayBold',
    color: 'white',
    fontSize: 16,
  },
  signInText: {
    fontFamily: 'SFProDisplayBold',
    color: '#8001FF',
    fontSize: 16,
  },
  bottomTextWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logo: {
    width: 53,
    height: 44,
    position: 'absolute',
    resizeMode: 'contain',
    top: 25,
    left: 10,
  },
  subtitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
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
  codeDigit: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'SFProDisplayBold',
    textAlign: 'center',
  },
  continueButton: {
    width: 329,
    height: 48,
    backgroundColor: '#8001FF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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
  editButton: {
    color: '#8001FF',
    fontFamily: 'SFProDisplayBold',
    fontSize: 14,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
  },
  filledBox: {
    borderColor: '#8001FF',
  },
  buttonWrapper: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
  buttonWrapperDefault: {
    top: 700,
  },
  buttonWrapperKeyboard: {
    top: 444,
  },
  contentContainerVerified: {
    flex: 1,
    paddingHorizontal: 23,
    width: '100%',
    justifyContent: 'space-between',
    paddingTop: 100,
  },
  buttonGroup: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }
});