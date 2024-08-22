import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SectionList, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/AntDesign';
import Apimaneger from '../Api/Apimanager';
const defaultImage = require('../assets/PROF.jpg'); // Image par défaut

const ContactsScreen = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // Ajouter l'état refreshing
  const listRef = useRef(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchQuery, employees]);

  const fetchEmployees = async () => {
    try {
      setRefreshing(true); // Commencez le rafraîchissement
      const response = await Apimaneger.get('/api/v1/crm_users');
      setEmployees(response.data);
      setFilteredEmployees(sortEmployeesAlphabetically(response.data));
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setRefreshing(false); // Terminer le rafraîchissement
    }
  };

  const filterEmployees = () => {
    const query = searchQuery.toLowerCase();
    const filtered = employees.filter(
      (employee) =>
        employee.username.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query)
    );
    setFilteredEmployees(sortEmployeesAlphabetically(filtered));
  };

  const sortEmployeesAlphabetically = (employeesList) => {
    if (!employeesList || employeesList.length === 0) return [];

    const grouped = employeesList.reduce((acc, employee) => {
      const firstLetter = employee.username[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(employee);
      return acc;
    }, {});

    const sections = Object.keys(grouped)
      .sort()
      .map((letter) => ({
        title: letter,
        data: grouped[letter],
      }));

    return sections;
  };

  const renderItem = ({ item }) => (
    <View style={styles.employeeContainer}>
      <Image source={item.image ? { uri: item.image } : defaultImage} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.username}</Text>
        <Text style={styles.email}>{item.email}</Text>
        
      </View>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.circle}>
        <Text style={styles.sectionHeaderText}>{title}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>EMPLOYEES</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchIconContainer}>
          <Icon name="search1" size={24} color="#4b67a1" />
        </TouchableOpacity>
      </View>
      <SectionList
        ref={listRef}
        sections={filteredEmployees.length > 0 ? filteredEmployees : []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        onRefresh={fetchEmployees} // Relier la fonction de rafraîchissement
        refreshing={refreshing} // Utiliser l'état refreshing pour indiquer le statut
        style={{ flex: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006AB6',
  },
  topHalf: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#006AB6',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 0,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    margin: 10,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
    color: '#4b67a1',
  },
  searchIconContainer: {
    backgroundColor: '#fff',
  },
  employeeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#777',
  },
  sectionHeader: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  circle: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888',
  },
});

export default ContactsScreen;
