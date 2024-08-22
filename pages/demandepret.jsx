import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const loans = [
  { id: '1', name: 'Prêt Personnel', amount: '10,000 TND', interest: '5%' },
  { id: '2', name: 'Prêt Immobilier', amount: '100,000 TND', interest: '3%' },
  { id: '3', name: 'Prêt Automobile', amount: '20,000 TND', interest: '4%' },
  // Ajoutez plus de prêts si nécessaire
];

const AvailableLoansScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={styles.loanItem}>
      <Text style={styles.loanName}>{item.name}</Text>
      <Text style={styles.loanDetails}>Montant: {item.amount}</Text>
      <Text style={styles.loanDetails}>Taux d'intérêt: {item.interest}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
       <Text style={styles.subtitle}>Les prets disponible:</Text>
      <FlatList
        data={loans}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    
    </View>
  );
};

export default AvailableLoansScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  list: {
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 16,
  },
  loanItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  loanName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  loanDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    left: '45%',
    transform: [{ translateX: -100 }],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  
    padding: 16,
    backgroundColor: '#4b67a1',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    backgroundColor: '#d4a15f',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom:10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});


