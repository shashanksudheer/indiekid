import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'react-native';
import { StreamScreen } from '../screens';

const Stack = createStackNavigator();

export default function DiscoverStack() {
  return (
    <Stack.Navigator
      initialRouteName='Stream'
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
          name="Stream"
          component={StreamScreen}
        />
    </Stack.Navigator>
  );
}