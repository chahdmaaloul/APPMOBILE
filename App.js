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
import Change from './pages/change';
import { UserProvider } from './Api/UserContext';
import Complement from './pages/Demandecomplement';
import Rembourcement from './pages/Demanderemboursement';
import Conge from './pages/Demandecongee';
import Autorisation from './pages/DemandeAutorisation';
import SplashScreen from './screnns/SplashScreen';
import ContactsScreen from './pages/equipe';
import AcceptedRejectedRequests from './pages/Voirplus';
import HelpPage from './pages/aide';
const Stack = createStackNavigator();

export default function App() {
  return (
    <UserProvider>
    <NavigationContainer>
      <DarkModeProvider>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="home" component={Homescreen} options={{ title: 'home' }} />
      <Stack.Screen name="change" component={Change } options={{ title: 'changemot' }} />
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
        <Stack.Screen name="decoge" component={Conge} options={{ title: 'decoge' }} />
        <Stack.Screen name="derembo" component={Rembourcement} options={{ title: 'derembo' }} />
        <Stack.Screen name="deauto" component={Autorisation} options={{ title: 'deauto' }} />
        <Stack.Screen name="decompl" component={Complement} options={{ title: 'decompl' }} />
        <Stack.Screen name="equipe" component={ContactsScreen} options={{ title: 'equipe' }} />
        <Stack.Screen name="voir" component={AcceptedRejectedRequests} options={{ title: 'voir' }} />
        <Stack.Screen name="HelpPage" component={HelpPage}  options={{ title: 'HelpPage' }} />
      </Stack.Navigator>
      </DarkModeProvider>
    </NavigationContainer>
    </UserProvider>
  );
}
