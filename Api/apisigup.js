import Apimanager from './Apimanager';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const user_signup = async (userData) => {
  try {
    const token = await AsyncStorage.getItem('AccessToken');
    
    if (!token) {
      throw new Error('Token d\'accès non trouvé');
    }

    const result = await Apimanager.post('/api/v1/crm_users', userData, {
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
