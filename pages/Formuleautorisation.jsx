import React, { useState, useContext ,useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView ,KeyboardAvoidingView , Platform} from 'react-native';
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
  employe: Yup.string().required("Le nom de l'employé est requis"),
  service: Yup.string().required("Le nom du service est requis"),
  dateDepart: Yup.date().required('La date de départ est requise'),
  dateRetour: Yup.date()
    .required('La date de retour est requise')
    .min(Yup.ref('dateDepart'), 'La date de retour doit être après la date de départ'),
  heureDepart: Yup.string().required("L'heure de départ est requise"),
  heureRetour: Yup.string().required("L'heure de retour est requise"),
 
});

const DemandeAutorisation = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [dateDepart, setDateDepart] = useState(new Date());
  const [dateRetour, setDateRetour] = useState(new Date());
  const [heureDepart, setHeureDepart] = useState('');
  const [heureRetour, setHeureRetour] = useState('');
  const [showDateDepart, setShowDateDepart] = useState(false);
  const [showDateRetour, setShowDateRetour] = useState(false);
  const [showTimePickerDepart, setShowTimePickerDepart] = useState(false);
  const [showTimePickerRetour, setShowTimePickerRetour] = useState(false);
  const [reference, setReference] = useState('');

  useEffect(() => {
    const fetchReference = async () => {
      try {
        const response = await Apimaneger.get('https://cmc.crm-edi.info/paraMobile/api/public/api/v1/GRH/getformat/DA?page=1');
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

  const onChangeHeureDepart = (event, selectedTime) => {
    const formattedTime = moment(selectedTime).format('HH:mm');
    setShowTimePickerDepart(false);
    setHeureDepart(formattedTime);
  };

  const onChangeHeureRetour = (event, selectedTime) => {
    const formattedTime = moment(selectedTime).format('HH:mm');
    setShowTimePickerRetour(false);
    setHeureRetour(formattedTime);
  };

  const handleSubmitForm = async (values, { resetForm }) => {
    const diffTime = Math.abs(dateRetour - dateDepart);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    let demande = {
      typegrh: 'DA',
      codetiers: user.ematricule.toString(), 
      des: values.motif,
      duree: diffDays.toString(),
      datedeb: dateDepart.toISOString(),
      datefin: dateRetour.toISOString(),
      heurdeb: heureDepart.toString(),
      heurfin: heureRetour.toString(),
      datel: new Date().toISOString(),
      datec: new Date().toISOString(),
      categorie: values.service,
     etatp:"",
      ref: reference,
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
        setDateDepart(new Date());
        setDateRetour(new Date());
        setHeureDepart('');
        setHeureRetour('');
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

  const removeEmptyFields = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null && v !== ''));
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
        dateDepart: '',
        dateRetour: '',
        heureDepart: '',
        heureRetour: '',
        motif: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmitForm}
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
                  
                  <Text style={styles.label}>Référence</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="tag" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={reference}
                      placeholder="Référence"
                      placeholderTextColor="#999"
                      editable={false} // Non éditable
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
                    <TouchableOpacity onPress={() => setShowTimePickerDepart(true)} style={styles.datePickerButton}>
                      <Icon name="clock-o" size={20} color="#999" style={styles.icon} />
                      <Text style={styles.dateText}>{heureDepart || 'HH:mm'}</Text>
                    </TouchableOpacity>
                    {showTimePickerDepart && (
                      <DateTimePicker
                        value={dateDepart}
                        mode="time"
                        display="default"
                        onChange={(event, selectedTime) => {
                          onChangeHeureDepart(event, selectedTime);
                          setFieldValue('heureDepart', moment(selectedTime).format('HH:mm'));
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
                    <TouchableOpacity onPress={() => setShowTimePickerRetour(true)} style={styles.datePickerButton}>
                      <Icon name="clock-o" size={20} color="#999" style={styles.icon} />
                      <Text style={styles.dateText}>{heureRetour || 'HH:mm'}</Text>
                    </TouchableOpacity>
                    {showTimePickerRetour && (
                      <DateTimePicker
                        value={dateRetour}
                        mode="time"
                        display="default"
                        onChange={(event, selectedTime) => {
                          onChangeHeureRetour(event, selectedTime);
                          setFieldValue('heureRetour', moment(selectedTime).format('HH:mm'));
                        }}
                      />
                    )}
                    {touched.heureRetour && errors.heureRetour && <Text style={styles.errorText}>{errors.heureRetour}</Text>}
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Motif</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="pencil" size={20} color="#999" style={styles.icon} />
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
});

export default DemandeAutorisation;
