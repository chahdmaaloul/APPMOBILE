import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { Easing, useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

const SplashScreen = () => {
  const navigation = useNavigation();
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Animation d'entrée
    opacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.quad),
    });

    const timeout = setTimeout(() => {
      // Animation de sortie
      opacity.value = withTiming(0, {
        duration: 1000,
        easing: Easing.out(Easing.quad),
      });

      setTimeout(() => {
        navigation.replace('Login'); // Remplacez 'Login' par le nom de votre composant de page de connexion
      }, 1000);
    }, 3000); // Temps d'attente de 3 secondes

    return () => clearTimeout(timeout); // Nettoyage du timeout
  }, [navigation, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Image source={require('../assets/logocomplet.png')}  />
      <ActivityIndicator size="large" color="#d3d3d3" style={styles.loader} />
    
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
  },
  loader: {
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#d3d3d3',
  },
  buttonText: {
    color: '#fff',
  },
});

export default SplashScreen;
