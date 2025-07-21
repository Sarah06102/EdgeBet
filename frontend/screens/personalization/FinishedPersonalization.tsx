import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useFonts } from 'expo-font';
import GlowBackground from '../../components/GlowBackground';
import EdgeBetIcon from '../../assets/edgebet_icon_white.png';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Main: undefined;
  FinishedPersonalization: { firstName: string; phoneNumber: string };
};

const FinishedPersonalization = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'FinishedPersonalization'>>();
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
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={false} barStyle="light-content" backgroundColor="black"/>
      <GlowBackground />
      <Image source={EdgeBetIcon} style={styles.logo} />
      <Text style={styles.title}>Welcome, {firstName}</Text>
      <Text style={styles.text}>We’re finished personalizing your experience</Text>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.button}><Text style={styles.buttonText}>Next</Text></TouchableOpacity>   
      </View>
    </View>
  );
};

export default FinishedPersonalization

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'SFProDisplayBold',
    color: 'white',
    fontSize: 36,
    textAlign: 'center',
    top: 380,
  },
  logo: {
    width: 184,
    height: 154,
    resizeMode: 'contain',
    top: 350,
    alignSelf: 'center',
  },
  text: {
    fontFamily: 'WorkSansRegular',
    color: 'rgba(255, 255, 255, 0.66)',
    textAlign: 'center',
    top: 400,
  },
  button: {
    backgroundColor: '#8001FF',
    paddingVertical: 16,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonWrapper: {
    top: 525,
  },
});