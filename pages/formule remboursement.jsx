import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

// Validation schema using Yup
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
  const [dateRemboursementPrime, setDateRemboursementPrime] = useState(new Date());
  const [dateRemboursementFrais, setDateRemboursementFrais] = useState(new Date());
  const [showDateRemboursementPrime, setShowDateRemboursementPrime] = useState(false);
  const [showDateRemboursementFrais, setShowDateRemboursementFrais] = useState(false);

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

  return (
    <Formik
      initialValues={{ employe: '', service: '', montant: '', dateRemboursementPrime: '', dateRemboursementFrais: '', remarque: '' }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        console.log('Form Values:', values);
        resetForm(); // Reset form after submission
      }}
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
                  <Text style={styles.label}>Employé</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="user" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={values.employe}
                      onChangeText={handleChange('employe')}
                      onBlur={handleBlur('employe')}
                      placeholder="Nom de l'employé"
                      placeholderTextColor="#999"
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
                  <TouchableOpacity onPress={() => setShowDateRemboursementPrime(true)} style={styles.datePickerButton}>
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
                  <TouchableOpacity onPress={() => setShowDateRemboursementFrais(true)} style={styles.datePickerButton}>
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
                      placeholder="remarque "
                      placeholderTextColor="#999"
                      multiline
                      numberOfLines={5}
                    />
                  </View>
                  {touched.remarque && errors.remarque && <Text style={styles.errorText}>{errors.remarque}</Text>}
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4b67a1',
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
  },
  dateText: {
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#4b67a1',
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
