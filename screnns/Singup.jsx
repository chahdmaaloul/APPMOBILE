import React, { useState, useEffect } from 'react';
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, Text, SafeAreaView, Image, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { get_users } from '../Api/apigetuserscrm';
import { user_signup } from '../Api/apisigup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { Easing, useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

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
  const [loading, setLoading] = useState(false);

  // Animation variables
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.quad),
    });
    translateY.value = withTiming(0, {
      duration: 1000,
      easing: Easing.out(Easing.quad),
    });
  }, [opacity, translateY]);

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword ) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      const users = await get_users();
      console.log("Utilisateurs récupérés :", users);

      const usernameExists = users.find(user => user.username.toLowerCase() === username.toLowerCase());
      if (usernameExists) {
        Alert.alert('Erreur', 'Le nom d\'utilisateur existe déjà. Veuillez en choisir un autre.');
        setLoading(false);
        return;
      }

      const emailExists = users.find(user => user.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        Alert.alert('Erreur', 'L\'email existe déjà. Veuillez en choisir un autre.');
        setLoading(false);
        return;
      }

      // Calculer le dernier ematricule 
      const maxEmatricule = users.reduce((max, user) => {
        return user.ematricule > max ? user.ematricule : max;
      }, 0);

      const newEmatricule = String(maxEmatricule + 1).padStart(3, '0');

      const userData = {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: password,
        confirmPassword: confirmPassword,
        client: client,
        roles: roles,
        ematricule: newEmatricule
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
    } finally {
      setLoading(false);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SafeAreaView style={styles.container}>
          <View style={styles.topHalf}>
            <Image source={require('../assets/edilogo.png')} />
          </View>
          <Text style={styles.title}>Inscription</Text>

          <Animated.View style={[styles.container1, animatedStyle]}>
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

            <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>S'inscrire</Text>}
            </TouchableOpacity>
            <View style={styles.signInContainer}>
              <Text style={styles.goto}>Déjà un compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signInText}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainImage: {
    marginTop: 60,
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
    backgroundColor: '#006AB6',
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginLeft: 20,
  },
  signInContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  signInText: {
    color: '#006AB6',
    fontWeight: 'bold',
  },
  goto: {
    color: '#333',
  },
});
