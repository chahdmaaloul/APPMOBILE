import React, { useMemo, useEffect, forwardRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import Apimaneger from '../Api/Apimanager';
import { useUser } from '../Api/UserContext';

const NotificationSheet = forwardRef((props, ref) => {
  const { user } = useUser(); 
  const [notifications, setNotifications] = useState([]);
  const snapPoints = useMemo(() => ['25%', '90%'], []);

  const closeBottomSheet = () => {
    ref.current?.close();
  };


  const fetchNotifications = async () => {
    if (!user || !user.ematricule) {
      console.error('Matricule de l\'utilisateur non trouvé');
      return;
    }

    try {
      const response = await Apimaneger.get(`/api/v1/GRH/Manager/getByType/${user.ematricule}`);
      const notificationsData = response.data;

      setNotifications(notificationsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications :', error);
    }
  };

 
  useEffect(() => {
    fetchNotifications();
  }, [user]); 

  const renderNotification = ({ item }) => (
    <View style={styles.notification}>
      <Text style={styles.notificationText}>{item.message}</Text>
    </View>
  );

  return (
    <BottomSheetModal ref={ref} index={1} snapPoints={snapPoints}>
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Notifications</Text>
          <TouchableOpacity onPress={closeBottomSheet}>
            <Text style={styles.okText}>OK</Text>
          </TouchableOpacity>
        </View>
        {notifications.length === 0 ? (
          <View style={styles.noNotifications}>
            <Text style={styles.noNotificationsText}>Il n'y a pas de Notifications</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.flatListContent}
          />
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  okText: {
    fontSize: 16,
    color: '#007AFF',
  },
  flatListContent: {
    paddingHorizontal: 20,
  },
  notification: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  notificationText: {
    marginTop: 4,
    marginBottom: 4,
  },
  noNotifications: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noNotificationsText: {
    fontSize: 18,
    color: '#888',
  },
});

export default NotificationSheet;
