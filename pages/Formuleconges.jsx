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
  typeConge: Yup.string().required('Le type de congé est requis'),
  dateDebut: Yup.date().required('La date de début est requise'),
  dateFin: Yup.date()
    .required('La date de fin est requise')
    .min(Yup.ref('dateDebut'), 'La date de fin doit être après la date de début'),
  service: Yup.string().required('Le nom du service est requis'),
  remarque: Yup.string(),
});

const DemandeConge = () => {
  const navigation = useNavigation();
  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(new Date());
  const [showDateDebut, setShowDateDebut] = useState(false);
  const [showDateFin, setShowDateFin] = useState(false);

  const onChangeDateDebut = (event, selectedDate) => {
    const currentDate = selectedDate || dateDebut;
    setShowDateDebut(false);
    setDateDebut(currentDate);
  };

  const onChangeDateFin = (event, selectedDate) => {
    const currentDate = selectedDate || dateFin;
    setShowDateFin(false);
    setDateFin(currentDate);
  };

  return (
    <Formik
      initialValues={{ employe: '', typeConge: '', dateDebut: '', dateFin: '', service: '', remarque: '' }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        // Calculate the number of days of leave
        const diffTime = Math.abs(dateFin - dateDebut);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        console.log('Form Values:', { ...values, nombreJours: diffDays });
        resetForm(); // Reset form after submission
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched, resetForm }) => (
        <View style={styles.container}>
          <View style={styles.topHalf}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-left" size={25} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Demande de Congé</Text>
            <TouchableOpacity
              onPress={() => {
                resetForm();
                setFieldValue('dateDebut', new Date());
                setFieldValue('dateFin', new Date());
              }}
              style={styles.resetButton}
            >
              <Icon name="refresh" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomHalf}>
            <ScrollView style={styles.scrollView}>
              <View style={styles.zone}>
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

                <Text style={styles.label}>Type de congé</Text>
                <View style={styles.inputContainer}>
                  <Icon name="calendar" size={20} color="#999" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    value={values.typeConge}
                    onChangeText={handleChange('typeConge')}
                    onBlur={handleBlur('typeConge')}
                    placeholder="Type de congé"
                    placeholderTextColor="#999"
                  />
                </View>
                {touched.typeConge && errors.typeConge && <Text style={styles.errorText}>{errors.typeConge}</Text>}

                <View style={styles.row}>
                  <View style={styles.column}>
                    <Text style={styles.label}>DU</Text>
                    <TouchableOpacity onPress={() => setShowDateDebut(true)} style={styles.datePickerButton}>
                      <Icon name="calendar" size={20} color="#999" style={styles.icon} />
                      <Text style={styles.dateText}>{moment(dateDebut).format('LL')}</Text>
                    </TouchableOpacity>
                    {showDateDebut && (
                      <DateTimePicker
                        value={dateDebut}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          onChangeDateDebut(event, selectedDate);
                          setFieldValue('dateDebut', selectedDate);
                        }}
                      />
                    )}
                    {touched.dateDebut && errors.dateDebut && <Text style={styles.errorText}>{errors.dateDebut}</Text>}
                  </View>

                  <View style={styles.column}>
                    <Text style={styles.label}>AU INCLUS</Text>
                    <TouchableOpacity onPress={() => setShowDateFin(true)} style={styles.datePickerButton}>
                      <Icon name="calendar" size={20} color="#999" style={styles.icon} />
                      <Text style={styles.dateText}>{moment(dateFin).format('LL')}</Text>
                    </TouchableOpacity>
                    {showDateFin && (
                      <DateTimePicker
                        value={dateFin}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          onChangeDateFin(event, selectedDate);
                          setFieldValue('dateFin', selectedDate);
                        }}
                      />
                    )}
                    {touched.dateFin && errors.dateFin && <Text style={styles.errorText}>{errors.dateFin}</Text>}
                  </View>
                </View>

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

                <View style={styles.formGroup}>
                  <Text style={styles.label}>MOTIF</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="comment" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={[styles.input, styles.multilineInput]}
                      value={values.remarque}
                      onChangeText={handleChange('Motif de la demande')}
                      onBlur={handleBlur('Motif de la demande')}
                      placeholder="Motif de la demande "
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
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
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
  zone: {
    flex: 1,
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
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#4b67a1',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
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
});

export default DemandeConge;
