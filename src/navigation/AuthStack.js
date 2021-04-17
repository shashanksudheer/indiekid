import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RegistrationScreen, LoginScreen } from '../screens';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ header: () => null }}
      initialRouteName='Login'
    >
      <Stack.Screen
        name='Login'
        component={LoginScreen}
      />
      <Stack.Screen
        name='Registration'
        component={RegistrationScreen} 
      />
    </Stack.Navigator>
  );
}