import React from 'react';
import { View, TouchableOpacity, Text, SafeAreaView, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { user_login } from '../Api/Apiuser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get_users } from '../Api/apigetuserscrm';

const Page = () => {
    const navigation = useNavigation();
    const [loadingSignup, setLoadingSignup] = React.useState(false);
    const [loadingLogin, setLoadingLogin] = React.useState(false);

    const handleAutoLogin = async () => {
        setLoadingSignup(true);
        try {
            const result = await user_login({
                username: 'crm',
                password: '123456'
            });

            if (result.status === 200) {
                const token = result.data.token;
                await AsyncStorage.setItem("AccessToken", token);

                const users = await get_users();
                const user = users.find(user => user.username === 'crm');

                if (user) {
                    await AsyncStorage.setItem("UserDetails", JSON.stringify(user));
                   
                    navigation.navigate('Signup'); // Rediriger vers la page d'inscription
                } else {
                    Alert.alert('Erreur', 'Utilisateur non trouvé.');
                }
            } else {
                Alert.alert('Erreur', 'Vérifiez vos coordonnées.');
            }
        } catch (err) {
            console.error('Erreur lors de la connexion :', err);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion.');
        } finally {
            
        }
    };

    const handleAutoLoginForLogin = async () => {
        setLoadingLogin(true);
        try {
            const result = await user_login({
                username: 'crm',
                password: '123456'
            });

            if (result.status === 200) {
                const token = result.data.token;
                await AsyncStorage.setItem("AccessToken", token);

                const users = await get_users();
                const user = users.find(user => user.username === 'crm');

                if (user) {
                    await AsyncStorage.setItem("UserDetails", JSON.stringify(user));
                    
                    navigation.navigate('Login'); // Rediriger vers la page de connexion
                } else {
                    Alert.alert('Erreur', 'Utilisateur non trouvé.');
                }
            } else {
                Alert.alert('Erreur', 'Vérifiez vos coordonnées.');
            }
        } catch (err) {
            console.error('Erreur lors de la connexion :', err);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion.');
        } finally {
           
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topHalf}>
                <Image source={require('../assets/edilogo.png')} />
            </View>
            <View style={styles.bottomHalf}>
                <TouchableOpacity style={styles.button} onPress={handleAutoLoginForLogin}>
                  
                        <Text style={styles.buttonText}>Se connecter</Text>
                        <AntDesign name="arrowright" style={styles.icon} />
                   
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleAutoLogin}>
                    
                        <Text style={styles.buttonText}>S'inscrire</Text>
                        <AntDesign name="arrowright" style={styles.icon} />
                   
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    topHalf: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 150,
    },
    bottomHalf: {
        flex: 2,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 200,
    },
    title: {
        alignItems: 'center',
        fontSize: 23,
        fontWeight: 'bold',
        color: '#051C3B',
        marginLeft: 20,
        marginTop: 10,
    },
    image: {
        width: 500,
        height: 500,
        resizeMode: 'contain',
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#051C3B',
        padding: 15,
        borderRadius: 25,
        marginTop: 20,
        width: '90%',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
    },
    icon: {
        marginLeft: 10,
        color: '#fff',
        fontSize: 20,
    },
});

export default Page;
