import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, Text, SafeAreaView, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { user_login } from '../Api/Apiuser';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginForm({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }
    
    try {
      const result = await user_login({
        username: username.toLowerCase(),
        password: password,
      });

      if (result.status === 200) {
        await AsyncStorage.setItem("AccessToken", result.data.token);
        Alert.alert('Connexion réussie', 'Vous vous êtes connecté avec succès !');
        navigation.replace("home");
      } else {
        Alert.alert('Erreur', 'Échec de la connexion.');
      }
    } catch (err) {
      console.error('Erreur lors de la connexion :', err);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion.');
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
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>Entrer vos identifiants pour continuer</Text>
          <View style={styles.container1}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="#4b67a1" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#aaa"
                value={username}
                onChangeText={setUsername}
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
            <TouchableOpacity onPress={() => navigation.navigate('Pass')} style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Mot de passe oublié !</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
            <View style={styles.signInContainer}>
              <Text style={styles.goto}>Vous n'avez pas un compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signInText}>S'inscrire</Text>
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginVertical: 10,
    marginLeft: 'auto',
  },
  forgotPasswordText: {
    color: '#4b67a1',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
