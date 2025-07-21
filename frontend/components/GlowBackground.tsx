import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

const GlowBackground = () => {
  return (
    <View style={StyleSheet.absoluteFill}>
       <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="radial" cx="50%" cy="50%" r="75%">
            <Stop offset="0%" stopColor="#8001FF" stopOpacity="1" />
            <Stop offset="30%" stopColor="#8001FF" stopOpacity="0.5" />
            <Stop offset="60%" stopColor="#8001FF" stopOpacity="0.06" />
            <Stop offset="75%" stopColor="#8001FF" stopOpacity="0.06" />
            <Stop offset="90%" stopColor="#8001FF" stopOpacity="0.01" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#radial)" />
      </Svg>
    </View>
  );
}

export default GlowBackground