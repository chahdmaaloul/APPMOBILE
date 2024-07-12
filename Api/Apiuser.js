import Apimanager from "./Apimanager";

export const user_login = async (data) => {
  try {
    const result = await Apimanager.post("/api/login_check", data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return result;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else {
      console.error("Erreur de connexion :", error);
      throw error;
    }
  }
};
