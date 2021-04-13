import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RegistrationScreen, LoginScreen } from '../screens';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen
        name='Login'
        component={LoginScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name='Registration'
        component={RegistrationScreen} 
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}