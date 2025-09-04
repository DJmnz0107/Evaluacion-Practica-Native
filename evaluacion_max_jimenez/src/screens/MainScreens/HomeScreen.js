// src/screens/MainScreens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { logoutUser, getUserData } from '../../config/authService';
import { auth } from '../../config/firebase';

const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    if (currentUser) {
      setLoading(true);
      const result = await getUserData(currentUser.uid);
      
      if (result.success) {
        setUserData(result.data);
      } else {
        Alert.alert('Error', 'No se pudo cargar la información del usuario');
      }
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            const result = await logoutUser();
            if (!result.success) {
              Alert.alert('Error', 'No se pudo cerrar la sesión');
            }
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { userData });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando información...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>¡Bienvenido!</Text>
        <Text style={styles.userName}>{userData?.nombre || 'Usuario'}</Text>
      </View>

      <View style={styles.profileCard}>
        <Text style={styles.cardTitle}>Mi Información</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>👤 Nombre:</Text>
          <Text style={styles.value}>{userData?.nombre || 'No disponible'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>📧 Correo:</Text>
          <Text style={styles.value}>{userData?.email || currentUser?.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>🎓 Título:</Text>
          <Text style={styles.value}>{userData?.tituloUniversitario || 'No disponible'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>📅 Graduación:</Text>
          <Text style={styles.value}>{userData?.anoGraduacion || 'No disponible'}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={handleEditProfile}
        >
          <Text style={styles.editButtonText}>✏️ Editar Información</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    color: '#666',
    marginBottom: 5,
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    width: 120,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  buttonContainer: {
    gap: 15,
  },
  editButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;