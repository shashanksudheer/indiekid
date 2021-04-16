import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Image } from 'react-native';
import { HomeScreen, LibraryScreen, DiscoverScreen, StreamScreen, SettingsScreen, ArtistPageScreen } from '../screens';

const RootStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainNavigationTabs() {
  // this needs to have an additional tab
  // for "Campaign" only visible to Artist users
  return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen} 
        />
        <Tab.Screen 
          name="Library" 
          component={LibraryScreen} 
          options={{ tabBarLabel: 'My Library' }}
        />
        <Tab.Screen
          name="Discover"
          component={DiscoverScreen}
        />
        <Tab.Screen
          name="Stream" 
          component={StreamScreen} 
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
        />
      </Tab.Navigator>
  );
}

function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('../../assets/notification-bell.png')}
    />
  );
}

export default function HomeStack() {
  return (
    <RootStack.Navigator
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
        <RootStack.Screen
          name="Home"
          component={MainNavigationTabs}
          options={{
            headerTitle: "Home",
            headerRight: () => (
              <Button
                onPress={() => alert('will be a notification screen')}
                title="Notifications"
                color="white"
              />
            ),
          }}
        />
        <RootStack.Screen
          name="Library"
          component={MainNavigationTabs}
          options={{
            headerTitle: "My Library",
            headerRight: () => (
              <Button
                onPress={() => alert('will be a create content screen')}
                title="+"
                color="white"
              />
            ),
          }}
        />
        <RootStack.Screen
          name="Discover"
          component={MainNavigationTabs}
          options={{ header: () => null }}
        />
        <RootStack.Screen
          name="Stream"
          component={MainNavigationTabs}
          options={{ header: () => null }}
        />
        <RootStack.Screen
          name="Settings"
          component={MainNavigationTabs}
          options={{ header: () => null }}
        />
        <RootStack.Screen
          name="ArtistPage"
          component={ArtistPageScreen}
          options={({ route }) => ({
            title: route.params.artistName,
            headerBackTitle: "" 
          })}
        />

    </RootStack.Navigator>
  );
}