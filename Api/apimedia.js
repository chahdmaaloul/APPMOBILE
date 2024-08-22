import Apimanager from './Apimanager';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const user_signup = async (userData) => {
  try {
    // Récupérer le token d'accès depuis AsyncStorage
    const token = await AsyncStorage.getItem('AccessToken');
    
    if (!token) {
      throw new Error('Token d\'accès non trouvé');
    }

    // Effectuer la requête avec le token dans les headers
    const result = await Apimanager.post('​/api​/v1​/media_objects', usermedia
        , {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    return result;
  } catch (error) {
    console.error("Erreur d'inscription :", error);
    throw error;
  }
};
