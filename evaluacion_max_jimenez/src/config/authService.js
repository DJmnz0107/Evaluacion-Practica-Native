// components/config/authService.js
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
  } from 'firebase/auth';
  import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
  import { auth, db } from './firebase';
  
  // Registro de usuario
  export const registerUser = async (userData) => {
    try {
      const { email, password, nombre, tituloUniversitario, anoGraduacion } = userData;
      
      // Crear usuario en Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Guardar información adicional en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        nombre,
        email,
        tituloUniversitario,
        anoGraduacion,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Inicio de sesión
  export const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Cerrar sesión
  export const logoutUser = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Obtener datos del usuario
  export const getUserData = async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() };
      } else {
        return { success: false, error: 'Usuario no encontrado' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Actualizar datos del usuario
  export const updateUserData = async (userId, userData) => {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        ...userData,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Observer para cambios de autenticación
  export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
  };