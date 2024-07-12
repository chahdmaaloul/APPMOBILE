import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginForm from './screnns/Login';
import SignupForm from './screnns/Singup';
import PasswordResetScreen from './screnns/Password';
import Page from './screnns/Page';
import Homescreen from './pages/Homescreen';
import DemandeAutorisation from './pages/Formuleautorisation';
import DemandeConge from './pages/Formuleconges';
import DemandePret from './pages/formule de pret';
import SettingsScreen from './pages/settings';
import DemandeRemboursement from './pages/formule remboursement';
import DemandeComplement from './pages/Formulecomplement';
import { DarkModeProvider } from './components/DarkModeContext';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <DarkModeProvider>
      <Stack.Navigator initialRouteName="first" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" component={Homescreen} options={{ title: 'home' }} />
        <Stack.Screen name="first" component={Page} options={{ title: 'first' }} />
        <Stack.Screen name="Login" component={LoginForm} options={{ title: 'Connexion' }} />
        <Stack.Screen name="Signup" component={SignupForm} options={{ title: 'Inscription' }} />
        <Stack.Screen name="Pass" component={PasswordResetScreen} options={{ title: 'Forgetpassword' }} />
        <Stack.Screen name="cong" component={DemandeConge} options={{ title: 'cong' }} />
        <Stack.Screen name="pret" component={DemandePret} options={{ title: 'pret' }} />
        <Stack.Screen name="rembourcement" component={DemandeRemboursement} options={{ title: 'rembourcement' }} />
        <Stack.Screen name="settings" component={SettingsScreen} options={{ title: 'settings' }} />
        <Stack.Screen name="comple" component={DemandeComplement} options={{ title: 'comple' }} />
        <Stack.Screen name="auto" component={DemandeAutorisation} options={{ title: 'auto' }} />
        
      </Stack.Navigator>
      </DarkModeProvider>
    </NavigationContainer>
  );
}
