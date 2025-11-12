import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CameraScreen from '../screens/CameraScreen';
import PreviewScreen from '../screens/PreviewScreen';
import FeedScreen from '../screens/FeedScreen';
import ViewMediaScreen from '../screens/ViewMediaScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


// 👇 Stack for Camera tab (Camera ➜ Preview)
function CameraStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CameraMain" component={CameraScreen} />
      <Stack.Screen name="Preview" component={PreviewScreen} />
      <Stack.Screen name="ViewMedia" component={ViewMediaScreen} />
    </Stack.Navigator>
  );
}

// 👇 Bottom Tab Navigator
export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      {/* 📸 Feed Tab */}
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? 'home' : 'home-outline'}
              size={28}
              color={focused ? '#fff' : '#888'}
            />
          ),
        }}
      />

      {/* 🎥 Camera Tab */}
      <Tab.Screen
        name="CameraTab"
        component={CameraStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? 'camera' : 'camera-outline'}
              size={28}
              color={focused ? '#ff3d6e' : '#aaa'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000',
    borderTopWidth: 0,
    height: 70,
  },
});
