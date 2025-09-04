// src/screens/MainScreens/EditProfileScreen.js
import React, { useState, useEffect } from 'react';
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
import { updateUserData } from '../../config/authService';
import { auth } from '../../config/firebase';

const EditProfileScreen = ({ navigation, route }) => {
  const { userData } = route.params || {};
  const currentUser = auth.currentUser;
  
  const [formData, setFormData] = useState({
    nombre: '',
    tituloUniversitario: '',
    anoGraduacion: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        nombre: userData.nombre || '',
        tituloUniversitario: userData.tituloUniversitario || '',
        anoGraduacion: userData.anoGraduacion?.toString() || ''
      });
    }
  }, [userData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { nombre, tituloUniversitario, anoGraduacion } = formData;
    
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return false;
    }
    
    if (!tituloUniversitario.trim()) {
      Alert.alert('Error', 'El título universitario es requerido');
      return false;
    }
    
    if (!anoGraduacion || isNaN(anoGraduacion) || anoGraduacion < 1950 || anoGraduacion > new Date().getFullYear() + 10) {
      Alert.alert('Error', 'Ingrese un año de graduación válido');
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    if (!currentUser) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    setLoading(true);
    
    const result = await updateUserData(currentUser.uid, {
      nombre: formData.nombre.trim(),
      tituloUniversitario: formData.tituloUniversitario.trim(),
      anoGraduacion: parseInt(formData.anoGraduacion)
    });
    
    setLoading(false);
    
    if (result.success) {
      Alert.alert(
        'Información Actualizada',
        'Tus datos han sido actualizados correctamente',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert('Error', result.error || 'Error al actualizar la información');
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Descartar Cambios',
      '¿Estás seguro que quieres descartar los cambios?',
      [
        { text: 'Continuar Editando', style: 'cancel' },
        { text: 'Descartar', style: 'destructive', onPress: () => navigation.goBack() }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Editar Información</Text>
          <Text style={styles.subtitle}>Actualiza tus datos personales</Text>
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
              style={[styles.input, styles.disabledInput]}
              value={currentUser?.email || ''}
              editable={false}
              placeholder="Correo no editable"
            />
            <Text style={styles.helperText}>
              * El correo no se puede modificar
            </Text>
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

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>💾 Guardar Cambios</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>❌ Cancelar</Text>
            </TouchableOpacity>
          </View>
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
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
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
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#888',
  },
  helperText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 30,
    gap: 15,
  },
  button: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default EditProfileScreen;