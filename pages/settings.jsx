import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image, Switch } from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [isEnabled, setIsEnabled] = React.useState({
    permissions: true,
    darkMode: false,
    playInBackground: false,
    onlyWifi: true,
    location: true,
  });

  const toggleSwitch = (key) => {
    setIsEnabled((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Paramètres */}
        <View style={styles.settingsContainer}>
          <View style={styles.settingItem}>
            <FontAwesome5 name="globe" size={24} color="orange" />
            <Text style={styles.settingText}>Langue</Text>
            <Text style={styles.settingTextValue}>Français</Text>
            <AntDesign name="right" size={20} color="gray" />
          </View>

          {/* Localisation */}
          <View style={styles.settingItem}>
            <FontAwesome5 name="map-marker-alt" size={24} color="orange"/>
            <Text style={styles.settingText}>Localisation</Text>
            <Switch
              value={isEnabled.location}
              onValueChange={() => toggleSwitch('location')}
            />
          </View>

          <View style={styles.settingItem}>
            <FontAwesome5 name="lock" size={24} color="orange"/>
            <Text style={styles.settingText}>Autorisations</Text>
            <Switch
              value={isEnabled.permissions}
              onValueChange={() => toggleSwitch('permissions')}
            />
          </View>

          <View style={styles.settingItem}>
            <FontAwesome5 name="moon" size={24} color="orange"/>
            <Text style={styles.settingText}>Mode sombre</Text>
            <Switch
              value={isEnabled.darkMode}
              onValueChange={() => toggleSwitch('darkMode')}
            />
          </View>

          

          <View style={styles.settingItem}>
            <FontAwesome5 name="wifi" size={24} color="orange" />
            <Text style={styles.settingText}>Wi-Fi uniquement</Text>
            <Switch
              value={isEnabled.onlyWifi}
              onValueChange={() => toggleSwitch('onlyWifi')}
            />
          </View>

          <View style={styles.settingItem}>
            <FontAwesome5 name="bell" size={24} color="orange"/>
            <Text style={styles.settingText}>Notifications</Text>
            <AntDesign name="right" size={20} color="gray" />
          </View>

          <View style={styles.settingItem}>
            <FontAwesome5 name="info-circle" size={24} color="orange" />
            <Text style={styles.settingText}>À propos de l'application</Text>
            <AntDesign name="right" size={20} color="gray" />
          </View>

          <View style={styles.settingItem}>
            <FontAwesome5 name="question-circle" size={24} color="orange" />
            <Text style={styles.settingText}>Aide</Text>
            <AntDesign name="right" size={20} color="gray" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    padding: 20,
  },
  settingsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  settingTextValue: {
    fontSize: 16,
    color: 'gray',
    marginRight: 10,
  },
});
