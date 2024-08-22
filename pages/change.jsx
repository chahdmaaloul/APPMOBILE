import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import Apimanager from '../Api/Apimanager';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Change = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez entrer et confirmer votre nouveau mot de passe.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    
    try {
      const token = await AsyncStorage.getItem('AccessToken');
      if (!token) {
        throw new Error('Token d\'accès non trouvé');
      }

      const response = await Apimanager.put(`/api/v1/crm_users/${userId}`, 
        { password: newPassword }, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        Alert.alert('Succès', 'Votre mot de passe a été changé avec succès.');
        navigation.navigate('Login'); // Redirige vers l'écran de connexion ou autre
      } else {
        Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors du changement de mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Changement de mot de passe</Text>
        
        <Text style={styles.userIdText}>ID de l'utilisateur : {userId}</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#4b67a1" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nouveau mot de passe"
            placeholderTextColor="#aaa"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#4b67a1" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirmer le mot de passe"
            placeholderTextColor="#aaa"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Changer le mot de passe</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    marginTop: 80,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  userIdText: {
    fontSize: 18,
    color: '#4b67a1',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    color: '#000',
  },
  button: {
    backgroundColor: '#4b67a1',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  icon: {
    marginRight: 10,
  },
});

export default Change;
