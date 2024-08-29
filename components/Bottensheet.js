import React, {
  useMemo,
  forwardRef,
  useState,
  useRef,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import Apimaneger from '../Api/Apimanager';
import { UserContext } from '../Api/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const Bottensheet = forwardRef((props, ref) => {
  const snapPoints = useMemo(() => ['25%', '90%'], []);
  const defaultImage = require('../assets/PROF.jpg');
  const [file, setFile] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [headerText, setHeaderText] = useState('Profile');
  const [modificationInProgress, setModificationInProgress] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const { user } = useContext(UserContext);

  const fetchDemandes = useCallback(async () => {
    try {
      const response = await Apimaneger.get(`/api/v1/employees/${user.ematricule}`);
      setUserDetails(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
    }
  }, [user.ematricule]);

  useFocusEffect(
    useCallback(() => {
      fetchDemandes();
    }, [fetchDemandes])
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission refusée',
        "Désolé, nous avons besoin de l'autorisation d'accéder à votre bibliothèque de photos pour charger des images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      setFile(selectedImageUri);
      uploadImage(selectedImageUri);
    }
  };

  const uploadImage = async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        name: 'profile.jpg',
        type: 'image/jpeg'
      });

      const response = await Apimaneger.post('api/v1/media_objects', formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        console.log('Image uploaded successfully:', response.data.contentUrl);
      } else {
        console.log('Failed to upload image:', response.status);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const closeBottomSheet = () => {
    if (isEditable) {
      Alert.alert(
        'Modification en cours',
        "Vous n'avez pas terminé la modification. Voulez-vous continuer sans enregistrer ?",
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Continuer',
            onPress: () => {
              setIsEditable(false);
              setModificationInProgress(false);
              ref.current?.close();
            },
          },
        ]
      );
    } else {
      ref.current?.close();
    }
  };

  const toggleEditable = () => {
    setIsEditable(!isEditable);
    setHeaderText(isEditable ? 'Profile' : 'Modifier le profil');
    setModificationInProgress(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    // Entrance animation removed
  }, []);

  return (
    <BottomSheetModal ref={ref} index={1} snapPoints={snapPoints}>
      <BottomSheetView style={lightStyles.contentContainer}>
        <View style={lightStyles.header}>
          <Text style={lightStyles.headerText}>{headerText}</Text>
          <TouchableOpacity onPress={closeBottomSheet}>
            <Text style={lightStyles.okText}>OK</Text>
          </TouchableOpacity>
        </View>
        <View style={lightStyles.profile}>
          <TouchableOpacity onPress={pickImage}>
            <Image source={file ? { uri: file } : defaultImage} style={lightStyles.avatar} />
            <View style={lightStyles.cameraIcon}>
              <TouchableOpacity onPress={pickImage}>
                <Icon name="camera" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
        <View style={lightStyles.STYLE}>
          <View style={lightStyles.option}>
            <Icon name="user" size={24} color="#006AB6" />
            <View style={lightStyles.textContainer}>
              <Text style={lightStyles.label}>Nom utilisateur</Text>
              <TextInput
                value={user.username}
                style={lightStyles.value}
                placeholder="Nom utilisateur"
                placeholderTextColor="#888"
                editable={isEditable}
              />
            </View>
          </View>
          <View style={lightStyles.option}>
            <Icon name="mail" size={24} color="#006AB6" />
            <View style={lightStyles.textContainer}>
              <Text style={lightStyles.label}>Email</Text>
              <TextInput
                value={user.email}
                style={lightStyles.value}
                placeholder="Email"
                placeholderTextColor="#888"
                keyboardType="email-address"
                editable={isEditable}
              />
            </View>
          </View>
          <View style={lightStyles.option}>
            <Icon name="calendar" size={24} color="#006AB6" />
            <View style={lightStyles.textContainer}>
              <Text style={lightStyles.label}>Date de naissance</Text>
              <TextInput
                value={formatDate(userDetails.edatenaiss)}
                style={lightStyles.value}
                placeholder="Date de naissance"
                placeholderTextColor="#888"
                editable={isEditable}
              />
            </View>
          </View>
          <View style={lightStyles.option}>
            <Icon name="idcard" size={24} color="#006AB6" />
            <View style={lightStyles.textContainer}>
              <Text style={lightStyles.label}>CIN</Text>
              <TextInput
                value={userDetails.ecin}
                style={lightStyles.value}
                placeholder="CIN"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
                editable={isEditable}
              />
            </View>
          </View>
          <View style={lightStyles.option}>
            <FontAwesome name="tv" size={24} color="#006AB6" />
            <View style={lightStyles.textContainer}>
              <Text style={lightStyles.label}>Fonction</Text>
              <TextInput
                value={userDetails.efonction}
                style={lightStyles.value}
                placeholder="Fonction"
                placeholderTextColor="#888"
                editable={isEditable}
              />
            </View>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const lightStyles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  okText: {
    fontSize: 18,
    color: '#006AB6',
  },
  profile: {
    alignItems: 'center',
    marginTop: 16,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 60, // Ensure the image is circular
    borderWidth: 3,
    borderColor: '#006AB6', // Match the border color with icon color
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    padding: 8,
  },
  STYLE: {
    padding: 15,
    marginTop: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 10,
    justifyContent: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
});

export default Bottensheet;
