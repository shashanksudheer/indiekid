import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'react-native';
import { SettingsScreen, EditProfileScreen } from '../screens';

const Stack = createStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator
      initialRouteName='Settings'
      screenOptions={{
          headerStyle: {
            backgroundColor: '#788eec',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
        />
    </Stack.Navigator>
  );
}