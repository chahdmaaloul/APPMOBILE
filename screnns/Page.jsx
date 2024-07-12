import React from 'react';
import { View, TouchableOpacity, Text, SafeAreaView, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

const Page = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topHalf}>
                <Image source={require('../assets/edilogo.png')}  />
               
            </View>
            <View style={styles.bottomHalf}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.buttonText}>Se connecter</Text>
                    <AntDesign name="arrowright"style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.buttonText}>S'inscrire</Text>
                    <AntDesign name="arrowright"style={styles.icon} />
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


  

 



