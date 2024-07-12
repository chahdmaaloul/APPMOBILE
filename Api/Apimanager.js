import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiurl = "https://cmc.crm-edi.info/paraMobile/api/public";

const Apimaneger = axios.create({
  baseURL: apiurl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur Axios pour ajouter le token d'authentification à chaque requête
Apimaneger.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("AccessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Apimaneger;
