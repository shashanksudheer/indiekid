import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'react-native';
import { HomeScreen, NotificationScreen } from '../screens';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName='Home'
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
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: "Home",
            headerRight: () => (
              <Button
                onPress={() => alert('will be Notification Screen screen')}
                title="Notifications"
                color="white"
              />
            ),
          }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationScreen}
          options={{
            title: "Notifications",
          }}
        />
    </Stack.Navigator>
  );
}