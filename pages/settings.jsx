import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image, Switch } from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [isEnabled, setIsEnabled] = React.useState({
    permissions: true,
    darkMode: false,
    playInBackground: false,
    onlyWifi: true,
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
        {/* Profil */}
     

        {/* Paramètres */}
        <View style={styles.settingsContainer}>
          <View style={styles.settingItem}>
            <FontAwesome5 name="globe" size={24} color="orange" />
            <Text style={styles.settingText}>Language</Text>
            <Text style={styles.settingTextValue}>English</Text>
            <AntDesign name="right" size={20} color="gray" />
          </View>

          <View style={styles.settingItem}>
            <FontAwesome5 name="lock" size={24} color="orange"/>
            <Text style={styles.settingText}>Permissions</Text>
            <Switch
              value={isEnabled.permissions}
              onValueChange={() => toggleSwitch('permissions')}
            />
          </View>

          <View style={styles.settingItem}>
            <FontAwesome5 name="moon" size={24} color="orange"/>
            <Text style={styles.settingText}>Dark Mode</Text>
            <Switch
              value={isEnabled.darkMode}
              onValueChange={() => toggleSwitch('darkMode')}
            />
          </View>

          <View style={styles.settingItem}>
            <FontAwesome5 name="play-circle" size={24} color="orange"/>
            <Text style={styles.settingText}>Play in Background</Text>
            <Switch
              value={isEnabled.playInBackground}
              onValueChange={() => toggleSwitch('playInBackground')}
            />
          </View>

          <View style={styles.settingItem}>
            <FontAwesome5 name="wifi" size={24} color="orange" />
            <Text style={styles.settingText}>Only Wi-Fi</Text>
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
            <Text style={styles.settingText}>About Application</Text>
            <AntDesign name="right" size={20} color="gray" />
          </View>

          <View style={styles.settingItem}>
            <FontAwesome5 name="question-circle" size={24} color="orange" />
            <Text style={styles.settingText}>Help</Text>
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
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileTextContainer: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileRole: {
    fontSize: 16,
    color: 'gray',
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
