// components/navigation/AppNavigator.js
import React, { useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../config/AuthContext';

// Screens
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import RegisterScreen from '../screens/AuthScreens/RegisterScreen';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import HomeScreen from '../screens/MainScreens/HomeScreen';
import EditProfileScreen from '../screens/MainScreens/EditProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator simple
const MainTabNavigator = () => {
  console.log('>>> MainTabNavigator SE ESTÁ RENDERIZANDO <<<');
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarLabel: 'Inicio',
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={EditProfileScreen}
        options={{
          title: 'Mi Perfil',
          tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);
  const [showSplash, setShowSplash] = useState(true);

  // MODO DE PRUEBA - Cambia esto a true para probar tabs sin autenticación
  const FORCE_SHOW_TABS = false;

  // LOGS DE DEBUG DETALLADOS
  console.log('=== DEBUG NAVIGATOR ===');
  console.log('User objeto completo:', user);
  console.log('User existe:', !!user);
  console.log('User UID:', user?.uid || 'Sin UID');
  console.log('Loading:', loading);
  console.log('ShowSplash:', showSplash);
  console.log('FORCE_SHOW_TABS:', FORCE_SHOW_TABS);
  console.log('========================');

  const handleSplashFinish = () => {
    console.log('>>> SplashScreen terminado <<<');
    setShowSplash(false);
  };

  if (loading || showSplash) {
    console.log('>>> MOSTRANDO SPLASH <<<');
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Decidir qué mostrar
  const shouldShowTabs = FORCE_SHOW_TABS || user;

  if (shouldShowTabs) {
    console.log('>>> DEBERÍA MOSTRAR TABS - USUARIO AUTENTICADO <<<');
  } else {
    console.log('>>> DEBERÍA MOSTRAR LOGIN - NO HAY USUARIO <<<');
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {shouldShowTabs ? (
          <Stack.Screen 
            name="MainTabs" 
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;