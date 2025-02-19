import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet,View,Image} from 'react-native';
import React from "react";
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


//Rutas de navegación 
import HomePreceptor from "../pantallas/preceptores/HomePreceptor";
import Calendario from "../pantallas/Calendario";
import Perfil from "../pantallas/Perfil";
import HomeProfesor from "../pantallas/profesor/HomeProfesor";
import HomeAlumno from "../pantallas/alumno/HomeAlumno";
import HomeSecretaria from "../pantallas/secretaria/HomeSecretaria";
import HomeAdmin from "../pantallas/admin/HomeAdmin";




const Tab = createBottomTabNavigator()

export const BottomTab = () => {
  return (
    <Tab.Navigator 
      screenOptions={({ route })  => ({
        tabBarIcon: ({focused, color, size }) => {
          let iconName;
          let iconColor = focused ? 'black' : color;
          if (route.name === "MENU") {
            iconName = "home";
          } else if (route.name === "CALENDARIO") {
            iconName = "calendar";
          } else if (route.name === "PERFIL") {
            iconName = "user";
          }

          return (
          <View style={styles.tabBarIconContainer}>
            <View style={[styles.circle, { backgroundColor: focused ? '#ECECEC' : 'transparent', top: focused ? -40 : -20 }]}>
                  <FontAwesome
                  name={iconName}
                  size={size}
                  color={iconColor}
                  />
            </View>
          </View>
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="MENU"
        component={HomePreceptor}
        options={{
          title: "MENÚ",
          headerTintColor: "white",
          headerTitleAlign: "center",
          headerBackground: () => (
            <LinearGradient
              colors={["rgba(10, 18, 49, 0.8)", "rgba(45, 85, 228, 0.8)"]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CALENDARIO"
        component={Calendario}
        options={{
          title: "CALENDARIO",
          headerTintColor: "white",
          headerTitleAlign: "center",
          headerBackground: () => (
            <LinearGradient
              colors={["rgba(10, 18, 49, 0.8)", "rgba(45, 85, 228, 0.8)"]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="PERFIL"
        component={Perfil}
        options={{
          title: "PERFIL",
          headerTintColor: "white",
          headerTitleAlign: "center",
          headerBackground: () => (
            <LinearGradient
              colors={["rgba(10, 18, 49, 0.8)", "rgba(45, 85, 228, 0.8)"]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
          ),
        }}
      />
      
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#000000",
    height:60,
    position:'absolute',
    bottom: 16,
    right: 16,
    left: 16,
  },
    tabBarIconContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    circle: {
      width: 40, 
      height: 40,
      borderRadius: 20, 
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: -20, 
    }
  });
