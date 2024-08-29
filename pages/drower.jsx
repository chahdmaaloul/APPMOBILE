import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://example.com/user_image.png' }} 
          style={styles.profileImage}
        />
        <Text style={styles.userName}>Milan Shrestha</Text>
        <Text style={styles.userRole}>Detailed ABC Dealer State</Text>
        <TouchableOpacity>
          <Text style={styles.editProfileLink}>Completez votre profile</Text>
        </TouchableOpacity>
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity onPress={() => alert('Déconnexion')} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}