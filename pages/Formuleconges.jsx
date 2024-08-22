import React, { useState, useEffect, useContext } from 'react';
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
  const { user } = useContext(UserContext);
  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(new Date());
  const [showDateDebut, setShowDateDebut] = useState(false);
  const [showDateFin, setShowDateFin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState('');

  useEffect(() => {
    const fetchReference = async () => {
      try {
        const response = await Apimaneger.get('https://cmc.crm-edi.info/paraMobile/api/public/api/v1/GRH/getformat/DC?page=1');
        const data = response.data;
        if (data.length > 0 && data[0]['']) {
          setReference(data[0]['']); // Remplir la référence automatiquement
        } else {
          console.error('Aucune référence trouvée dans la réponse.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la référence:', error);
      }
    };

    fetchReference();
  }, []);

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

  const removeEmptyFields = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null && v !== ''));
  };

  const handleSubmitForm = async (values, { resetForm }) => {
    setLoading(true);
    const diffTime = Math.abs(dateFin - dateDebut);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const demande = {
      typegrh: 'DC',
      codetiers: user.ematricule.toString(),
      obj: values.typeConge,
      datedeb: dateDebut.toISOString(),
      datefin: dateFin.toISOString(),
      nbrejour: diffDays.toString(),
      duree: diffDays.toString(),
      datel: new Date().toISOString(),
      datec: new Date().toISOString(),
      categorie: values.service,
      etatbp: "",
      etatbp1: "",
      des: values.remarque,
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
        setDateDebut(new Date());
        setDateFin(new Date());
        setLoading(false);
        navigation.goBack();
      } else {
        console.log("Erreur lors de l'envoi de la demande", response.status);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande:", error.message);
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
        typeConge: '',
        dateDebut: '',
        dateFin: '',
        service: '',
        remarque: ''
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmitForm}
      enableReinitialize={true}  // Ajouter cette ligne pour réinitialiser les valeurs lors de la récupération de la référence
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
                    <Text style={styles.label}>AU</Text>
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
                  <Icon name="building" size={20} color="#999" style={styles.icon} />
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

                <Text style={styles.label}>Remarque</Text>
                <View style={styles.inputContainer}>
                  <Icon name="pencil" size={20} color="#999" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    value={values.remarque}
                    onChangeText={handleChange('remarque')}
                    onBlur={handleBlur('remarque')}
                    placeholder="Ajouter une remarque"
                    placeholderTextColor="#999"
                    multiline
                  />
                </View>
                {touched.remarque && errors.remarque && <Text style={styles.errorText}>{errors.remarque}</Text>}

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
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
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
    backgroundColor: '#006AB6',
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
