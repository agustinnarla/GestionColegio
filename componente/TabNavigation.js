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




const Tab = createBottomTabNavigator();


const getMenuComponent = (id_rol, dni_usuario) => {
  switch (id_rol) {
    case 1:
      return HomeAdmin;
    case 2:
      return (props) => <HomeProfesor {...props} dni_usuario={dni_usuario} id_rol={id_rol} />;
    case 3:
      return HomeSecretaria
    case 4:
      return (props) => <HomeAlumno {...props} dni_usuario={dni_usuario} id_rol={id_rol}/>;
    case 5:
      return HomePreceptor;
    default:
      return HomeAlumno; 
  }
};

export const BottomTab = ({ route }) => {
   const { id_rol, dni_usuario } = route.params;
   console.log('BottomTab params:', { id_rol, dni_usuario });

  return (
    <Tab.Navigator 
      screenOptions={({ route })  => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconColor = focused ? '#2A3D6C' : '#94A3B8';
          if (route.name === "MENU") {
            iconName = "home";
          } else if (route.name === "CALENDARIO") {
            iconName = "calendar";
          } else if (route.name === "PERFIL") {
            iconName = "user";
          }

          return (
            <View style={styles.tabBarIconContainer}>
              <View style={[styles.circle, focused && styles.circleFocused]}>
                <FontAwesome
                  name={iconName}
                  size={focused ? 22 : 18}
                  color={iconColor}
                />
              </View>
            </View>
          );
        },
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerStyle: {
          height: 100,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontSize: 16,
          fontWeight: '600',
          color: '#FFFFFF',
        },
      })}
    >
      <Tab.Screen
        name="MENU"
        component={getMenuComponent(id_rol, dni_usuario)}
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
        initialParams={{ dni_usuario, id_rol }} 
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
  initialParams={{ dni_usuario }} 
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
    backgroundColor: '#FFFFFF',
    height: 65,
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    borderRadius: 32.5,
    elevation: 8,
    shadowColor: '#2A3D6C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderTopWidth: 0,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  tabBarIconContainer: {
    position: 'absolute',
    top: -25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  circleFocused: {
    backgroundColor: '#FFFFFF',
    elevation: 10,
    shadowColor: '#2A3D6C',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  }
});
