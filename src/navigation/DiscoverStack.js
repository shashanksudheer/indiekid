import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'react-native';
import { DiscoverScreen, ArtistPageScreen, DiscographyScreen } from '../screens';

const Stack = createStackNavigator();

export default function DiscoverStack() {
  return (
    <Stack.Navigator
      initialRouteName='Discover'
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
          name="Discover"
          component={DiscoverScreen}
        />
        <Stack.Screen
          name="ArtistPage"
          component={ArtistPageScreen}
          options={({ route }) => ({
            title: route.params.artistName,
          })}
        />
        <Stack.Screen
          name="Discography"
          component={DiscographyScreen}
          options={({ route }) => ({
            title: route.params.contentName,
          })}
        />
    </Stack.Navigator>
  );
}