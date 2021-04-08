import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RegistrationScreen, LoginScreen, HomeScreen, LibraryScreen, DiscoverScreen, StreamScreen, SettingsScreen } from './src/screens';
import {decode, encode} from 'base-64';
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

// navigation bottom tabs should only show to users who are signed in

const appStack = createStackNavigator();
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
      <Tab.Screen name="SettingsScreen" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  return (
    <NavigationContainer>
      <appStack.Navigator>
        { user ? (
            <appStack.Screen name="Home">
                {props => <HomeScreen {...props} extraData={user} />}
            </appStack.Screen>
            <NavigationContainer>
              <MainNavigationTabs />
            </NavigationContainer>
        ) : (
          <>
            <appStack.Screen name="Login" component={LoginScreen} />
            <appStack.Screen name="Registration" component={RegistrationScreen} />
          </>
        )}
      </appStack.Navigator>
    </NavigationContainer>
  );
}
