import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Login from './pantallas/Login';
import { BottomTab } from './componente/TabNavigation';

//Preceptores
import GestionarAsistencia from './pantallas/preceptores/gestionarAsistencia';
import GestionarAmonestaciones from './pantallas/preceptores/gestionarAmonestaciones';
import JustificarFalta from './pantallas/preceptores/justificarFalta'
import GestionarObservaciones from './pantallas/preceptores/gestionarObservaciones'
import ConsultarLibro from './pantallas/preceptores/consultarLibroAula'
import ModificarAsistencia from './pantallas/preceptores/modificarAsistencia';

//Profesores
import LibroAula from './pantallas/profesor/libroDeAula';
import AsignarEvaluaciones from './pantallas/profesor/asignarEvaluaciones';
import CargarNotasFinal from './pantallas/profesor/cargarNotaFinal';

//Alumnos
import Materias from './pantallas/alumno/materias';
import ChatBot from './pantallas/alumno/chatbot';
import Avisos from './pantallas/alumno/avisos';

//Secretario
import AsignacionHoras from './pantallas/secretaria/asignacionDeHoras';
import PasajeDeCurso from './pantallas/secretaria/pasarDeCurso';
import AsistenciaP_P from './pantallas/secretaria/asistenciaP-P';
import CargarNotas from './pantallas/secretaria/cargarNotas';
import GestionarAlumno from './pantallas/secretaria/gestionarAlumno';
import GestionarP_P from './pantallas/secretaria/gestionarP-P';
import JustificarFaltaP_P from './pantallas/secretaria/justificarFaltaP_P';
import LibroMatriz from './pantallas/secretaria/libroMatriz'
import CrearAvisos from './pantallas/secretaria/crearAvisos';

//Admin
import CargarTareas from './pantallas/admin/cargarTareas';
import GestionarMaterias from './pantallas/admin/gestionarMaterias';
import RegistrarCurso from './pantallas/admin/registrarCurso';
import RegistrarUsuario from './pantallas/admin/registrarUsuario';
import RegistrarRol from './pantallas/admin/registrarRol';

const Stack = createStackNavigator();

function MyStack() {
  return (
      <Stack.Navigator initialRouteName='Login'>
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
          {/* Principal */}
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
          {/* Preceptor */}
          <Stack.Screen
          name="Gestionar Asistencia"
          component={GestionarAsistencia}
          options={{
            title: "Gestionar Asistencia",
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
          name="Modificar Asistencia"
          component={ModificarAsistencia}
          options={{
            title: "Modificar Asistencia",
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
          name="Gestionar Observación"
          component={GestionarObservaciones}
          options={{
            title: "Gestionar Observación",
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
          name="Gestionar Amonestaciones"
          component={GestionarAmonestaciones}
          options={{
            title: "Gestionar Amonestaciones",
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
          name="Justificar Falta"
          component={JustificarFalta}
          options={{
            title: "Justificar Falta",
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
          name="Consultar Libro de Aula"
          component={ConsultarLibro}
          options={{
            title: "Consultar Libro de Aula",
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
        {/* Profes */}
        <Stack.Screen
          name="Libro De Aula"
          component={LibroAula}
          options={{
            title: "Libro de Aula",
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
          name="Cargar Nota Final"
          component={CargarNotasFinal}
          options={{
            title: "Cargar Nota Final",
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
          name="Asignar Evaluaciones"
          component={AsignarEvaluaciones}
          options={{
            title: "Asignar Evaluaciones",
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
        {/* Alumnos */}
        <Stack.Screen
          name="Materias"
          component={Materias}
          options={{
            title: "Materias",
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
          name="ChatBot"
          component={ChatBot}
          options={{
            title: "ChatBot",
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
          name="Avisos"
          component={Avisos}
          options={{
            title: "Avisos",
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
        {/* Secretario */}
        <Stack.Screen
          name="Asignacion de Horas"
          component={AsignacionHoras}
          options={{
            title: "Asignación de Horas",
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
          name="Crear Avisos"
          component={CrearAvisos}
          options={{
            title: "Crear Avisos",
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
          name="Pasar De Curso"
          component={PasajeDeCurso}
          options={{
            title: "Pasar de Curso ",
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
          name="Asistencia Profesor/Preceptor"
          component={AsistenciaP_P}
          options={{
            title: "Asistencia Profesor/Preceptor",
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
          name="Cargar Notas"
          component={CargarNotas}
          options={{
            title: "Cargar Notas",
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
          name="Gestionar Alumno"
          component={GestionarAlumno}
          options={{
            title: "Gestionar Alumno",
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
          name="Gestionar Profesor/Preceptor"
          component={GestionarP_P}
          options={{
            title: "Gestionar Profesor/Preceptor",
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
          name="Justificar Falta Profesor/Preceptor"
          component={JustificarFaltaP_P}
          options={{
            title: "Justificar Falta Profesor/Preceptor",
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
          name="Libro Matriz"
          component={LibroMatriz}
          options={{
            title: "Libro Matriz",
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
        {/* Admin */}
        <Stack.Screen
          name="Cargar Tareas"
          component={CargarTareas}
          options={{
            title: "Cargar Tareas",
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
          name="Gestionar Materias"
          component={GestionarMaterias}
          options={{
            title: "Gestionar Materias",
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
          name="Registrar Curso"
          component={RegistrarCurso}
          options={{
            title: "Registrar Curso",
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
          name="Registrar Usuario"
          component={RegistrarUsuario}
          options={{
            title: "Registrar Usuario",
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
          name="Registrar Rol"
          component={RegistrarRol}
          options={{
            title: "Registrar Usuario",
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