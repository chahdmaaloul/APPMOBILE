import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Suivi = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Historique des demandes</Text>
      <ScrollView style={styles.scrollView}>
       
        
        <View style={styles.requestItem}>
          <Text style={styles.requestTitle}>pret personnel</Text>
          <Text style={styles.requestDate}>25 juin 2023 {'>'} 30 juin 2024</Text>
          <Text style={[styles.requestStatus, styles.approved]}>Validé</Text>
        </View>
      </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
    marginBottom: 16,
  },
  requestItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  requestDate: {
    fontSize: 14,
    color: 'gray',
  },
  requestStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  inProgress: {
    color: 'orange',
    backgroundColor: 'rgba(255,165,0,0.1)',
  },
  refused: {
    color: 'red',
    backgroundColor: 'rgba(255,0,0,0.1)',
  },
  approved: {
    color: 'green',
    backgroundColor: 'rgba(0,128,0,0.1)',
  },
  button: {
    backgroundColor: '#d4a15f',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Suivi;
