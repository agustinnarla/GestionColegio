import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Login from './pantallas/Login';
import { BottomTab } from './componente/TabNavigation';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          title: "LOGIN",
          headerTintColor: "white",
          headerTitleAlign: "center",
          headerBackground: () => (
            <LinearGradient
              colors={['rgba(10, 18, 49, 0.8)', 'rgba(45, 85, 228, 0.8)']}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Home"
        component={BottomTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Herramientas"
        component={BottomTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Calendario"
        component={BottomTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Perfil"
        component={BottomTab}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}