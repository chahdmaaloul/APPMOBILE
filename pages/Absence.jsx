import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import Apimaneger from '../Api/Apimanager';
import { useUser } from '../Api/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const AbsencePage = () => {
  const [demandes, setDemandes] = useState([]);
  const [monthlyAbsences, setMonthlyAbsences] = useState({});
  const [loading, setLoading] = useState(false);
  const [noDemandesMessage, setNoDemandesMessage] = useState("");
  const [expandedMonths, setExpandedMonths] = useState(new Set());
  const { user } = useUser();

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        setLoading(true);
        const response = await Apimaneger.get(`api/v1/grhs`);
        console.log('Données récupérées:', response.data); // Vérifiez la structure des données ici
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
    if (user) {
      const filtered = demandes
        .filter(demande =>
          demande.typegrh && demande.codetiers &&
          (demande.typegrh.trim() === 'DC' || demande.typegrh.trim() === 'DA') &&
          demande.etatbp === true &&
          demande.codetiers.trim() === user.ematricule
        )
        .map(demande => {
          const startDate = new Date(demande.datedeb);
          const endDate = new Date(demande.datefin);
          const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // Calcul de la durée en jours
          return {
            datedeb: demande.datedeb,
            datefin: demande.datefin,
            duree: duration
          };
        });

      const monthlyTotals = {};
      for (let i = 1; i <= 12; i++) {
        monthlyTotals[i] = { total: 0, details: [] };
      }

      filtered.forEach(demande => {
        const month = new Date(demande.datedeb).getMonth() + 1; // Mois (1-12)
        monthlyTotals[month].total += demande.duree;
        monthlyTotals[month].details.push(demande);
      });

      setMonthlyAbsences(monthlyTotals);

      if (Object.keys(monthlyTotals).length === 0) {
        setNoDemandesMessage("Aucune absence trouvée.");
      } else {
        setNoDemandesMessage("");
      }
    }
  }, [demandes, user]);

  const toggleMonthDetails = (month) => {
    setExpandedMonths(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(month)) {
        newExpanded.delete(month);
      } else {
        newExpanded.add(month);
      }
      return newExpanded;
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.monthText}>Mois: {item.month}</Text>
      <Text style={styles.totalDaysText}>Total des jours: {item.totalDays} jours</Text>
      <TouchableOpacity onPress={() => toggleMonthDetails(item.month)} style={styles.toggleButton}>
        <Icon name={expandedMonths.has(item.month) ? 'minus' : 'plus'} size={20} color="orange" />
        <Text style={styles.toggleButtonText}>
          {expandedMonths.has(item.month) ? 'Moins' : 'Plus'}
        </Text>
      </TouchableOpacity>
      {expandedMonths.has(item.month) && (
        <FlatList
          data={monthlyAbsences[item.month].details}
          renderItem={renderDetailItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );

  const renderDetailItem = ({ item }) => (
    <View style={styles.detailItem}>
      <Text style={styles.detailText}>Date début: {item.datedeb}</Text>
      <Text style={styles.detailText}>Date fin: {item.datefin}</Text>
      <Text style={styles.detailText}>Durée: {item.duree} jours</Text>
    </View>
  );

  const monthlyAbsenceData = Object.keys(monthlyAbsences).map(month => ({
    month: parseInt(month, 10),
    totalDays: monthlyAbsences[month].total
  }));

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="small" color="orange" />
      ) : (
        <>
          <Text style={styles.headerText}>Résumé des absences par mois :</Text>

          {noDemandesMessage ? (
            <Text style={styles.noDemandesMessage}>{noDemandesMessage}</Text>
          ) : (
            <FlatList
              data={monthlyAbsenceData}
              renderItem={renderItem}
              keyExtractor={(item) => item.month.toString()}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  item: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  detailItem: {
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4b67a1',
  },
  monthText: {
    fontSize: 18,
    color: "#1D4B8F",
    marginBottom: 4,
  },
  totalDaysText: {
    fontSize: 14,
    color: '#555',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  toggleButtonText: {
    fontSize: 14,
    color: 'orange',
    marginLeft: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  noDemandesMessage: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AbsencePage;
