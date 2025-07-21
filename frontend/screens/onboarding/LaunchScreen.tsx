import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import EdgeBetIcon from '../../assets/edgebet_icon_white.png';
import GlowBackground from '../../components/GlowBackground';

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    'BunkenTech': require('../../assets/fonts/BunkenTechSansPro-ExBdIt.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <GlowBackground />
      <SafeAreaView style={styles.content}>
        <Image source={EdgeBetIcon} style={styles.logo} />
        <Text style={styles.text}>EDGEBET</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  text: {
    fontFamily: 'BunkenTech',
    fontSize: 48,
    color: 'white',
    textShadowColor: 'rgba(128, 1, 255, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});
