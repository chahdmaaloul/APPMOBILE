import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginForm from './screnns/Login';
import SignupForm from './screnns/Singup';
import PasswordResetScreen from './screnns/Password';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginForm} options={{ title: 'Connexion' }} />
        <Stack.Screen name="Signup" component={SignupForm} options={{ title: 'Inscription' }} />
        <Stack.Screen name="Pass" component={PasswordResetScreen} options={{ title: 'Forgetpassword' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
