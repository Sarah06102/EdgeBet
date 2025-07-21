import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Slider from './components/Slider';
import Router from './components/Router';


export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  return (
    <SafeAreaProvider>
      <Router />
    </SafeAreaProvider>
  );
}
