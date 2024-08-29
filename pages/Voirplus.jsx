import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Apimaneger from '../Api/Apimanager';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { AntDesign } from '@expo/vector-icons';
export default function AcceptedRejectedRequests() {
  const [refreshing, setRefreshing] = useState(false);
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('accepté'); 
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        setLoading(true);
        const response = await Apimaneger.get(`api/v1/grhs`);
        console.log('Données récupérées:', response.data); 
        setDemandes(response.data);
      } catch (error) {
        console.error('Error fetching demandes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDemandes();
  }, []);

  useEffect(() => {
    console.log('Demandes:', demandes);
    console.log('Filtre:', filter);
  }, [demandes, filter]);

  const filteredDemandes = demandes.filter(demande => {
    if (!demande.typegrh) return false;
    if (filter === 'accepté') return demande.etatbp === true; 
    if (filter === 'refusé') return demande.etatbp === false; 
    return false;
  });

  const formatDemandeDetails = (demande) => {
    let etatText = 'En attente'; 
    let etatStyle = styles.pending; 
    let etatIcon = 'hourglass-half'; 
  
    if (demande.etatbp === true) {
      etatText = 'Accepté';
      etatStyle = styles.accepted;
      etatIcon = 'check-circle'; 
    } else if (demande.etatbp === false) {
      etatText = 'Refusé';
      etatStyle = styles.rejected;
      etatIcon = 'times-circle'; 
    }
  
    return (
      <>
        <View style={styles.statusContainer}>
          <Icon name={etatIcon} size={20} color={etatStyle.color} />
          <Text style={etatStyle}>{etatText}</Text>
        </View>
        {demande.typegrh.trim() === 'DC' && (
          <>
            <Text style={styles.requestHeader}>DEMANDE DE CONGE</Text>
            <Text style={styles.requestPerson}>Nom employé: {demande.codetiers ? demande.codetiers.trim() : 'Code tiers manquant'}</Text>
            <Text style={styles.requestTitle}>Type de congé: {demande.obj || 'Objet manquant'}</Text>
            <Text style={styles.requestDate}>Date: {demande.datedeb ? demande.datedeb.split('T')[0] : 'Date début manquante'} / {demande.datefin ? demande.datefin.split('T')[0] : 'Date fin manquante'}</Text>
            <Text style={styles.requestDuration}>Durée: {demande.nbrejour || 'Nbre jours manquant'}</Text>
            <Text style={styles.requestCategory}>Service: {demande.categorie || 'Service manquant'}</Text>
            <Text style={styles.requestDescription}>Description: {demande.des || 'Description manquante'}</Text>
          </>
        )}
        {demande.typegrh.trim() === 'DA' && (
          <>
            <Text style={styles.requestHeader}>DEMANDE D'AUTORISATION</Text>
            <Text style={styles.requestPerson}>Nom employé: {demande.codetiers ? demande.codetiers.trim() : 'Code tiers manquant'}</Text>
            <Text style={styles.requestDate}>Date: {demande.datedeb ? demande.datedeb.split('T')[0] : 'Date début manquante'} / {demande.datefin ? demande.datefin.split('T')[0] : 'Date fin manquante'}</Text>
            <Text style={styles.requestDuration}>Durée: {demande.nbrejour || 'Nbre jours manquant'}</Text>
            <Text style={styles.requestDescription}>Motif: {demande.des || 'Description manquante'}</Text>
            <Text style={styles.requestCategory}>Service: {demande.categorie || 'Service manquant'}</Text>
          </>
        )}
        {demande.typegrh.trim() === 'DCO' && (
          <>
            <Text style={styles.requestHeader}>DEMANDE DE COMPLÉMENT</Text>
            <Text style={styles.requestPerson}>Nom employé: {demande.codetiers ? demande.codetiers.trim() : 'Code tiers manquant'}</Text>
            <Text style={styles.requestTitle}>Type Complément: {demande.obj || 'Objet manquant'}</Text>
            <Text style={styles.requestDate}>Date de demande: {demande.datedeb ? demande.datedeb.split('T')[0] : 'Date début manquante'}</Text>
            <Text style={styles.requestAup}>Montant: {demande.aup || 'AUP manquant'}</Text>
            <Text style={styles.requestCategory}>Service: {demande.categorie || 'Service manquant'}</Text>
            <Text style={styles.requestComplement}>Total Complément: {demande.ref || 'Total manquant'}</Text>
            <Text style={styles.requestDescription}>Remarque: {demande.des || 'Description manquante'}</Text>
          </>
        )}
      </>
    );
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAllDemandes();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.drawerButton}>
      <AntDesign name="close" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={filter === 'accepté' ? styles.selectedFilter : styles.filterButton}
          onPress={() => setFilter('accepté')}
        >
          <Text style={filter === 'accepté' ? styles.selectedFilterText : styles.filterText}>Accepté</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={filter === 'refusé' ? styles.selectedFilter : styles.filterButton}
          onPress={() => setFilter('refusé')}
        >
          <Text style={filter === 'refusé' ? styles.selectedFilterText : styles.filterText}>Refusé</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#E65A46" />
      ) : (
        filteredDemandes.length === 0 ? (
          <Text style={styles.noDataText}>Aucune demande trouvée</Text>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {filteredDemandes.map((demande, index) => (
              <View key={index} style={styles.requestContainer}>
                {formatDemandeDetails(demande)}
              </View>
            ))}
          </ScrollView>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: 
  {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  drawerButton: {
    marginTop:50,
    padding: 10,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#FFF',
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
  },
  selectedFilter: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#E65A46',
  },
  filterText: {
    color: '#000',
  },
  selectedFilterText: {
    color: '#FFF',
  },
  requestContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pending: {
    color: '#FFBF00',
    fontSize: 16,
  },
  accepted: {
    color: '#4CAF50',
    fontSize: 16,
  },
  rejected: {
    color: '#F44336',
    fontSize: 16,
  },
  requestHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  requestPerson: {
    marginBottom: 5,
  },
  requestTitle: {
    marginBottom: 5,
  },
  requestDate: {
    marginBottom: 5,
  },
  requestDuration: {
    marginBottom: 5,
  },
  requestCategory: {
    marginBottom: 5,
  },
  requestDescription: {
    marginBottom: 5,
  },
  requestAup: {
    marginBottom: 5,
  },
  requestComplement: {
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  refuseButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
  },
  validateButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  refuseButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  validateButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#757575',
  },
});
