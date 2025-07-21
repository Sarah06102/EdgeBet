import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding_1 from '../screens/onboarding/Onboarding_1';
import Onboarding_2 from '../screens/onboarding/Onboarding_2';
import Onboarding_3 from '../screens/onboarding/Onboarding_3';
import NumberVerification from '../screens/authentication/NumberVerification';
import Slider from './Slider';
import UserInfo from '../screens/authentication/UserInfo';
import Questions from '../screens/personalization/Questions';
import TrialPage from '../screens/personalization/TrialPage';
import FinishedPersonalization from '../screens/personalization/FinishedPersonalization';
import Main from '../screens/dashboard/Main';
import SignIn from '../screens/authentication/SignIn';
import LaunchScreen from '../screens/onboarding/LaunchScreen';

export type RootStackParamList = {
  Onboarding: undefined;
  NumVerification: undefined;
  UserInfo: { phoneNumber: string };
  Questions: { phoneNumber: string; firstName: string };
  TrialPage: { phoneNumber: string; firstName: string };
  FinishedPersonalization: { phoneNumber: string; firstName: string };
  Main: { phoneNumber: string };
  SignIn: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Router() {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" component={Slider} />
          <Stack.Screen name="NumVerification" component={NumberVerification} />
          <Stack.Screen name="UserInfo" component={UserInfo} />
          <Stack.Screen name="Questions" component={Questions} />
          <Stack.Screen name="TrialPage" component={TrialPage} />
          <Stack.Screen name="FinishedPersonalization" component={FinishedPersonalization} />
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="SignIn" component={SignIn} />
        </Stack.Navigator>
      </NavigationContainer>
    );
}