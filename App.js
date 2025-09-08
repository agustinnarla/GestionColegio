import React from 'react';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Login from './frontend/pantallas/Login.js';
import { BottomTab } from './frontend/componente/TabNavigation';

//Preceptores
import RegistrarAsistenciaAlumno from './frontend/pantallas/preceptores/registrarAsistenciaAlumno.js';
import GestionarAmonestaciones from './frontend/pantallas/preceptores/gestionarAmonestaciones';
import JustificarFaltaAlumnos from './frontend/pantallas/preceptores/justificarFaltaAlumnos.js';
import GestionarObservaciones from './frontend/pantallas/preceptores/gestionarObservaciones'
import ConsultarLibro from './frontend/pantallas/preceptores/consultarLibroAula'
import ModificarAsistencia from './frontend/pantallas/preceptores/modificarAsistencia';

//Profesores
import RegistrarLibroDeAula from './frontend/pantallas/profesor/registrarLibroDeAula.js';
import AsignarEvaluaciones from './frontend/pantallas/profesor/asignarEvaluaciones';
import CargarNotasFinal from './frontend/pantallas/profesor/cargarNotaFinal';

//Alumnos
import Materias from './frontend/pantallas/alumno/materias';
import Avisos from './frontend/pantallas/alumno/avisos';

//Secretario
import AsignacionHoras from './frontend/pantallas/secretaria/asignacionDeHoras';
import PasajeDeCurso from './frontend/pantallas/secretaria/pasarDeCurso';
import RegistrarAsistenciaProfesional from './frontend/pantallas/secretaria/registrarAsistenciaProfesional.js';
import RegistrarNotas from './frontend/pantallas/secretaria/registrarNotas.js';
import GestionarAlumno from './frontend/pantallas/secretaria/gestionarAlumno';
import GestionarP_P from './frontend/pantallas/secretaria/gestionarP-P';
import JustificarFaltaProfesionales from './frontend/pantallas/secretaria/justificarFaltaP_P';
import LibroMatriz from './frontend/pantallas/secretaria/libroMatriz'
import CrearAvisos from './frontend/pantallas/secretaria/crearAvisos';

//Admin
import GestionarTareas from './frontend/pantallas/admin/gestionarTareas';
import GestionarMaterias from './frontend/pantallas/admin/gestionarMaterias';
import RegistrarCurso from './frontend/pantallas/admin/registrarCurso';
import RegistrarUsuario from './frontend/pantallas/admin/registrarUsuario';
import GestionarRol from './frontend/pantallas/admin/gestionarRol.js';

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
      <Stack.Screen
        name="BottomTab"
        component={BottomTab}
        options={{ headerShown: false }}
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
          name="Registrar Asistencia Alumno"
          component={RegistrarAsistenciaAlumno}
          options={{
            title: "Registrar Asistencia Alumno",
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
          name="Gestionar Amonestación"
          component={GestionarAmonestaciones}
          options={{
            title: "Gestionar Amonestación",
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
          name="Justificar Falta Alumnos"
          component={JustificarFaltaAlumnos}
          options={{
            title: "Justificar Falta Alumnos",
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
          name="Registrar Libro De Aula"
          component={RegistrarLibroDeAula}
          options={{  
            title: "Registrar Libro de Aula",
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
          name="Registrar Asistencia Profesional"
          component={RegistrarAsistenciaProfesional}
          options={{
            title: "Registrar Asistencia Profesional",
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
          name="Registrar Notas"
          component={RegistrarNotas}
          options={{
            title: "Registrar Notas",
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
          name="Gestionar Profesional"
          component={GestionarP_P}
          options={{
            title: "Gestionar Profesional",
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
          name="Justificar Falta Profesionales"
          component={JustificarFaltaProfesionales}
          options={{
            title: "Justificar Falta Profesionales",
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
          name="Gestionar Tareas"
          component={GestionarTareas}
          options={{
            title: "Gestionar Tareas",
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
          name="Gestionar Rol"
          component={GestionarRol}
          options={{
            title: "Gestionar Rol",
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

  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  if (!fontsLoaded) {
    return null; // O un componente de carga
  }

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}