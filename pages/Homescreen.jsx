import React, { useRef, useState, useEffect, useCallback,useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Dimensions, RefreshControl,ActivityIndicator,FlatList, } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

import { AntDesign, FontAwesome } from '@expo/vector-icons'; // Import FontAwesome
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Conge from './Demandecongee';
import Autorisation from './DemandeAutorisation';
import Complement from './Demandecomplement';
import LoansTabs from './LoansTabs';
import Rembourcement from './Demanderemboursement';
import SettingsScreen from './settings';
import ManagerDashboard from './panager';
import AbsenceTracker from './Absence';
import Bottensheet from '../components/Bottensheet';
import { useUser } from '../Api/UserContext';
import Carousel from 'react-native-snap-carousel-new';
import NotificationSheet from '../components/bottennotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Apimaneger from '../Api/Apimanager';
import AbsencePage from './Absence';

const { width: screenWidth } = Dimensions.get('window'); 

const carouselItems = [
  { title: 'Demande de congé', icon: 'calendar', backgroundColor: '#F15A24', route: 'Demande de conge' },
  { title: 'Demande d\'autorisation', icon: 'idcard', backgroundColor: '#00A651', route: 'Demandes d\'autorisation' },
  { title: 'Demande de complément', icon: 'pluscircle', backgroundColor: '#F7941D', route: 'Demandes de complément' },
  { title: 'Demande de remboursement', icon: 'sync', backgroundColor: '#006AB6', route: 'Demandes de remboursement' },
  { title: 'Demande de prêt', icon: 'profile', backgroundColor: '#006838', route: 'Demandes de prêt' },
  { title: 'Suivi des absences', icon: 'clockcircleo', backgroundColor: '#F37520', route: 'Suivi des absences' },
];

const CarouselItem = ({ item, navigate }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={[styles.carouselItem, { backgroundColor: item.backgroundColor }]}
        onPress={() => navigate(item.route)}
      >
        <AntDesign name={item.icon} size={40} color="white" />
        <Text style={styles.carouselItemText}>{item.title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ListItem = ({ item }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000, // Durée de l'animation en millisecondes
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={[styles.card, { backgroundColor: item.color }]}>
        <View style={styles.cardContent}>
          <Icon name={item.icon} size={24} color={item.iconColor} />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardValue}>{item.value}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.cardButton}>
          <FontAwesome name="plus" size={24} color="#777" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};


function PageHome({ navigation }) {
  const { user } = useUser();
  const [currentDate, setCurrentDate] = useState('');
  const [items, setItems] = useState([]);
  const carouselRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await Apimaneger.get(`/api/v1/GRH/Dashboard/${user.ematricule}`);
      setItems(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données du tableau de bord:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user.ematricule]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData().finally(() => setRefreshing(false));
  }, [user.ematricule]);

  useEffect(() => {
    const updateDate = () => {
      const today = new Date();
      const formattedDate = today.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setCurrentDate(formattedDate);
    };

    updateDate();
    const interval = setInterval(updateDate, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.topHalf}>
        <View style={styles.headerContainer}>
          <Text style={styles.greetingText}>Salut, {user ? user.username : 'Utilisateur'}!</Text>
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Rechercher"
            style={styles.searchInput}
            onChangeText={(text) => console.log(text)}
          />
          <TouchableOpacity style={styles.searchIconContainer}>
            <AntDesign name="search1" size={24} color="#4b67a1" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomHalf}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Demandes</Text>
        </View>
        <View style={styles.carouselContainer}>
          <Carousel
            ref={carouselRef}
            data={carouselItems}
            renderItem={({ item }) => (
              <CarouselItem key={item.title} item={item} navigate={navigation.navigate} />
            )}
            sliderWidth={screenWidth - 40}
            itemWidth={160}
            inactiveSlideOpacity={0.5}
            layout={"default"}
            enableSnap={true}
            enableMomentum={false}
            inactiveSlideScale={0.8}
            activeSlideAlignment={"center"}
          />
        </View>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
        </View>
        <FlatList
  data={items}
  renderItem={({ item }) => <ListItem item={item} />}
  keyExtractor={(item) => item.title} 
  contentContainerStyle={styles.list}
/>

      
      </View>
    </ScrollView>
  );
}

const Drawer = createDrawerNavigator(); //  Drawer here
const CustomDrawerContent = (props) => {
  const modalRef = useRef(null);

  const navigation = useNavigation();
  const { user } = useUser();
  const [profileImage, setProfileImage] = useState(require('../assets/PROF.jpg'));

  const handleLogout = async () => {
    await AsyncStorage.removeItem("AccessToken");
    await AsyncStorage.removeItem("UserDetails");
    navigation.replace('Login');;
  };

  const openBottensheet = () => {
    modalRef?.current?.present();
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage({ uri: result.uri });
    }
  };

  return (
    <>
      <DrawerContentScrollView {...props}>
        <View style={styles.profileContainer}>
          <Image
            source={profileImage}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.settingsButton} onPress={openBottensheet}>
          <AntDesign name="setting" size={25} color="#000" />
          </TouchableOpacity>
          <Text style={styles.profileName}>{user ? user.username : 'Nom utilisateur'}</Text>
          <Text style={styles.profileEmail}>{user ? user.email : 'email@example.com'}</Text>
        </View>
        <DrawerItemList {...props} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Déconnecter</Text>
        </TouchableOpacity>
        <Bottensheet ref={modalRef} userDetails={user} />
      </DrawerContentScrollView>
    </>
  );
};

function LogoTitle() {
  return (
    <Image
      style={{ width: 70, height: 70, borderRadius: 40 }}
      source={require('../assets/logocomplet.png')}
    />
  );
}
const NotificationIcon = ({ openNotificationSheet }) => {
  return (
    <TouchableOpacity onPress={openNotificationSheet}>
      <AntDesign name="bells" size={24} color="black" style={{ marginRight: 15 }} />
    </TouchableOpacity>
  );
};

function HomeScreen() {
  const notificationRef = useRef(null);

  const openNotificationSheet = () => {
    notificationRef?.current?.present();
  };
  const {user} = useUser();
  const hasManagerRole = user?.roles.includes('ROLE_MANAGER');
  
  return (
    <BottomSheetModalProvider>
      <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}
       screenOptions={{
        drawerStyle: {
          width: 275, 
        },
        drawerType: 'slide', 
        overlayColor: 'rgba(0, 0, 0, 0.5)', 
      }}
    >
        <Drawer.Screen
          name="PageHome"
          component={PageHome}
          options={{
            drawerLabel: 'Accueil',
            drawerIcon: ({ color, size }) => (
              <AntDesign name="home" size={size} color={color} />
            ),
            headerTitle: (props) => <LogoTitle {...props} />,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 15,
              fontWeight: 'bold',
              color: '#4b67a1',
            },
            headerStyle: {
              borderBottomWidth: 0, 
              backgroundColor: '#f5f5f5', 
            },
            
          }}
        />
        <Drawer.Screen
    name="Demande de conge"  
    component={Conge}
    options={{
      drawerLabel: 'Demande de congé',
      drawerIcon: ({ color, size }) => (
        <AntDesign name="calendar" size={size} color={color} />
      ),
            
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 15,
              fontWeight: 'bold',
              color: '#4b67a1',
            },
            headerStyle: {
              borderBottomWidth: 0,
              backgroundColor: '#f5f5f5',
            },
          }}
        />
        <Drawer.Screen
          name="Demandes d'autorisation"
          component={Autorisation}
          options={{
            drawerLabel: 'Demande d\'autorisation',
            drawerIcon: ({ color, size }) => (
              <AntDesign name="idcard" size={size} color={color} />
            ),
          
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 15,
              fontWeight: 'bold',
              color: '#4b67a1',
            },
            headerStyle: {
              borderBottomWidth: 0,
              backgroundColor: '#f5f5f5',
            },
          }}
        />
        <Drawer.Screen
          name="Demandes de complément"
          component={Complement}
          options={{
            drawerLabel: 'Demande de complément',
            drawerIcon: ({ color, size }) => (
              <AntDesign name="pluscircle" size={size} color={color} />
            ),
           
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 15,
              fontWeight: 'bold',
              color: '#4b67a1',
            },
            headerStyle: {
              borderBottomWidth: 0,
              backgroundColor: '#f5f5f5',
            },
          }}
        />
        <Drawer.Screen
          name="Demandes de remboursement"
          component={Rembourcement}
          options={{
            drawerLabel: 'Demande de remboursement',
            drawerIcon: ({ color, size }) => (
              <AntDesign name="sync" size={size} color={color} />
            ),
           
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 15,
              fontWeight: 'bold',
              color: '#4b67a1',
            },
            headerStyle: {
              borderBottomWidth: 0,
              backgroundColor: '#f5f5f5',
            },
          }}
        />
        <Drawer.Screen
          name="Demandes de prêt"
          component={LoansTabs}
          options={{
            drawerLabel: 'Demande de prêt',
            drawerIcon: ({ color, size }) => (
              <AntDesign name="profile" size={size} color={color} />
            ),
            
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 15,
              fontWeight: 'bold',
              color: '#4b67a1',
            },
            headerStyle: {
              borderBottomWidth: 0,
              backgroundColor: '#f5f5f5',
            },
          }}
        />
        <Drawer.Screen
          name="Suivi des absences"
          component={AbsencePage}
          options={{
            drawerLabel: 'Suivi des absences',
            drawerIcon: ({ color, size }) => (
              <AntDesign name="clockcircleo" size={size} color={color} />
            ),
          
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 15,
              fontWeight: 'bold',
              color: '#4b67a1',
            },
            headerStyle: {
              borderBottomWidth: 0,
              backgroundColor: '#f5f5f5',
            },
          }}
        />
        
          {hasManagerRole && (
        <Drawer.Screen
          name="Espace Manager"
          component={ManagerDashboard}
          options={{
            drawerLabel: 'Espace Manager',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="briefcase-outline" size={24} color="black" />
            ),
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 15,
              fontWeight: 'bold',
              color: '#4b67a1',
            },
            headerStyle: {
              borderBottomWidth: 0,
              backgroundColor: '#f5f5f5',
            },
          }}
        />
        )}
      </Drawer.Navigator>
      <NotificationSheet ref={notificationRef} />
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  
  
  card: {
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '100%',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  cardIcon: {
    marginRight: 15, 
  },
  cardContent: {
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1, 
  },
  cardTextContainer: {
    marginLeft: 15, 
  },
  cardValue: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#777',
  },
  cardTitle: {
    fontSize: 16, 
    color: 'black',
  },
  cardButton: {
    alignItems: 'flex-end',
  },
   container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    topHalf: {
      backgroundColor: '#f5f5f5',
      paddingHorizontal: 50,
      borderBottomLeftRadius: 35,
      borderBottomRightRadius: 35,
  
      paddingVertical: 20, 
    },
    headerContainer: {
      marginBottom: 20,
    },
    greetingText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#4b67a1',
    },
    dateText: {
      fontSize: 18,
      color: '#777',
      marginTop: 10,
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
    },
    searchInput: {
      flex: 1,
      marginRight: 10,
      color: '#4b67a1',
    },
    searchIconContainer: {
      backgroundColor: '#fff',
    },
    bottomHalf: {
      paddingHorizontal: 20,
    },
    sectionTitleContainer: {
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#4b67a1',
    },
    carouselContainer: {
      marginBottom: 20,
    },
    carouselItem: {
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    carouselItemText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
      marginTop: 10,
      textAlign: 'center',
    },
    taskList: {
      backgroundColor: '#fff',
      borderRadius: 10,
      paddingHorizontal: 20,
      paddingVertical: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
    },
    taskItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    taskTime: {
      fontSize: 14,
      color: '#888',
      marginRight: 10,
    },
    taskText: {
      fontSize: 16,
      color: '#4b67a1',
    },
    profileContainer: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    settingsButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 5,
    },
    profileName: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 10,
    },
    profileEmail: {
      fontSize: 16,
      color: '#4b67a1',
    },
    logoutButton: {
      backgroundColor: '#ff6b6b',
      borderRadius: 15,
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignItems: 'center',
      marginVertical: 20,
      marginHorizontal: 10,
    },
    logoutButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
    },
  });

export default HomeScreen;
