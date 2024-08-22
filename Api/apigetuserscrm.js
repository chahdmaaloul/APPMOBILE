import Apimanager from "./Apimanager";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const get_users = async () => {
  const token = await AsyncStorage.getItem('AccessToken');
    
  if (!token) {
    throw new Error('Token d\'accès non trouvé');
  }

  try {
    const response = await Apimanager.get("/api/v1/crm_users");
    return response.data; // Retourne les données de la réponse
  } catch (error) {
    if (error.response) {
      return error.response.data; // Retourne les données d'erreur de la réponse
    } else {
      console.error("Erreur de connexion :", error);
      throw error;
    }
  }
};
