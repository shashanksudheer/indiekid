import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Image } from 'react-native';
import HomeStack from './HomeStack';
import LibraryStack from './LibraryStack';
import DiscoverStack from './DiscoverStack';
import StreamStack from './StreamStack';
import SettingsStack from './SettingsStack';
import { DiscoverScreen, StreamScreen, SettingsScreen } from '../screens';

const Tab = createBottomTabNavigator();

function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('../../assets/notification-bell.png')}
    />
  );
}

export default function RootStack() {
  // this needs to have an additional tab
  // for "Campaign" only visible to Artist users
  return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeStack} 
        />
        <Tab.Screen 
          name="Library" 
          component={LibraryStack} 
          options={{ tabBarLabel: 'My Library' }}
        />
        <Tab.Screen
          name="Discover"
          component={DiscoverStack}
        />
        <Tab.Screen
          name="Stream" 
          component={StreamStack} 
        />
        <Tab.Screen
          name="Settings"
          component={SettingsStack}
        />
      </Tab.Navigator>
  );
}
