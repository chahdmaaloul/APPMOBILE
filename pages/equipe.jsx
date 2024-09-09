import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SectionList, TextInput, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/AntDesign';
import Apimaneger from '../Api/Apimanager';
import { Swipeable } from 'react-native-gesture-handler';

const defaultImage = require('../assets/PROF.jpg');

const ContactsScreen = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchQuery, employees]);

  const fetchEmployees = async () => {
    try {
      setRefreshing(true);
      const response = await Apimaneger.get('/api/v1/crm_users');

      if (response && response.data && Array.isArray(response.data)) {
        console.log('Fetched employees:', response.data);
        setEmployees(response.data);
        setFilteredEmployees(sortEmployeesAlphabetically(response.data));
      } else {
        console.error('Unexpected API response:', response);
        Alert.alert('Error', 'Unexpected API response. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const confirmDeleteEmployee = (id) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cet employé?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => handleDeleteEmployee(id),
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteEmployee = async (id) => {
    if (!id) {
      console.error('Invalid employee ID:', id);
      Alert.alert('Error', 'Invalid employee ID.');
      return;
    }

    try {
      const response = await Apimaneger.delete(`/api/v1/crm_users/${id}`);
      console.log('API response after delete:', response);

      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== id)
      );

      setFilteredEmployees((prevFilteredEmployees) =>
        sortEmployeesAlphabetically(
          prevFilteredEmployees.filter((employee) => employee.id !== id)
        )
      );

      Alert.alert('Success', 'Employee deleted successfully.');
    } catch (error) {
      console.error('Error deleting employee:', error.message);
      Alert.alert('Error', 'Could not delete employee. Please try again.');
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
    if (!employeesList || !employeesList.length) return [];

    const grouped = employeesList.reduce((acc, employee) => {
      if (!employee || !employee.username) return acc; // Safety check

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

  const renderItem = ({ item }) => {
    if (!item || !item.id || !item.username || !item.email) {
      console.warn('Undefined or incomplete item:', item);
      return null;
    }

    return (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item.id)
        }
      >
        <View style={styles.employeeContainer}>
          <Image
            source={item.image ? { uri: item.image } : defaultImage}
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text style={styles.name}>{item.username}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
        </View>
      </Swipeable>
    );
  };

  const renderRightActions = (progress, dragX, id) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDeleteEmployee(id)}
      >
        <Icon name="delete" size={30} color="#fff" />
      </TouchableOpacity>
    );
  };

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
          placeholder="rechercher "
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
        onRefresh={fetchEmployees}
        refreshing={refreshing}
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
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    backgroundColor: '#ff3b30',
  },
});

export default ContactsScreen;
