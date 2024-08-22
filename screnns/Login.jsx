import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, Text, SafeAreaView, Image, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { user_login } from '../Api/Apiuser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get_users } from '../Api/apigetuserscrm';
import { UserContext } from '../Api/UserContext';
import Animated, { Easing, useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

export default function LoginForm({ navigation }) {
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
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

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }
    setLoadingLogin(true);

    try {
      const result = await user_login({
        username: username.toLowerCase(),
        password: password
      });

      if (result.status === 200) {
        const token = result.data.token;
        await AsyncStorage.setItem("AccessToken", token);

        const users = await get_users();
        const user = users.find(user => user.username === username.toLowerCase());

        if (user) {
          await AsyncStorage.setItem("UserDetails", JSON.stringify(user));
          setUser(user);
          navigation.replace("home", { user });
        } else {
          Alert.alert('Erreur', 'Utilisateur non trouvé.');
          setLoadingLogin(false);
        }
      } else {
        Alert.alert('Erreur', 'Vérifiez vos coordonnées.');
        setLoadingLogin(false);
      }
    } catch (err) {
      console.error('Erreur lors de la connexion :', err);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion.');
    } finally {
      setLoadingLogin(false);
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
            <Image source={require('../assets/logocomplet.png')} style={styles.mainImage} />
          </View>
          <Text style={styles.title}>Connexion</Text>

          <Animated.View style={[styles.container1, animatedStyle]}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={24} color="#4b67a1" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
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
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loadingLogin}>
              {loadingLogin ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Se connecter</Text>}
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainImage: {
    width:150,
  height:150,
    marginTop: 100,
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
    marginTop: 50,
    textAlign: 'center',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginVertical: 10,
    marginLeft: 'auto',
  },
  forgotPasswordText: {
    color: '#006AB6',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
