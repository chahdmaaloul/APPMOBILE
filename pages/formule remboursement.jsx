import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView , KeyboardAvoidingView , Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import 'moment/locale/fr';
import Apimaneger from '../Api/Apimanager';
import { UserContext } from '../Api/UserContext';

moment.locale('fr');

const validationSchema = Yup.object().shape({
  employe: Yup.string().required('Le nom de l\'employé est requis'),
  service: Yup.string().required('Le nom du service est requis'),
  montant: Yup.number().required('Le montant est requis').positive('Le montant doit être positif'),
  dateRemboursementPrime: Yup.date().required('La date de remboursement de prime est requise'),
  dateRemboursementFrais: Yup.date().required('La date de remboursement de frais est requise'),
  remarque: Yup.string(),
});

const DemandeRemboursement = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [dateRemboursementPrime, setDateRemboursementPrime] = useState(new Date());
  const [dateRemboursementFrais, setDateRemboursementFrais] = useState(new Date());
  const [showDateRemboursementPrime, setShowDateRemboursementPrime] = useState(false);
  const [showDateRemboursementFrais, setShowDateRemboursementFrais] = useState(false);
  const [reference, setReference] = useState('');

  useEffect(() => {
    const fetchReference = async () => {
      try {
        const response = await Apimaneger.get('https://cmc.crm-edi.info/paraMobile/api/public/api/v1/GRH/getformat/DR?page=1');
        const data = response.data;
        if (data.length > 0 && data[0]['']) {
          setReference(data[0]['']); 
        } else {
          console.error('Aucune référence trouvée dans la réponse.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la référence:', error);
      }
    };

    fetchReference();
  }, []);
  const onChangeDateRemboursementPrime = (event, selectedDate) => {
    const currentDate = selectedDate || dateRemboursementPrime;
    setShowDateRemboursementPrime(false);
    setDateRemboursementPrime(currentDate);
  };

  const onChangeDateRemboursementFrais = (event, selectedDate) => {
    const currentDate = selectedDate || dateRemboursementFrais;
    setShowDateRemboursementFrais(false);
    setDateRemboursementFrais(currentDate);
  };

  const handleSubmit = async (values, { resetForm }) => {

    const demande = {
      typegrh: 'DR',
      codetiers: user.ematricule.toString(),
      des: values.remarque,
      datedeb: dateRemboursementPrime.toISOString(),
      datefin: dateRemboursementFrais.toISOString(),
      datel: new Date().toISOString(),
      categorie: values.service,
      aup: values.montant,
      etatbp: "null",
      ref: reference,
    };
    const removeEmptyFields = (obj) => {y
      return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null && v !== ''));
    };
    try {
      const response = await Apimaneger.post('/api/v1/grhs', removeEmptyFields(demande), {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.status === 201) {
        console.log('Demande envoyée avec succès', response.data);
        resetForm(); 
        navigation.goBack(); 
      } else {
        console.log("Erreur lors de l'envoi de la demande", response.status);
      }
    } catch (error) {
      if (error.response) {
        console.error("Erreur lors de l'envoi de la demande:", error.response.data);
      } else if (error.request) {
        console.error("Erreur lors de l'envoi de la demande:", error.request);
      } else {
        console.error("Erreur lors de l'envoi de la demande:", error.message);
      }
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
        
        employe: user ? user.ematricule : '',
        service: '',
        montant: '',
        dateRemboursementPrime: '',
        dateRemboursementFrais: '',
        remarque: ''
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched, resetForm }) => (
        <View style={styles.container}>
          <View style={styles.topHalf}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-left" size={25} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Demande de Remboursement</Text>
            <TouchableOpacity
              onPress={() => {
                resetForm();
                setFieldValue('dateRemboursementPrime', new Date());
                setFieldValue('dateRemboursementFrais', new Date());
              }}
              style={styles.resetButton}
            >
              <Icon name="repeat" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomHalf}>
            <ScrollView style={styles.scrollView}>
              <View style={styles.formContainer}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Référence</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="tag" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={reference}
                      placeholder="Référence"
                      placeholderTextColor="#999"
                      editable={false} 
                    />
                  </View>
                  {touched.reference && errors.reference && <Text style={styles.errorText}>{errors.reference}</Text>}
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Matricule employé</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="user" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={values.employe}
                      onChangeText={handleChange('employe')}
                      onBlur={handleBlur('employe')}
                      placeholder="Nom de l'employé"
                      placeholderTextColor="#999"
                      editable={false}
                    />
                  </View>
                  {touched.employe && errors.employe && <Text style={styles.errorText}>{errors.employe}</Text>}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Service</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="briefcase" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={values.service}
                      onChangeText={handleChange('service')}
                      onBlur={handleBlur('service')}
                      placeholder="Nom du service"
                      placeholderTextColor="#999"
                    />
                  </View>
                  {touched.service && errors.service && <Text style={styles.errorText}>{errors.service}</Text>}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Montant</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="money" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={values.montant}
                      onChangeText={handleChange('montant')}
                      onBlur={handleBlur('montant')}
                      placeholder="Montant à rembourser"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                    />
                  </View>
                  {touched.montant && errors.montant && <Text style={styles.errorText}>{errors.montant}</Text>}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Date de remboursement prime chantier</Text>
                  <TouchableOpacity 
                    onPress={() => setShowDateRemboursementPrime(true)} 
                    style={styles.datePickerButton}
                  >
                    <Icon name="calendar" size={20} color="#999" style={styles.icon} />
                    <Text style={styles.dateText}>{moment(dateRemboursementPrime).format('LL')}</Text>
                  </TouchableOpacity>
                  {showDateRemboursementPrime && (
                    <DateTimePicker
                      value={dateRemboursementPrime}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        onChangeDateRemboursementPrime(event, selectedDate);
                        setFieldValue('dateRemboursementPrime', selectedDate);
                      }}
                    />
                  )}
                  {touched.dateRemboursementPrime && errors.dateRemboursementPrime && <Text style={styles.errorText}>{errors.dateRemboursementPrime}</Text>}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Date de remboursement frais</Text>
                  <TouchableOpacity 
                    onPress={() => setShowDateRemboursementFrais(true)} 
                    style={styles.datePickerButton}
                  >
                    <Icon name="calendar" size={20} color="#999" style={styles.icon} />
                    <Text style={styles.dateText}>{moment(dateRemboursementFrais).format('LL')}</Text>
                  </TouchableOpacity>
                  {showDateRemboursementFrais && (
                    <DateTimePicker
                      value={dateRemboursementFrais}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        onChangeDateRemboursementFrais(event, selectedDate);
                        setFieldValue('dateRemboursementFrais', selectedDate);
                      }}
                    />
                  )}
                  {touched.dateRemboursementFrais && errors.dateRemboursementFrais && <Text style={styles.errorText}>{errors.dateRemboursementFrais}</Text>}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Remarque</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="comment" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={[styles.input, styles.multilineInput]}
                      value={values.remarque}
                      onChangeText={handleChange('remarque')}
                      onBlur={handleBlur('remarque')}
                      placeholder="Remarque"
                      placeholderTextColor="#999"
                      multiline
                      numberOfLines={5}
                    />
                  </View>
                  {touched.remarque && errors.remarque && <Text style={styles.errorText}>{errors.remarque}</Text>}
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Envoyer</Text>
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
    marginTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bottomHalf: {
    flex: 1,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomRightRadius :40,
    borderBottomLeftRadius :40,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  resetButton: {
    marginLeft: 'auto',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000',
  },
  button: {
    backgroundColor: '#006AB6',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  icon: {
    marginRight: 10,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default DemandeRemboursement;
