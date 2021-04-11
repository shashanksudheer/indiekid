import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, LibraryScreen, DiscoverScreen, StreamScreen, SettingsScreen } from '../screens';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainNavigationTabs() {
  // this needs to have an additional tab
  // for "Campaign" only visible to Artist users
  return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Library" component={LibraryScreen} />
        <Tab.Screen name="Discover" component={DiscoverScreen} />
        <Tab.Screen name="Stream" component={StreamScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
  );
}

export default function HomeStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={MainNavigationTabs}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name="Library"
          component={MainNavigationTabs}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name="Discover"
          component={MainNavigationTabs}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name="Stream"
          component={MainNavigationTabs}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name="Settings"
          component={MainNavigationTabs}
          options={{ header: () => null }}
        />
    </Stack.Navigator>
  );
}