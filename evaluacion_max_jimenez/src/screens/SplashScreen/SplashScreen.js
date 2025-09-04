// src/screens/SplashScreen/SplashScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Prevenir que se oculte automáticamente
SplashScreen.preventAutoHideAsync();

const CustomSplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const prepare = async () => {
      try {
        // Simular carga de recursos (puedes agregar lógica real aquí)
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Ocultar splash screen nativo y llamar callback
        await SplashScreen.hideAsync();
        onFinish();
      }
    };

    prepare();
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo o icono de la app */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>📱</Text>
          <Text style={styles.appName}>Universidad App</Text>
        </View>
        
        {/* Indicador de carga */}
        <ActivityIndicator 
          size="large" 
          color="#007AFF" 
          style={styles.loader}
        />
        
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
      
      {/* Footer */}
      <Text style={styles.version}>Versión 1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoText: {
    fontSize: 60,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  loader: {
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  version: {
    position: 'absolute',
    bottom: 50,
    fontSize: 14,
    color: '#999',
  },
});

export default CustomSplashScreen;