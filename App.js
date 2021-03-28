import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LoginScreen, HomeScreen, RegistrationScreen } from './src/screens'
import {decode, encode} from 'base-64'
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

const appStack = createStackNavigator();

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
        ) : (
          <>
	    <appStack.Screen name="Home">
		{props => <HomeScreen {...props} extraData={user} />}
	    </appStack.Screen>
            <appStack.Screen name="Login" component={LoginScreen} />
            <appStack.Screen name="Registration" component={RegistrationScreen} />
          </>
        )}
      </appStack.Navigator>
    </NavigationContainer>
  );
}
