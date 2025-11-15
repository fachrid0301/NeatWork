import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

import DashboardScreen from './screens/DashboardScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import SplashScreen from './screens/SplashScreen';

// ✅ Definisikan tipe untuk Stack Navigation
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Dashboard: undefined;
};

// ✅ Inisialisasi Stack Navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

// ✅ Aktifkan optimasi layar untuk performa
enableScreens();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  // ✅ Timer Splash Screen (3 detik)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Tampilkan SplashScreen terlebih dahulu
  if (showSplash) {
    return <SplashScreen />;
  }

  // ✅ Bungkus dengan GestureHandlerRootView dan SafeAreaProvider
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
