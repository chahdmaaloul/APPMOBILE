import React, { useState, useContext , useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,KeyboardAvoidingView , Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import Apimaneger from '../Api/Apimanager';
import { UserContext } from '../Api/UserContext';


const validationSchema = Yup.object().shape({
  employe: Yup.string().required('Le nom de l\'employé est requis'),
  service: Yup.string().required('Le nom du service est requis'),
  montant: Yup.number().typeError('Le montant doit être un nombre').required('Le montant est requis').min(1, 'Le montant doit être supérieur à 0'),
  objet: Yup.string().required('L\'objet du prêt est requis'),
  mensualite: Yup.number().typeError('La mensualité doit être un nombre').required('La mensualité est requise').min(1, 'La mensualité doit être supérieure à 0'),
  taux: Yup.number().typeError('Le taux doit être un nombre').required('Le taux est requis').min(0, 'Le taux doit être supérieur ou égal à 0'),
  dateDebut: Yup.date().required('La date de début est requise'),
  dateFin: Yup.date().required('La date de fin est requise').min(Yup.ref('dateDebut'), 'La date de fin doit être après la date de début'),
  remarque: Yup.string(),
});


const DemandePret = () => {
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
        const response = await Apimaneger.get('https://cmc.crm-edi.info/paraMobile/api/public/api/v1/GRH/getformat/DP?page=1');
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

  const handleSubmitForm = async (values, { resetForm }) => {
    setLoading(true);
    const diffTime = Math.abs(dateFin - dateDebut);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    let demande = {
      typegrh: 'DP',
      codetiers: user.ematricule.toString(), 
      des: values.remarque,
      duree: diffDays.toString(),
      datedeb: dateDebut.toISOString(),
      datefin: dateFin.toISOString(),
      nbrejour: diffDays.toString(),
      datel: new Date().toISOString(),
      datec: new Date().toISOString(),
      categorie: values.service,
      aup: values.montant,
      obj: values.objet,
      moydep: values.mensualite,
      ref: reference,
      etatbp:"null",
    };
    console.log(demande); 

    try {
      const response = await Apimaneger.post('/api/v1/grhs', demande, {
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
      if (error.response) {
        console.error("Erreur lors de l'envoi de la demande:", error.response.data);
      } else if (error.request) {
        console.error("Erreur lors de l'envoi de la demande:", error.request);
      } else {
        console.error("Erreur lors de l'envoi de la demande:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={1}
  >
    <Formik
    
      initialValues={{ reference: '',employe: user ? user.ematricule : '', service: '', montant: '', objet: '', mensualite: '', taux: '', dateDebut: '', dateFin: '', remarque: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmitForm}
    >
    
      {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched, resetForm }) => (
        <View style={styles.container}>
          <View style={styles.topHalf}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-left" size={25} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Demande de Prêt</Text>
            <TouchableOpacity
              onPress={() => {
                resetForm();
                setFieldValue('dateDebut', new Date());
                setFieldValue('dateFin', new Date());
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
                      placeholder="Montant du prêt"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                    />
                  </View>
                  {touched.montant && errors.montant && <Text style={styles.errorText}>{errors.montant}</Text>}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Objet du prêt</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="book" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={values.objet}
                      onChangeText={handleChange('objet')}
                      onBlur={handleBlur('objet')}
                      placeholder="Objet du prêt"
                      placeholderTextColor="#999"
                    />
                  </View>
                  {touched.objet && errors.objet && <Text style={styles.errorText}>{errors.objet}</Text>}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Mensualité</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="credit-card" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={values.mensualite}
                      onChangeText={handleChange('mensualite')}
                      onBlur={handleBlur('mensualite')}
                      placeholder="Mensualité"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                    />
                  </View>
                  {touched.mensualite && errors.mensualite && <Text style={styles.errorText}>{errors.mensualite}</Text>}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Taux</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="percent" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={values.taux}
                      onChangeText={handleChange('taux')}
                      onBlur={handleBlur('taux')}
                      placeholder="Taux d'intérêt"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                    />
                  </View>
                  {touched.taux && errors.taux && <Text style={styles.errorText}>{errors.taux}</Text>}
                </View>

                <View style={styles.dateTimeGroup}>
                  <View style={styles.dateTimeContainer}>
                    <Text style={styles.label}>Date de début</Text>
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
                  <View style={styles.dateTimeContainer}>
                    <Text style={styles.label}>Date de fin</Text>
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


                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Remarque</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="comment" size={20} color="#999" style={styles.icon} />
                    <TextInput
                      style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                      value={values.remarque}
                      onChangeText={handleChange('remarque')}
                      onBlur={handleBlur('remarque')}
                      placeholder="Remarque"
                      placeholderTextColor="#999"
                      multiline
                      numberOfLines={4}
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
  },
  dateTimeContainer: {
    flex: 1,
    marginBottom: 20,
    width: '48%',  // Ajustement de la largeur pour aligner les champs de date de début et de fin
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
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 16,
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

export default DemandePret;
