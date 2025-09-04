// src/navigation/AppNavigator.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../config/AuthContext';

// Screens
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import RegisterScreen from '../screens/AuthScreens/RegisterScreen';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import HomeScreen from '../screens/MainScreens/HomeScreen';
import EditProfileScreen from '../screens/MainScreens/EditProfileScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <SplashScreen onFinish={() => {}} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? "Home" : "Login"}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {user ? (
          // Usuario autenticado - Pantallas principales
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{
                title: 'Inicio',
                headerLeft: () => null, // Evitar volver atrás
              }}
            />
            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen}
              options={{
                title: 'Editar Perfil',
              }}
            />
          </>
        ) : (
          // Usuario no autenticado - Pantallas de autenticación
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{
                title: 'Iniciar Sesión',
                headerShown: false,
              }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{
                title: 'Registro',
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;