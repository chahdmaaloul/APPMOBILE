import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Apimaneger from '../Api/Apimanager';
import { UserContext } from '../Api/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Validation schema for form inputs
const validationSchema = Yup.object().shape({
  username: Yup.string().required("Le nom d'utilisateur est requis"),
  password: Yup.string().required("Le mot de passe est requis"),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Les mots de passe ne correspondent pas')
    .required("La confirmation du mot de passe est requise"),
  email: Yup.string().email('Email invalide').required("L'email est requis"),
});

const AddUserForm = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [roles, setRoles] = useState({
    ADMIN: false,
    USER: false,
    MANAGER: false,
    RH: false,
  });
  const [ematricule, setEmatricule] = useState('');

  // Fetch matricule when the component mounts
  useEffect(() => {
    const fetchMatricule = async () => {
      try {
        const token = await AsyncStorage.getItem('AccessToken');
        if (!token) throw new Error("Token d'accès non trouvé");

        const response = await Apimaneger.get('/api/v1/Employees/getformat/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response && response.data) {
          setEmatricule(response.data.ematricule);
        } else {
          throw new Error("Erreur lors de la récupération du matricule");
        }
      } catch (error) {
        console.error("Erreur de récupération du matricule :", error);
        Alert.alert('Erreur', 'Impossible de récupérer le matricule. Veuillez réessayer.');
      }
    };

    fetchMatricule();
  }, []);

  const handleRoleToggle = (role) => {
    setRoles((prevRoles) => ({
      ...prevRoles,
      [role]: !prevRoles[role],
    }));
  };

  const removeEmptyFields = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null && v !== ''));
  };

  const handleSubmitForm = async (values, { resetForm }) => {
    const selectedRoles = Object.keys(roles)
      .filter((role) => roles[role])
      .map((role) => `ROLE_${role.toUpperCase()}`);

    const userData = {
      enabled: true,
      email: values.email,
      client: "EMP",
      username: values.username,
      roles: selectedRoles,
      reference: "string", // Replace with actual reference if needed
      password: values.password,
      created: new Date().toISOString(),
      ematricule: ematricule, // Use fetched matricule
    };

    try {
      const response = await Apimaneger.post('/api/v1/crm_users', removeEmptyFields(userData), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('AccessToken')}`
        }
      });
      Alert.alert('Succès', 'Utilisateur ajouté avec succès!');
      resetForm();
      navigation.goBack();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur :", error);
      Alert.alert('Erreur', `Échec de l'ajout de l'utilisateur. ${error.response?.data?.message || "Veuillez vérifier l'URL de l'endpoint et réessayer."}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={1}
    >
      <Formik
        initialValues={{
          username: '',
          password: '',
          passwordConfirmation: '',
          email: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmitForm}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.container}>
            <View style={styles.topHalf}>
             
              <Text style={styles.title}>Veuillez fournir les informations ci-dessous pour créer un nouvel utilisateur :</Text>
            </View>

            <View style={styles.bottomHalf}>
              <ScrollView style={styles.scrollView}>
                <View style={styles.zone}>
                  <Text style={styles.label}>Nom d'utilisateur</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="user" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={values.username}
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                      placeholder="Nom d'utilisateur"
                      placeholderTextColor="#999"
                    />
                  </View>
                  {touched.username && errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

                  <Text style={styles.label}>Mot de passe</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="lock" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      placeholder="Mot de passe"
                      placeholderTextColor="#999"
                      secureTextEntry
                    />
                  </View>
                  {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                  <Text style={styles.label}>Confirmer le mot de passe</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="lock" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={values.passwordConfirmation}
                      onChangeText={handleChange('passwordConfirmation')}
                      onBlur={handleBlur('passwordConfirmation')}
                      placeholder="Confirmer le mot de passe"
                      placeholderTextColor="#999"
                      secureTextEntry
                    />
                  </View>
                  {touched.passwordConfirmation && errors.passwordConfirmation && <Text style={styles.errorText}>{errors.passwordConfirmation}</Text>}

                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="envelope" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      placeholder="Email"
                      placeholderTextColor="#999"
                      keyboardType="email-address"
                    />
                  </View>
                  {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                  <Text style={styles.label}>Matricule</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="id-badge" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={ematricule}
                      editable={false} // Disable editing
                      placeholder="Matricule"
                      placeholderTextColor="#999"
                    />
                  </View>

                  <Text style={styles.label}>Rôles</Text>
                  {Object.keys(roles).map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.roleButton,
                        roles[role] ? styles.roleButtonSelected : styles.roleButtonUnselected,
                      ]}
                      onPress={() => handleRoleToggle(role)}
                    >
                      <Text style={styles.roleButtonText}>{role}</Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Ajouter</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006AB6',
  },
  topHalf: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bottomHalf: {
    flex: 1,
 
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    
  },
  scrollView: {
    flex: 1,
  },
  zone: {
    paddingBottom: 40,
  },
  label: {
    color: '#666',
    fontSize: 14,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    color: '#333',
    paddingVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 15,
  },
  roleButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  roleButtonSelected: {
    backgroundColor: '#006AB6',
  },
  roleButtonUnselected: {
    backgroundColor: '#ddd',
  },
  roleButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#006AB6',
    borderRadius: 5,
    paddingVertical: 15,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  backButton: {
    marginRight: 10,
  },
});

export default AddUserForm;
