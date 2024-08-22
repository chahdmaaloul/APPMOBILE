import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Apimaneger from '../Api/Apimanager';
import { UserContext } from '../Api/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const Autorisation = () => {
  const navigation = useNavigation();
  const [demandes, setDemandes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredDemandes, setFilteredDemandes] = useState([]);
  const [filter, setFilter] = useState('All');
  const [displayedDemandes, setDisplayedDemandes] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [expandedDemandeId, setExpandedDemandeId] = useState(null); // État pour gérer les demandes développées
  const { user } = useContext(UserContext);

  const fetchDemandes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await Apimaneger.get(`/api/v1/GRH/getByType/DA/${user.ematricule}`);
      console.log("Données reçues de l'API:", response.data);
      setDemandes(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user.ematricule]);

  useFocusEffect(
    useCallback(() => {
      fetchDemandes();
    }, [fetchDemandes])
  );

  useEffect(() => {
    console.log("Demandes avant filtrage:", demandes);
    const filtered = demandes.filter(demande => {
      // Convertir EtatBP en nombre pour la comparaison
      const etatBP = parseInt(demande.EtatBP, 10);

      if (filter === 'All') return true;
      if (filter === 'Acceptée' && etatBP === 1) return true; // Changer ici pour Acceptée
      if (filter === 'En attente' && isNaN(etatBP)) return true;
      if (filter === 'Refusée' && etatBP === 0) return true; // Changer ici pour Refusée
      return false;
    });

    console.log("Demandes filtrées:", filtered);
    setFilteredDemandes(filtered);
  }, [demandes, filter]);

  useEffect(() => {
    setDisplayedDemandes(showAll ? filteredDemandes : filteredDemandes.slice(0, 3));
  }, [filteredDemandes, showAll]);

  const toggleDetails = (id) => {
    setExpandedDemandeId(expandedDemandeId === id ? null : id);
  };

  const renderDemande = ({ item }) => {
    const { uniqueid, DateDEB, DateFin, DUREE, EtatBP, HeurDeb, HeurFin, Des ,Categorie} = item;
    
    console.log("DateDEB:", DateDEB); // Ajoutez ceci pour vérifier les valeurs
    console.log("DateFin:", DateFin);
    const etatBP = parseInt(EtatBP, 10);
    let status = '';
    let statusStyle = styles.absenceStatus;
    let statusContainerStyle = styles.statusContainer;
    let iconName = '';
  
    if (etatBP === 0) {
      status = 'Refusée'; // Changer ici pour Refusée
      statusContainerStyle = { ...styles.statusContainer, backgroundColor: '#F44336' };
      iconName = 'times';
    } else if (etatBP === 1) {
      status = 'Acceptée'; // Changer ici pour Acceptée
      statusContainerStyle = { ...styles.statusContainer, backgroundColor: '#4CAF50' };
      iconName = 'check';
    } else {
      status = 'En attente';
      statusContainerStyle = { ...styles.statusContainer, backgroundColor: '#FFC107' };
      iconName = 'hourglass-half';
    }
  
    // Convert date strings to Date objects
    const dateDeb = new Date(DateDEB);
    const dateFin = new Date(DateFin);
    
    // Combine date with time to create Date objects for time display
    const heureDeb = new Date(`${dateDeb.toDateString()} ${HeurDeb}`);
    const heureFin = new Date(`${dateDeb.toDateString()} ${HeurFin}`);
  
    return (
      <View style={styles.upcomingAbsence}>
        <View style={statusContainerStyle}>
          <Icon name={iconName} size={16} color="white" style={styles.statusIcon} />
          <Text style={statusStyle}>{status}</Text>
        </View>
        <Text style={styles.absenceDays}>{DUREE} jours</Text>
        <Text style={styles.absenceDates}>{`${dateDeb.toLocaleDateString()} - ${dateFin.toLocaleDateString()}`}</Text>
        <Text style={styles.absenceDates}>{`${heureDeb.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${heureFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</Text>

        {/* Bouton pour afficher ou masquer les détails supplémentaires */}
        <TouchableOpacity onPress={() => toggleDetails(uniqueid)} style={styles.detailsButton}>
          <Text>{expandedDemandeId === uniqueid ? '-' : '+'} Détails</Text>
        </TouchableOpacity>

        {/* Affichage des détails supplémentaires si la demande est développée */}
        {expandedDemandeId === uniqueid && (
          <View style={styles.detailsContainer}>
           <Text style={styles.detailsText}>service: {Categorie}</Text>
           <Text style={styles.detailsText}>remarque: { Des}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.daysAvailable}>{demandes.length}</Text>
        <Text style={styles.subtitle}>demandes</Text>
        <TouchableOpacity style={styles.requestButton} onPress={() => navigation.navigate('auto')}>
          <Text style={styles.requestButtonText}>+ Faire une demande</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Historique des demandes</Text>

      <View style={styles.filterContainer}>
        {['All', 'Acceptée', 'En attente', 'Refusée'].map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterButton, filter === f && styles.activeFilter]}
          >
            <View style={styles.dotContainer}>
              {f === 'Acceptée' && <View style={styles.greenDot} />}
              {f === 'En attente' && <View style={styles.orangeDot} />}
              {f === 'Refusée' && <View style={styles.redDot} />}
              <Text style={styles.filterText}>{f}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <Text>Chargement...</Text>
      ) : displayedDemandes.length > 0 ? (
        <FlatList
          data={displayedDemandes}
          renderItem={renderDemande}
          keyExtractor={(item) => item.uniqueid}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noRequests}>Il n'y a aucune demande</Text>
      )}

      <TouchableOpacity
        style={styles.calendarLink}
        onPress={() => setShowAll(prev => !prev)}
      >
        <Text style={styles.calendarLinkText}>{showAll ? 'Voir moins' : 'Voir tout'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  absenceObject: {
    fontSize: 18,  
    color: "#1D4B8F",  
    marginBottom: 4, 
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  daysAvailable: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 16,
  },
  requestButton: {
    backgroundColor: '#5b67b1',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  upcomingAbsence: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  absenceStatus: {
    fontSize: 12,
    marginBottom: 8,
    color: 'white',
  },
  absenceDays: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  absenceDates: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#ddd',
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'green',
    marginRight: 8,
  },
  orangeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'orange',
    marginRight: 8,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
  },
  list: {
    paddingBottom: 16,
  },
  noRequests: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },
  calendarLink: {
    width: 100,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center', 
    paddingVertical: 15,
    borderRadius: 25,
    alignSelf: 'center', 
  },
  calendarLinkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  detailsButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  detailsContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  detailsText: {
    fontSize: 14,
    color: '#333',
  },
  statusContainer: {
    borderRadius: 8,
    padding: 4,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  statusIcon: {
    marginRight: 8,
  },
});

export default Autorisation;
