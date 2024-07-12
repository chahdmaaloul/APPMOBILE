import React, { useMemo, forwardRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, Switch } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';

import { FontAwesome } from '@expo/vector-icons';

const Bottensheet = forwardRef((props, ref) => {
  const snapPoints = useMemo(() => ['25%', '90%'], []);
  const defaultImage = require('../assets/PROF.jpg');
  const [file, setFile] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission refusée',
        "Désolé, nous avons besoin de l'autorisation d'accéder à votre bibliothèque de photos pour charger des images."
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setFile(result.uri);
      }
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const closeBottomSheet = () => {
    ref.current?.close();
  };

  const dynamicStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <BottomSheetModal ref={ref} index={1} snapPoints={snapPoints}>
      <BottomSheetView style={dynamicStyles.contentContainer}>
        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.headerText}>Profile</Text>
          <TouchableOpacity onPress={closeBottomSheet}>
            <Text style={dynamicStyles.okText}>OK</Text>
          </TouchableOpacity>
        </View>
        <View style={dynamicStyles.profile}>
          <TouchableOpacity onPress={pickImage}>
            <Image source={file ? { uri: file } : defaultImage} style={dynamicStyles.avatar} />
            <View style={dynamicStyles.cameraIcon}>
              <TouchableOpacity onPress={pickImage}>
                <Icon name="camera" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <Text style={dynamicStyles.name}>foulen ben foulen</Text>
          <Text style={dynamicStyles.note}>Laisser une note</Text>
        </View>
        <ScrollView style={dynamicStyles.scrollView}>
          <TouchableOpacity style={dynamicStyles.option} onPress={toggleDarkMode}>
            <Text style={dynamicStyles.optionText}>Mode sombre</Text>
            <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
          </TouchableOpacity>
          <TouchableOpacity style={dynamicStyles.option}>
            <FontAwesome name="exchange" size={24} color="black" />
            <Text style={dynamicStyles.optionText}>Changer de compte</Text>
          </TouchableOpacity>
          <View style={dynamicStyles.option}>
            <Text style={dynamicStyles.optionText}>Statut En ligne</Text>
            <Text style={dynamicStyles.optionActive}>Activé</Text>
          </View>
          <TouchableOpacity style={dynamicStyles.option}>
            <FontAwesome name="universal-access" size={24} color="black" />
            <Text style={dynamicStyles.optionText}>Accessibilité</Text>
          </TouchableOpacity>
          <TouchableOpacity style={dynamicStyles.option}>
            <FontAwesome name="lock" size={24} color="black" />
            <Text style={dynamicStyles.optionText}>Confidentialité et sécurité</Text>
          </TouchableOpacity>
          <TouchableOpacity style={dynamicStyles.option}>
            <FontAwesome name="users" size={24} color="black" />
            <Text style={dynamicStyles.optionText}>Supervision parentale</Text>
          </TouchableOpacity>
          <TouchableOpacity style={dynamicStyles.option}>
            <FontAwesome name="dashboard" size={24} color="black" />
            <Text style={dynamicStyles.optionText}>Consulter le tableau de bord parental</Text>
          </TouchableOpacity>
          <TouchableOpacity style={dynamicStyles.option}>
            <FontAwesome name="user-circle" size={24} color="black" />
            <Text style={dynamicStyles.optionText}>Avatar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={dynamicStyles.option}>
            <FontAwesome name="bell" size={24} color="black" />
            <Text style={dynamicStyles.optionText}>Notifications</Text>
          </TouchableOpacity>
        </ScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const commonStyles = {
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  okText: {
    fontSize: 16,
  },
  profile: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'gray',
    padding: 8,
    borderRadius: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  note: {
    fontSize: 14,
    marginTop: 4,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 16,
  },
  optionActive: {
    fontSize: 16,
  },
};

const lightStyles = StyleSheet.create({
  ...commonStyles,
  contentContainer: {
    ...commonStyles.contentContainer,
    backgroundColor: 'white',
  },
  headerText: {
    ...commonStyles.headerText,
    color: 'black',
  },
  okText: {
    ...commonStyles.okText,
    color: '#007AFF',
  },
  name: {
    ...commonStyles.name,
    color: 'black',
  },
  note: {
    ...commonStyles.note,
    color: '#007AFF',
  },
  option: {
    ...commonStyles.option,
    backgroundColor: '#f2f2f2',
  },
  optionText: {
    ...commonStyles.optionText,
    color: 'black',
  },
  optionActive: {
    ...commonStyles.optionActive,
    color: '#4cd964',
  },
});

const darkStyles = StyleSheet.create({
  ...commonStyles,
  contentContainer: {
    ...commonStyles.contentContainer,
    backgroundColor: '#333',
  },
  headerText: {
    ...commonStyles.headerText,
    color: 'white',
  },
  okText: {
    ...commonStyles.okText,
    color: '#007AFF',
  },
  name: {
    ...commonStyles.name,
    color: 'white',
  },
  note: {
    ...commonStyles.note,
    color: '#007AFF',
  },
  option: {
    ...commonStyles.option,
    backgroundColor: '#444',
  },
  optionText: {
    ...commonStyles.optionText,
    color: 'white',
  },
  optionActive: {
    ...commonStyles.optionActive,
    color: '#4cd964',
  },
});

export default Bottensheet;
