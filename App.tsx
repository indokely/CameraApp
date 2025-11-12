import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import ViewMediaScreen from './src/screens/ViewMediaScreen'; // 👈 new import

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Your bottom tab navigation */}
          <Stack.Screen name="Main" component={BottomTabNavigator} />
          {/* New screen for full media view */}
          <Stack.Screen name="ViewMedia" component={ViewMediaScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
