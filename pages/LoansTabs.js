import * as React from 'react';
import { Animated, View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AvailableLoansScreen from './demandepret';
import Suivi from './Suivi pret';
import SettingsScreen from './settings';




const Tab = createMaterialTopTabNavigator();



export default function LoansTabs() {
  return (
    <Tab.Navigator
    lazy={true}
  >
    <Tab.Screen name='FirstTab'
      options={{ tabBarLabel: 'demandes' }}
      listeners={({ navigation }) => ({
        swipeEnd: (e) => {
          console.log('First Tab Swipe')
        },
        tabPress: (e) => {
          console.log('Demabdes')
        },
      })}
      component={AvailableLoansScreen} />
    <Tab.Screen name='Suivi'
      options={{ tabBarLabel: 'Suivi' }}
      listeners={({ navigation }) => ({
        swipeEnd: (e) => {
          console.log('Second Tab Swipe')
        },
        tabPress: (e) => {
          console.log('suivi')
        },
      })}
      component={Suivi} />
   
  </Tab.Navigator>
  );
}



