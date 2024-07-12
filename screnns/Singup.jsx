import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, Text, SafeAreaView, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { user_signup } from '../Api/apisigup'; // Assurez-vous que le chemin d'importation de votre API est correct
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupForm() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [client, setClient] = useState('');
  const [roles, setRoles] = useState([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const userData = {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: password,
        confirmPassword: confirmPassword,
        client: client,
        roles: roles,
      };

      const result = await user_signup(userData);

      if (result.status === 201) {
        Alert.alert('Inscription réussie', 'Votre compte a été créé avec succès !');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erreur', 'Échec de l\'inscription.');
      }
    } catch (err) {
      console.error('Erreur lors de l\'inscription :', err);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SafeAreaView style={styles.container}>
          <View style={styles.topHalf}>
            <Image source={require('../assets/edilogo.png')} style={styles.mainImage} />
          </View>
          <Text style={styles.title}>Inscription</Text>
          <Text style={styles.subtitle}>Veuillez remplir le formulaire pour vous inscrire</Text>
          <View style={styles.container1}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={24} color="#4b67a1" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                placeholderTextColor="#aaa"
                value={username}
                onChangeText={setUsername}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="#4b67a1" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#4b67a1" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Ionicons
                  name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="#aaa"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#4b67a1" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de passe"
                placeholderTextColor="#aaa"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!isConfirmPasswordVisible}
              />
              <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                <Ionicons
                  name={isConfirmPasswordVisible ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="#aaa"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>
            <View style={styles.signInContainer}>
              <Text style={styles.goto}>Déjà un compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signInText}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainImage: {
    marginTop: 40,
    width: 190,
    height: 190,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container1: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  topHalf: {
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  icon: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    marginLeft: 20,
    marginTop: 50,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginLeft: 20,
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  goto: {
    color: '#000',
    fontSize: 16,
  },
  signInText: {
    color: '#4b67a1',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
