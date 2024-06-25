import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, Text, SafeAreaView, Image } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function LoginForm({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  

  const handleSignup = async () => {
    if ( !email || !password ) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }

   

    try {
      const userData = {
        enabled: true,
        email: email,
        password: password,
        created: new Date().toISOString()
      };

      const response = await axios.post(
        'https://cmc.crm-edi.info/paraMobile/api/public/api/58390/documentation/api/v1/crm_users',
        userData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert('connection réussie', 'vous avez entrer avec succès !');
        // Redirigez l'utilisateur si nécessaire
      } else {
        throw new Error(`Erreur lors de la connexion: ${response.status}`);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connection . Veuillez réessayer.');
      console.error('Erreur lors de la connection :', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHalf}>
        <Image source={require('../assets/edilogo.png')} />
      </View>
      <Text style={styles.title}>Connection </Text>
      <Text style={styles.subtitle}>Entrer vos identifiants pour continuer</Text>
      <View style={styles.container1}>
      
       
        
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
        <TouchableOpacity onPress={() => navigation.navigate('Pass')} style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Mot de passe oublié !</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>s'inscrire</Text>
        </TouchableOpacity>
        <View style={styles.signInContainer}>
          <Text style={styles.goto}>Vous n'avez pas un compte ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signInText}>s'inscrire</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
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
   marginLeft:200
  },
  forgotPasswordText: {
    color: '#4b67a1',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
