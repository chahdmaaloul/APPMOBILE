import Apimanager from './Apimanager';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const user_byid = async (userid) => {
  try {
    // Récupérer le token d'accès depuis AsyncStorage
    const token = await AsyncStorage.getItem('AccessToken');
    
    if (!token) {
      throw new Error('Token d\'accès non trouvé');
    }

    // Effectuer la requête avec le token dans les headers
    const result = await Apimanager.patch('/api/v1/crm_users/{id}', userid, {
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
