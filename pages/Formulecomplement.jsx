import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView ,KeyboardAvoidingView , Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import 'moment/locale/fr';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Apimaneger from '../Api/Apimanager';
import { UserContext } from '../Api/UserContext';

moment.locale('fr');


const validationSchema = Yup.object().shape({
  employe: Yup.string().required("Le nom de l'employé est requis"),
  service: Yup.string().required("Le nom du service est requis"),
  dateDemande: Yup.date().required('La date de demande est requise'),
  montant: Yup.number().required('Le montant est requis').positive('Le montant doit être positif'),
  totalComplement: Yup.number().required('Le total du complément est requis').positive('Le total du complément doit être positif'),
  typeComplement: Yup.string().required('Le type de complément est requis'),
  remarque: Yup.string(),
});

const DemandeComplement = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [dateDemande, setDateDemande] = useState(new Date());
  const [showDateDemande, setShowDateDemande] = useState(false);
  const [reference, setReference] = useState('');

  useEffect(() => {
    const fetchReference = async () => {
      try {
        const response = await Apimaneger.get('https://cmc.crm-edi.info/paraMobile/api/public/api/v1/GRH/getformat/DCO?page=1');
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

  const onChangeDateDemande = (event, selectedDate, setFieldValue) => {
    const currentDate = selectedDate || dateDemande;
    setShowDateDemande(false);
    setDateDemande(currentDate);
    setFieldValue('dateDemande', currentDate);
  };

  const handleSubmit = async (values, { resetForm }) => {
    let demande = {
      typegrh: 'DCO',
      codetiers: user ? user.ematricule.toString() : '',
      des: values.remarque,
      ref: reference, 
      aup: values.montant,
      datedeb: dateDemande.toISOString(),
      datel: new Date().toISOString(),
      categorie: values.service,
      obj: values.typeComplement,
      etatbp: null,
      MOYDEP:values.totalComplement
    };

    const removeEmptyFields = (obj) => {
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
        setDateDemande(new Date()); 
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
      initialValues={{ employe: user ? user.ematricule : '', service: '', dateDemande: '', montant: '', totalComplement: '', typeComplement: '', remarque: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, resetForm }) => (
        <View style={styles.container}>
          <View style={styles.topHalf}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-left" size={25} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Demande de Complément</Text>
            <TouchableOpacity
              onPress={() => {
                resetForm();
                setDateDemande(new Date()); 
              }}
              style={styles.resetButton}
            >
              <Icon name="refresh" size={25} color="#fff" />
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
                      placeholder="Nom d'utilisateur"
                      placeholderTextColor="#999"
                      editable={false}
                    />
                  </View>
                  {touched.employe && errors.employe && <Text style={styles.errorText}>{errors.employe}</Text>}
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Type de complément</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="list" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={values.typeComplement}
                      onChangeText={handleChange('typeComplement')}
                      onBlur={handleBlur('typeComplement')}
                      placeholder="Type de complément"
                      placeholderTextColor="#999"
                    />
                  </View>
                  {touched.typeComplement && errors.typeComplement && <Text style={styles.errorText}>{errors.typeComplement}</Text>}
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
                  <Text style={styles.label}>Date de demande</Text>
                  <TouchableOpacity onPress={() => setShowDateDemande(true)} style={styles.datePickerButton}>
                    <Icon name="calendar" size={20} color="#999" style={styles.icon} />
                    <Text style={styles.dateText}>{moment(values.dateDemande).format('LL')}</Text>
                  </TouchableOpacity>
                  {showDateDemande && (
                    <DateTimePicker
                      value={values.dateDemande || new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => onChangeDateDemande(event, selectedDate, setFieldValue)}
                    />
                  )}
                  {touched.dateDemande && errors.dateDemande && <Text style={styles.errorText}>{errors.dateDemande}</Text>}
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
                      placeholder="Montant"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                    />
                  </View>
                  {touched.montant && errors.montant && <Text style={styles.errorText}>{errors.montant}</Text>}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Total du complément</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="money" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={values.totalComplement}
                      onChangeText={handleChange('totalComplement')}
                      onBlur={handleBlur('totalComplement')}
                      placeholder="Total du complément"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                    />
                  </View>
                  {touched.totalComplement && errors.totalComplement && <Text style={styles.errorText}>{errors.totalComplement}</Text>}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Remarque</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="comment" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={[styles.input, styles.textarea]}
                      value={values.remarque}
                      onChangeText={handleChange('remarque')}
                      onBlur={handleBlur('remarque')}
                      placeholder="Remarque"
                      placeholderTextColor="#999"
                      multiline
                    />
                  </View>
                  {touched.remarque && errors.remarque && <Text style={styles.errorText}>{errors.remarque}</Text>}
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmit}
                >
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
    paddingBottom: 10,
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
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    marginVertical: 10,
  },
  formGroup: {
    marginBottom: 10,
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
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  icon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: '#006AB6',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: '#333',
  },
});

export default DemandeComplement;
