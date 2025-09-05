// components/SplashScreen/SplashScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

const CustomSplashScreen = ({ onFinish }) => {
  useEffect(() => {
    console.log('🎬 SplashScreen iniciado');
    
    const timer = setTimeout(() => {
      console.log('🎬 SplashScreen terminando...');
      if (onFinish) {
        onFinish();
      }
    }, 4000); // 4 segundos de splash

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo profesional */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>EDU</Text>
          </View>
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
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 1,
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