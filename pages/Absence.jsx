import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import moment from 'moment';

const AbsenceTracker = () => {
  const [absences, setAbsences] = useState([]);
  const [weeklyAbsences, setWeeklyAbsences] = useState(0);
  const [monthlyAbsences, setMonthlyAbsences] = useState(0);
  const [quarterlyAbsences, setQuarterlyAbsences] = useState(0);
  const [yearlyAbsences, setYearlyAbsences] = useState(0);

  useEffect(() => {
    // Remplacez l'URL par l'endpoint de votre API
    axios.get('https://api.example.com/absences')
      .then(response => {
        setAbsences(response.data);
        calculateAbsences(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des absences:', error);
      });
  }, []);

  const calculateAbsences = (data) => {
    const now = moment();
    const startOfWeek = now.clone().startOf('week');
    const startOfMonth = now.clone().startOf('month');
    const startOfQuarter = now.clone().startOf('quarter');
    const startOfYear = now.clone().startOf('year');

    let weeklyCount = 0;
    let monthlyCount = 0;
    let quarterlyCount = 0;
    let yearlyCount = 0;

    data.forEach(absence => {
      const absenceDate = moment(absence.date);

      if (absenceDate.isAfter(startOfWeek)) weeklyCount++;
      if (absenceDate.isAfter(startOfMonth)) monthlyCount++;
      if (absenceDate.isAfter(startOfQuarter)) quarterlyCount++;
      if (absenceDate.isAfter(startOfYear)) yearlyCount++;
    });

    setWeeklyAbsences(weeklyCount);
    setMonthlyAbsences(monthlyCount);
    setQuarterlyAbsences(quarterlyCount);
    setYearlyAbsences(yearlyCount);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Suivi des absences</Text>
      <View style={styles.absenceContainer}>
        <Text style={styles.absenceLabel}>Absences cette semaine:</Text>
        <Text style={styles.absenceCount}>{weeklyAbsences}</Text>
      </View>
      <View style={styles.absenceContainer}>
        <Text style={styles.absenceLabel}>Absences ce mois-ci:</Text>
        <Text style={styles.absenceCount}>{monthlyAbsences}</Text>
      </View>
      <View style={styles.absenceContainer}>
        <Text style={styles.absenceLabel}>Absences ce trimestre:</Text>
        <Text style={styles.absenceCount}>{quarterlyAbsences}</Text>
      </View>
      <View style={styles.absenceContainer}>
        <Text style={styles.absenceLabel}>Absences cette année:</Text>
        <Text style={styles.absenceCount}>{yearlyAbsences}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  absenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 5,
    elevation: 2,
  },
  absenceLabel: {
    fontSize: 18,
  },
  absenceCount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AbsenceTracker;
