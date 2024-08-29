import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Apimaneger from '../Api/Apimanager';
import { UserContext } from '../Api/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const Conge = () => {
  const navigation = useNavigation();
  const [demandes, setDemandes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [expandedDemandeId, setExpandedDemandeId] = useState(null); // Nouvel état pour les détails
  const { user } = useContext(UserContext);
  const [filter, setFilter] = useState('All');
  const [filteredDemandes, setFilteredDemandes] = useState([]);

  const fetchDemandes = async () => {
    try {
      const response = await Apimaneger.get(`/api/v1/GRH/getByType/DC/${user.ematricule}`);
      const sortedDemandes = response.data.sort((a, b) => new Date(b.DateDemande) - new Date(a.DateDemande));
      setDemandes(sortedDemandes);
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDemandes();
    }, [user.ematricule])
  );

  const toggleDetails = (id) => {
    setExpandedDemandeId(expandedDemandeId === id ? null : id);
  };

  const renderDemande = ({ item }) => {
    const { DateDEB, DateFin, DUREE, EtatBP, OBJ, uniqueid,Categorie, Des } = item;
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

    const isExpanded = expandedDemandeId === uniqueid;

    return (
      <View style={styles.upcomingAbsence}>
        <View style={statusContainerStyle}>
          <Icon name={iconName} size={16} color="white" style={styles.statusIcon} />
          <Text style={statusStyle}>{status}</Text>
        </View>
        <Text style={styles.absenceObject}>Type de congé: {OBJ}</Text>
        <Text style={styles.absenceDays}>{DUREE} jours</Text>
        <Text style={styles.absenceDates}>{`${new Date(DateDEB).toLocaleDateString()} - ${new Date(DateFin).toLocaleDateString()}`}</Text>
        
        <TouchableOpacity onPress={() => toggleDetails(uniqueid)} style={styles.detailsButton}>
          <Text>{isExpanded ? '-' : '+'} Détails</Text>
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.detailsContainer}>
            {/* Ajoutez ici les détails supplémentaires */}
            <Text style={styles.detailsText}>service: {Categorie}</Text>
            <Text style={styles.detailsText}>remarque: { Des}</Text>
          </View>
        )}
      </View>
    );
  };

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

  const demandesToShow = showAll ? filteredDemandes : filteredDemandes.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.daysAvailable}>{demandes.length}</Text>
        <Text style={styles.subtitle}>demandes</Text>
        <TouchableOpacity style={styles.requestButton} onPress={() => navigation.navigate('cong')}>
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
      ) : demandesToShow.length > 0 ? (
        <FlatList
          data={demandesToShow}
          renderItem={renderDemande}
          keyExtractor={(item) => item.uniqueid}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noRequests}>Il n'y a aucune demande</Text>
      )}

      <TouchableOpacity
        style={styles.calendarLink}
        onPress={() => setShowAll(!showAll)}
      >
        <Text style={styles.calendarLinkText}>{showAll ? 'Voir moins' : 'Voir tout'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const colors = {
  accepted: '#4CAF50',
  pending: '#FFC107',
  rejected: '#F44336',
};

const styles = StyleSheet.create({
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
  },
  calendarLink: {
    marginTop :10,
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
  list: {
    paddingBottom: 16,
  },
  noRequests: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
    marginTop: 20,
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  filterButton: {
    padding: 8,
    borderRadius: 4,
  },
  filterText: {
    fontSize: 14,
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
  absenceObject: {
    fontSize: 18,
    color: "#1D4B8F",
    marginBottom: 4,
  },
  detailsButton: {
    marginTop: 8,
    alignItems: 'center',
   
  },
  detailsContainer: {
    marginTop: 8,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
  },
  detailsText: {
    fontSize: 14,
    color: 'gray',
  },
});

export default Conge;
