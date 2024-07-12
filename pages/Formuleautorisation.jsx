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
  employe: Yup.string().required("Le nom de l'employé est requis"),
  service: Yup.string().required("Le nom du service est requis"),
  dateDepart: Yup.date().required('La date de départ est requise'),
  dateRetour: Yup.date()
    .required('La date de retour est requise')
    .min(Yup.ref('dateDepart'), 'La date de retour doit être après la date de départ'),
  heureDepart: Yup.string().required("L'heure de départ est requise"),
  heureRetour: Yup.string().required("L'heure de retour est requise"),
  motif: Yup.string().required('Le motif est requis'),
});

const DemandeAutorisation = () => {
  const navigation = useNavigation();
  const [dateDepart, setDateDepart] = useState(new Date());
  const [dateRetour, setDateRetour] = useState(new Date());
  const [heureDepart, setHeureDepart] = useState('');
  const [heureRetour, setHeureRetour] = useState('');
  const [showDateDepart, setShowDateDepart] = useState(false);
  const [showDateRetour, setShowDateRetour] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChangeDateDepart = (event, selectedDate) => {
    const currentDate = selectedDate || dateDepart;
    setShowDateDepart(false);
    setDateDepart(currentDate);
  };

  const onChangeDateRetour = (event, selectedDate) => {
    const currentDate = selectedDate || dateRetour;
    setShowDateRetour(false);
    setDateRetour(currentDate);
  };

  const onChangeHeureDepart = (selectedTime) => {
    setShowTimePicker(false);
    setHeureDepart(selectedTime);
  };

  const onChangeHeureRetour = (selectedTime) => {
    setShowTimePicker(false);
    setHeureRetour(selectedTime);
  };

  return (
    <Formik
      initialValues={{
        employe: '',
        service: '',
        dateDepart: '',
        dateRetour: '',
        heureDepart: '',
        heureRetour: '',
        motif: '',
      }}
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
            <Text style={styles.title}>Demande d'Autorisation</Text>
            <TouchableOpacity
              onPress={() => {
                resetForm();
                setFieldValue('dateDepart', new Date());
                setFieldValue('dateRetour', new Date());
                setFieldValue('heureDepart', '');
                setFieldValue('heureRetour', '');
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

                <View style={styles.dateTimeGroup}>
                  <View style={styles.dateTimeContainer}>
                    <Text style={styles.label}>Date de départ</Text>
                    <TouchableOpacity onPress={() => setShowDateDepart(true)} style={styles.datePickerButton}>
                      <Icon name="calendar" size={20} color="#999" style={styles.icon} />
                      <Text style={styles.dateText}>{moment(dateDepart).format('LL')}</Text>
                    </TouchableOpacity>
                    {showDateDepart && (
                      <DateTimePicker
                        value={dateDepart}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          onChangeDateDepart(event, selectedDate);
                          setFieldValue('dateDepart', selectedDate);
                        }}
                      />
                    )}
                    {touched.dateDepart && errors.dateDepart && <Text style={styles.errorText}>{errors.dateDepart}</Text>}
                  </View>
                  <View style={styles.dateTimeContainer}>
                    <Text style={styles.label}>Heure de départ</Text>
                    <View style={styles.inputContainer}>
                      <Icon name="clock-o" size={20} color="#999" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        value={values.heureDepart}
                        onChangeText={handleChange('heureDepart')}
                        onBlur={handleBlur('heureDepart')}
                        placeholder="Heure de départ"
                        placeholderTextColor="#999"
                        onFocus={() => setShowTimePicker(true)}
                      />
                    </View>
                    {showTimePicker && (
                      <DateTimePicker
                        value={dateDepart}
                        mode="time"
                        display="default"
                        onChange={(event, selectedTime) => {
                          const formattedTime = moment(selectedTime).format('HH:mm');
                          onChangeHeureDepart(formattedTime);
                          setFieldValue('heureDepart', formattedTime);
                        }}
                      />
                    )}
                    {touched.heureDepart && errors.heureDepart && <Text style={styles.errorText}>{errors.heureDepart}</Text>}
                  </View>
                </View>

                <View style={styles.dateTimeGroup}>
                  <View style={styles.dateTimeContainer}>
                    <Text style={styles.label}>Date de retour</Text>
                    <TouchableOpacity onPress={() => setShowDateRetour(true)} style={styles.datePickerButton}>
                      <Icon name="calendar" size={20} color="#999" style={styles.icon} />
                      <Text style={styles.dateText}>{moment(dateRetour).format('LL')}</Text>
                    </TouchableOpacity>
                    {showDateRetour && (
                      <DateTimePicker
                        value={dateRetour}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          onChangeDateRetour(event, selectedDate);
                          setFieldValue('dateRetour', selectedDate);
                        }}
                      />
                    )}
                    {touched.dateRetour && errors.dateRetour && <Text style={styles.errorText}>{errors.dateRetour}</Text>}
                  </View>
                  <View style={styles.dateTimeContainer}>
                    <Text style={styles.label}>Heure de retour</Text>
                    <View style={styles.inputContainer}>
                      <Icon name="clock-o" size={20} color="#999" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        value={values.heureRetour}
                        onChangeText={handleChange('heureRetour')}
                        onBlur={handleBlur('heureRetour')}
                        placeholder="Heure de retour"
                        placeholderTextColor="#999"
                        onFocus={() => setShowTimePicker(true)}
                      />
                    </View>
                    {showTimePicker && (
                      <DateTimePicker
                        value={dateRetour}
                        mode="time"
                        display="default"
                        onChange={(event, selectedTime) => {
                          const formattedTime = moment(selectedTime).format('HH:mm');
                          onChangeHeureRetour(formattedTime);
                          setFieldValue('heureRetour', formattedTime);
                        }}
                      />
                    )}
                    {touched.heureRetour && errors.heureRetour && <Text style={styles.errorText}>{errors.heureRetour}</Text>}
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Motif</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="comment" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                      value={values.motif}
                      onChangeText={handleChange('motif')}
                      onBlur={handleBlur('motif')}
                      placeholder="Motif de la demande"
                      placeholderTextColor="#999"
                      multiline
                      numberOfLines={4}
                    />
                  </View>
                  {touched.motif && errors.motif && <Text style={styles.errorText}>{errors.motif}</Text>}
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
    paddingBottom: 10,
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
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    marginVertical: 10,
  },
  formGroup: {
    marginBottom: 20,
  },
  dateTimeGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20, // Ajout de marge inférieure pour séparer les groupes de date et d'heure
  },
  dateTimeContainer: {
    flex: 1,
    width: '48%', // Largeur fixe pour aligner les champs de date et d'heure
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  datePickerButton: {
    flexDirection:'column',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  icon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: '#4b67a1',
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
});

export default DemandeAutorisation;
