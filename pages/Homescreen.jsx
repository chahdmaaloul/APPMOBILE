import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView ,TextInput} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { AntDesign } from '@expo/vector-icons';
import Conge from './Demandecongee';
import Autorisation from './DemandeAutorisation';
import Complement from './Demandecomplement';
import LoansTabs from './LoansTabs';
import Rembourcement from './Demanderemboursement';
import SettingsScreen from './settings';
import AbsenceTracker from './Absence';

import Bottensheet from '../components/Bottensheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const Drawer = createDrawerNavigator();

function PageHome({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            placeholder="Search"
            style={styles.searchInput}
            onChangeText={(text) => console.log(text)} // Fonction de gestion du texte entré
          />
        </View>
        {/* Icône de recherche */}
        <View style={styles.searchIconContainer}>
          <AntDesign name="search1" size={24} color="black" style={styles.searchIcon} />
        </View>
      </View>
      

      <TouchableOpacity style={[styles.menuItem, { backgroundColor: '#4b67a1' }]} onPress={() => navigation.navigate('Demande de congés')}>
        <Icon name="calendar" size={30} color="#fff" />
        <Text style={styles.menuText}>Demande de congés</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.menuItem, { backgroundColor: '#4b67a1' }]} onPress={() => navigation.navigate('Demande d\'autorisation')}>
        <Icon name="form" size={30} color="#fff" />
        <Text style={styles.menuText}>Demande d'autorisation</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.menuItem, { backgroundColor: '#4b67a1' }]} onPress={() => navigation.navigate('Demande de complément')}>
        <Icon name="pluscircleo" size={30} color="#fff" />
        <Text style={styles.menuText}>Demande de complément</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.menuItem, { backgroundColor: '#4b67a1' }]} onPress={() => navigation.navigate('Demande de remboursement')}>
        <Icon name="creditcard" size={30} color="#fff" />
        <Text style={styles.menuText}>Demande de remboursement</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.menuItem, { backgroundColor: '#4b67a1' }]} onPress={() => navigation.navigate('Absences')}>
        <Icon name="frowno" size={30} color="#fff" />
        <Text style={styles.menuText}>Absences</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function CustomDrawerContent(props) {
  const modalRef = useRef(null);

  const openBottensheet = () => {
    modalRef?.current?.present();
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.profileContainer}>
        <Image source={require('../assets/PROF.jpg')} style={styles.profileImage} />
        <Text style={styles.profileName}>foulen en foulen </Text>
        <TouchableOpacity style={styles.settingsButton} onPress={openBottensheet}>
          <Icon name="down" size={16} color="#000" />
        </TouchableOpacity>
      </View>
      <DrawerItemList {...props} />
      <Bottensheet ref={modalRef} />
    </DrawerContentScrollView>
  );
}
function LogoTitle() {
  return (
    <Image
      style={{ width: 70, height: 70  ,borderRadius:50}}
      source={require('../assets/edilogo.png')}
    />
  );
}

export default function HomeScreen() {
  return (
    <BottomSheetModalProvider>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={props => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="Home"
          component={PageHome}
          options={{
            drawerIcon: ({ color }) => <Icon name="home" color={color} size={24} />,
             headerTitle: (props) => <LogoTitle {...props} />,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: 'bold',
              color: '#4b67a1',
            },
          }}
        />
        <Drawer.Screen
          name="Demande d'autorisation"
          component={Autorisation}
          options={{
            drawerIcon: ({ color }) => <Icon name="form" color={color} size={24} />,
            headerTitle: 'Demande d\'autorisation',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: 'bold',
              color: '#4b67a1',
            },
          }}
        />
        <Drawer.Screen
          name="Demande de congés"
          component={Conge}
          options={{
            drawerIcon: ({ color }) => <Icon name="calendar" color={color} size={24} />,
            headerTitle: 'Demande de congés',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 24,
              fontWeight: 'bold',
              marginLeft: 8,
              color: '#4b67a1',
            },
            headerSubtitle: 'Gérer vos demandes de congés',
            headerSubtitleStyle: {
              fontSize: 16,
              color: 'gray',
            },
          }}
        />
        <Drawer.Screen
          name="Demande de complément"
          component={Complement}
          options={{
            drawerIcon: ({ color }) => <Icon name="pluscircleo" color={color} size={24} />,
            headerTitle: 'Demande de complément',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 24,
              fontWeight: 'bold',
              marginLeft: 8,
              color: '#4b67a1',
            },
            headerSubtitle: 'Gérer vos demandes de complément',
            headerSubtitleStyle: {
              fontSize: 16,
              color: 'gray',
            },
          }}
        />
        <Drawer.Screen
          name="Demande de remboursement"
          component={Rembourcement}
          options={{
            drawerIcon: ({ color }) => <Icon name="creditcard" color={color} size={24} />,
            headerTitle: 'Demande de remboursement',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 24,
              fontWeight: 'bold',
              marginLeft: 8,
              color: '#4b67a1',
            },
            headerSubtitle: 'Gérer vos demandes de remboursement',
            headerSubtitleStyle: {
              fontSize: 16,
              color: 'gray',
            },
          }}
        />
        <Drawer.Screen
          name="Demande de prêt"
          component={LoansTabs}
          options={{
            drawerIcon: ({ color }) => <Icon name="bank" color={color} size={24} />,
            headerTitle: 'Demande de prêt',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 24,
              fontWeight: 'bold',
              marginLeft: 8,
              color: '#4b67a1',
            },
            headerSubtitle: 'Gérer vos demandes de prêt',
            headerSubtitleStyle: {
              fontSize: 16,
              color: 'gray',
            },
          }}
        />
        <Drawer.Screen
          name="Absences"
          component={AbsenceTracker}
          options={{
            drawerIcon: ({ color }) => <Icon name="frowno" color={color} size={24} />,
            headerTitle: 'Absences',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 24,
              fontWeight: 'bold',
              marginLeft: 8,
              color: '#4b67a1',
            },
            headerSubtitle: 'Gérer vos absences',
            headerSubtitleStyle: {
              fontSize: 16,
              color: 'gray',
            },
          }}
        />
        <Drawer.Screen
          name="Paramétres"
          component={SettingsScreen}
          options={{
            drawerIcon: ({ color }) => <Icon name="setting" color={color} size={24} />,
            headerTitle: 'Paramétres',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 24,
              fontWeight: 'bold',
              marginLeft: 8,
              color: '#4b67a1',
            },
            headerSubtitle: 'Gérer vos paramétres',
            headerSubtitleStyle: {
              fontSize: 16,
              color: 'gray',
            },
          }}
        />
      </Drawer.Navigator>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    marginHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 20,
    color: '#fff',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileName: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsButton: {
    marginLeft: 'auto',
  },
  weatherContainer: {
    backgroundColor: '#4b67a1',
    borderRadius: 10,
    padding: 15,
    margin: 20,
  },
  weatherText: {
    fontSize: 16,
    color: '#fff',
  },
  weatherTemp: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  weatherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  weatherInfoText: {
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 300,
  },
  searchInputContainer: {
    flex: 1,
  },
  searchInput: {
    fontSize: 18,
    paddingHorizontal: 10,
  },
  searchIconContainer: {
    padding: 10,
  },
});
