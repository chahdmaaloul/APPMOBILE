
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Apimaneger from '../Api/Apimanager';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ManagerDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('tout');
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
    if (filter === 'tout') return demande.etatbp === null || demande.etatbp === undefined; 
    return demande.typegrh.trim() === filter && (demande.etatbp === null || demande.etatbp === undefined); 
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
            <Text style={styles.requestPerson}>Matricule employé: {demande.codetiers ? demande.codetiers.trim() : 'Code tiers manquant'}</Text>
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
            <Text style={styles.requestPerson}>Matricule employé: {demande.codetiers ? demande.codetiers.trim() : 'Code tiers manquant'}</Text>
            <Text style={styles.requestDate}>Date: {demande.datedeb ? demande.datedeb.split('T')[0] : 'Date début manquante'} / {demande.datefin ? demande.datefin.split('T')[0] : 'Date fin manquante'}</Text>
            <Text style={styles.requestDuration}>Durée: {demande.nbrejour || 'Nbre jours manquant'}</Text>
            <Text style={styles.requestDescription}>Motif: {demande.des || 'Description manquante'}</Text>
            <Text style={styles.requestCategory}>Service: {demande.categorie || 'Service manquant'}</Text>
          </>
        )}
        {demande.typegrh.trim() === 'DCO' && (
          <>
            <Text style={styles.requestHeader}>DEMANDE DE COMPLÉMENT</Text>
            <Text style={styles.requestPerson}>Matricule employé: {demande.codetiers ? demande.codetiers.trim() : 'Code tiers manquant'}</Text>
            <Text style={styles.requestTitle}>Type Complément: {demande.obj || 'Objet manquant'}</Text>
            <Text style={styles.requestDate}>Date de demande: {demande.datedeb ? demande.datedeb.split('T')[0] : 'Date début manquante'}</Text>
            <Text style={styles.requestAup}>Montant: {demande.aup || 'AUP manquant'}</Text>
            <Text style={styles.requestCategory}>Service: {demande.categorie || 'Service manquant'}</Text>
            <Text style={styles.requestComplement}>Total Complément: {demande.ref || 'Total manquant'}</Text>
            <Text style={styles.requestDescription}>Remarque: {demande.des || 'Description manquante'}</Text>
          </>
        )}
        {demande.typegrh.trim() === 'DR' && (
          <>
            <Text style={styles.requestHeader}>DEMANDE DE REMBOURSEMENT</Text>
            <Text style={styles.requestPerson}>Matricule employé: {demande.codetiers ? demande.codetiers.trim() : 'Code tiers manquant'}</Text>
            <Text style={styles.requestDate}>Date: {demande.datedeb ? demande.datedeb.split('T')[0] : 'Date début manquante'} / {demande.datefin ? demande.datefin.split('T')[0] : 'Date fin manquante'}</Text>
            <Text style={styles.requestAup}>Montant: {demande.aup || 'AUP manquant'}</Text>
            <Text style={styles.requestRate}>Taux: {demande.ref || 'Taux manquant'}</Text>
            <Text style={styles.requestCategory}>Service: {demande.categorie || 'Service manquant'}</Text>
            <Text style={styles.requestDuration}>Mensualité: {demande.moydep || 'Mensualité manquante'}</Text>
            <Text style={styles.requestDescription}>Remarque: {demande.des || 'Description manquante'}</Text>
          </>
        )}
        {demande.typegrh.trim() === 'DP' && (
          <>
            <Text style={styles.requestHeader}>DEMANDE DE PRÊT</Text>
            <Text style={styles.requestPerson}>Nom employé: {demande.codetiers ? demande.codetiers.trim() : 'Code tiers manquant'}</Text>
            <Text style={styles.requestDate}>Date: {demande.datedeb ? demande.datedeb.split('T')[0] : 'Date début manquante'} / {demande.datefin ? demande.datefin.split('T')[0] : 'Date fin manquante'}</Text>
            <Text style={styles.requestDuration}>Durée: {demande.nbrejour || 'Nbre jours manquant'}</Text>
            <Text style={styles.requestTitle}>Objet: {demande.obj || 'Objet manquant'}</Text>
            <Text style={styles.requestAup}>Montant: {demande.aup || 'AUP manquant'}</Text>
            <Text style={styles.requestCategory}>Service: {demande.categorie || 'Service manquant'}</Text>
            <Text style={styles.requestDescription}>Remarque: {demande.des || 'Description manquante'}</Text>
          </>
        )}
      </>
    );
  };
  const updateDemande = async (demande, etat) => {
    try {
      const response = await Apimaneger.put(`/api/v1/grhs/${demande.uniqueid}`, { etatbp: etat });
      console.log(`Demande mise à jour avec succès: ${response.data}`);

      // Remove the demande from the state after update
      setDemandes(prevDemandes => prevDemandes.filter(d => d.uniqueid !== demande.uniqueid));
    } catch (error) {
      console.error('Error updating demande:', error);
    }
  };

  const handleRefuse = (demande) => {
    updateDemande(demande, false);
  };

  const handleValidate = (demande) => {
    updateDemande(demande, true);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAllDemandes().then(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container}>
      {/* Other UI elements */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      <View style={styles.section}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.cardItem} onPress={() => navigation.navigate('equipe')}>
            <View style={styles.cardItemContent}>
              <Ionicons name="people-outline" size={24} color="black" style={styles.teamIcon} />
              <Text style={styles.cardTitle}>Employees</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="black" />
          </TouchableOpacity>
          
        </View>
      </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>À VALIDER</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{filteredDemandes.length}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('voir')}>
              <Text style={styles.viewMore}>VOIR PLUS</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
  {[
    { key: 'tout', label: 'Tout' },
    { key: 'DC', label: 'D. Congé' },
    { key: 'DA', label: 'D. Autorisation' },
    { key: 'DCO', label: 'D. Complément' },
    { key: 'DR', label: 'D. Remboursement' },
    { key: 'DP', label: 'D. Prêt' },
  ].map(({ key, label }) => (
    <TouchableOpacity
      key={key}
      style={[styles.filterButton, filter === key && styles.activeFilterButton]}
      onPress={() => setFilter(key)}
    >
      <Text style={styles.filterText}>{label}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>

          {loading ? (
            <ActivityIndicator size="large" color="#E65A46" />
          ) : (
            filteredDemandes.length === 0 ? (
              <Text style={styles.noDataText}>Aucune demande trouvée</Text>
            ) : (
              <ScrollView>
                {filteredDemandes.map((demande, index) => (
                  <View key={index} style={styles.requestContainer}>
                    {formatDemandeDetails(demande)}
                    {(demande.etatbp !== true && demande.etatbp !== false) && (
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.refuseButton} onPress={() => handleRefuse(demande)}>
                          <Text style={styles.refuseButtonText}>Refuser</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.validateButton} onPress={() => handleValidate(demande)}>
                          <Text style={styles.validateButtonText}>Valider</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
    // Styles inchangés
    container: {
      flex: 1,
      backgroundColor: '#f8f8f8',
      paddingHorizontal: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    filterScroll: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    filterButton: {
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#ccc',
      borderRadius: 10,
      marginHorizontal: 5,
    },
    activeFilterButton: {
      backgroundColor: '#E65A46',
    },
    filterText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    section: {
      marginBottom: 20,
    },
    card: {
    marginTop:20,
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
    },
    cardItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: 18,
      marginLeft: 10,
    },
    teamIcon: {
      marginRight: 10,
    },
    addButton: {
      backgroundColor: '#E65A46',
      borderRadius: 10,
      paddingVertical: 15,
      alignItems: 'center',
      marginTop: 20,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    sectionTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    badge: {
      backgroundColor: '#E65A46',
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginLeft: 8,
    },
    badgeText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    viewMore: {
      color: '#E65A46',
      fontSize: 16,
      fontWeight: 'bold',
    },
    noDataText: {
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
    },
    requestCard: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 15,
      marginRight: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    
  
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    refuseButton: {
      backgroundColor: '#f44336',
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    refuseButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    validateButton: {
      backgroundColor: '#4caf50',
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    validateButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    requestContainer: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 15,
      marginRight: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginBottom: 15,
    },
    requestCard: {
      backgroundColor: '#F2F2F2',
      padding: 15,
      marginBottom: 10,
      borderRadius: 10,
    },
    requestHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
      textAlign: 'center',
      color: '#333',
    },
    requestPerson: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      textAlign: 'center',
      color: '#333',
    },
    requestTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#333',
    },
    requestDate: {
      fontSize: 14,
      color: '#666',
      marginBottom: 5,
    },
    requestDuration: {
      fontSize: 14,
      color: '#666',
      marginBottom: 5,
    },
    requestCategory: {
      fontSize: 14,
      color: '#666',
      marginBottom: 5,
    },
    requestDescription: {
      fontSize: 14,
      color: '#666',
      marginBottom: 5,
    },
    requestAup: {
      fontSize: 14,
      color: '#666',
      marginBottom: 5,
    },
    requestComplement: {
      fontSize: 14,
      color: '#666',
      marginBottom: 5,
    },
    requestRate: {
      fontSize: 14,
      color: '#666',
      marginBottom: 5,
    },
    noDataText: {
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
      color: '#E65A46',
    },
  
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
    },
    accepted: {
      color: 'green',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    rejected: {
      color: 'red',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    pending: {
      color: 'orange',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },
  });