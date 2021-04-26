import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'react-native';
import { LibraryScreen, ArtistPageScreen, DiscographyScreen } from '../screens';

const Stack = createStackNavigator();

export default function LibraryStack() {
  return (
    <Stack.Navigator
      initialRouteName='Library'
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
          name="Library"
          component={LibraryScreen}
          options={{
            headerTitle: "My Library",
            headerRight: () => (
              <Button
                onPress={() => alert('will be a create content screen')}
                title="[ + ]"
                color="white"
              />
            ),
          }}
        />
        <Stack.Screen
          name="ArtistPage"
          component={ArtistPageScreen}
          options={({ route }) => ({
            title: null,
            headerRight: () => (
              <Button
                onPress={() => alert('subscribe')}
                title="temptext"
                color="white"
              />
            ),
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