import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { get_users } from '../Api/apigetuserscrm';

const PasswordResetScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Erreur', 'Veuillez entrer votre adresse e-mail.');
      return;
    }

    setLoading(true); // Activer l'état de chargement

    try {
      const users = await get_users();
      console.log("Utilisateurs récupérés :", users);

      if (!Array.isArray(users)) {
        throw new Error("Les données des utilisateurs ne sont pas au format attendu.");
      }

      const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        Alert.alert('Erreur', 'Aucun utilisateur trouvé avec cet email.');
        setLoading(false); // Désactiver l'état de chargement
        return;
      }

      // Réinitialisation réussie
      Alert.alert('Réinitialisation réussie', 'Veuillez suivre les instructions envoyées par email.');
      navigation.navigate('change', { userId: user.id });

    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la réinitialisation du mot de passe.');
    } finally {
      setLoading(false); // Assurez-vous de désactiver l'état de chargement dans tous les cas
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
        <Text style={styles.title}>Réinitialiser le mot de passe</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="#4b67a1" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handlePasswordReset}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Réinitialiser le mot de passe</Text>}
        </TouchableOpacity>
        <View style={styles.signInContainer}>
          <Text style={styles.goto}>Vous n'avez pas un compte ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signInText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
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
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
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

export default PasswordResetScreen;
