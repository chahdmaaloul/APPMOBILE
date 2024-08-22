import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Aide</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView style={styles.suggestionsContainer}>
        <TouchableOpacity style={styles.suggestion}>
          <Text style={styles.suggestionText}>Changer l'image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.suggestion}>
          <Text style={styles.suggestionText}>Problème de demande</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.suggestion}>
          <Text style={styles.suggestionText}>Autres problèmes</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Impossible d'envoyer une demande</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  suggestionsContainer: {
    flex: 1,
    padding: 10,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  suggestionText: {
    fontSize: 16,
  },
  footer: {
    padding: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HelpPage;
