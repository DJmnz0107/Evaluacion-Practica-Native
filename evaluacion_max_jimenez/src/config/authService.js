// components/config/authService.js
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
  } from 'firebase/auth';
  import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
  import { auth, database } from './firebase';  // ← CAMBIO: usar 'database' en lugar de 'db'
  
  // Registro de usuario
  export const registerUser = async (userData) => {
    try {
      console.log('🔥 Iniciando registro...');
      
      // Verificar que auth y database estén disponibles
      if (!auth) {
        console.error('❌ Auth no está configurado');
        throw new Error('Auth configuration not found');
      }
      if (!database) {
        console.error('❌ Database no está configurado');
        throw new Error('Database configuration not found');
      }

      const { email, password, nombre, tituloUniversitario, anoGraduacion } = userData;
      
      // Crear usuario en Auth
      console.log('📧 Creando usuario en Firebase Auth...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ Usuario creado:', user.uid);
      
      // Guardar información adicional en Firestore
      console.log('💾 Guardando en Firestore...');
      await setDoc(doc(database, 'users', user.uid), {  // ← CAMBIO: usar 'database'
        nombre,
        email,
        tituloUniversitario,
        anoGraduacion,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log('✅ Datos guardados en Firestore');
      
      return { success: true, user };
    } catch (error) {
      console.error('❌ Error en registro:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Inicio de sesión
  export const loginUser = async (email, password) => {
    try {
      console.log('🔐 Iniciando sesión...');
      
      if (!auth) {
        throw new Error('Auth configuration not found');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login exitoso:', userCredential.user.uid);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('❌ Error en login:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Cerrar sesión
  export const logoutUser = async () => {
    try {
      if (!auth) {
        throw new Error('Auth configuration not found');
      }
      
      await signOut(auth);
      console.log('👋 Sesión cerrada');
      return { success: true };
    } catch (error) {
      console.error('❌ Error cerrando sesión:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Obtener datos del usuario
  export const getUserData = async (userId) => {
    try {
      if (!database) {
        throw new Error('Database configuration not found');
      }

      const docRef = doc(database, 'users', userId);  // ← CAMBIO: usar 'database'
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log('📊 Datos obtenidos');
        return { success: true, data: docSnap.data() };
      } else {
        return { success: false, error: 'Usuario no encontrado' };
      }
    } catch (error) {
      console.error('❌ Error obteniendo datos:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Actualizar datos del usuario
  export const updateUserData = async (userId, userData) => {
    try {
      if (!database) {
        throw new Error('Database configuration not found');
      }

      const docRef = doc(database, 'users', userId);  // ← CAMBIO: usar 'database'
      await updateDoc(docRef, {
        ...userData,
        updatedAt: new Date().toISOString()
      });
      console.log('✅ Datos actualizados');
      return { success: true };
    } catch (error) {
      console.error('❌ Error actualizando datos:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Observer para cambios de autenticación
  export const onAuthChange = (callback) => {
    if (!auth) {
      console.error('❌ Auth no disponible para observer');
      return () => {}; // Función de cleanup vacía
    }
    return onAuthStateChanged(auth, callback);
  };