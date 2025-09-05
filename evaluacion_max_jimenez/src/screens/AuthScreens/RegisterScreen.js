// src/screens/AuthScreens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { registerUser } from '../../config/authService';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    tituloUniversitario: '',
    anoGraduacion: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { nombre, email, password, confirmPassword, tituloUniversitario, anoGraduacion } = formData;
    
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return false;
    }
    
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Ingrese un correo electrónico válido');
      return false;
    }
    
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }
    
    if (!tituloUniversitario.trim()) {
      Alert.alert('Error', 'El título universitario es requerido');
      return false;
    }
    
    if (!anoGraduacion || isNaN(anoGraduacion) || anoGraduacion < 1950 || anoGraduacion > new Date().getFullYear()) {
      Alert.alert('Error', 'Ingrese un año de graduación válido');
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    const result = await registerUser({
      nombre: formData.nombre.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      tituloUniversitario: formData.tituloUniversitario.trim(),
      anoGraduacion: parseInt(formData.anoGraduacion)
    });
    
    setLoading(false);
    
    if (result.success) {
      Alert.alert(
        'Registro Exitoso',
        'Tu cuenta ha sido creada correctamente',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } else {
      Alert.alert('Error', result.error || 'Error al registrar usuario');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Ingresa tus datos para registrarte</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput
              style={styles.input}
              value={formData.nombre}
              onChangeText={(value) => handleInputChange('nombre', value)}
              placeholder="Ingresa tu nombre completo"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="ejemplo@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry={!showPassword}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Contraseña</Text>
            <TextInput
              style={styles.input}
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              placeholder="Confirma tu contraseña"
              secureTextEntry={!showPassword}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título Universitario</Text>
            <TextInput
              style={styles.input}
              value={formData.tituloUniversitario}
              onChangeText={(value) => handleInputChange('tituloUniversitario', value)}
              placeholder="Ej: Licenciatura en Informática"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Año de Graduación</Text>
            <TextInput
              style={styles.input}
              value={formData.anoGraduacion}
              onChangeText={(value) => handleInputChange('anoGraduacion', value)}
              placeholder="YYYY"
              keyboardType="numeric"
              maxLength={4}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Registrarse</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>
              ¿Ya tienes cuenta? <Text style={styles.linkTextBold}>Inicia sesión</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    color: '#666',
  },
  linkTextBold: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default RegisterScreen;