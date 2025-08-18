import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert, Modal, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useMemo } from "react";
import bg from '../../assets/bg1.jpg';
import ListasDesplegables from '../../componente/ListasDesplegables.jsx';
import CustomAlert from '../../componente/CustomAlerts.js';
import ScrollContainer from '../../componente/ScrollContainer.jsx'
import useAmonestacion from '../../hooks/useAmonestacion.js';
import { ImageBackground } from 'react-native-web';

export default function GestionarAmonestaciones() {
    
    const {
        formData, cursos, profesionales, alumnos, totalAmonestaciones,
        modalVisible, setModalVisible,
        alertVisible, setAlertVisible, alertTitle, alertMessage,
        mostrarMensaje, validarFomulario,
        handleRegistrar, limpiarInterfaz, handleImprimir, handleChange, enviando, setEnviando
    } = useAmonestacion();
    
    const Content = (
        
        <View style={styles.contenido}>
            <ListasDesplegables 
                formData={formData} 
                handleChange={handleChange} 
                curso={cursos} 
                alumnos={alumnos}
                profesionales={profesionales}
                styles={styles}
            />

            <Text style={styles.label}>Fecha:</Text>
            <TextInput 
                style={styles.input} 
                placeholder="DD/MM/AAAA" 
                keyboardType="number-pad" 
                value={formData.fecha}  
                onChangeText={(value) => handleChange('fecha', value)}
            />

            <Text style={styles.label}>Cantidad:</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Cantidad de amonestación del día" 
                value={formData.cantidad}  
                onChangeText={(value) => handleChange('cantidad', value)}
            />

            <Text style={styles.label}>Cantidad de amonestaciones totales:</Text>
            <TextInput style={styles.input} placeholder="x" keyboardType="numeric" editable={false} value={totalAmonestaciones}/>

            <Text style={styles.label}>Motivo:</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Motivo de la amonestación" 
                value={formData.motivo}  
                onChangeText={(value) => handleChange('motivo', value)}
            />

            <View style={styles.botonesContainer}>
                <TouchableOpacity style={[styles.botonRegistrar, !validarFomulario && styles.botonDeshabilitado]} onPress={handleRegistrar}>
                    <Text style={styles.textoBoton}>Registrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botonCancelar} onPress={limpiarInterfaz}>
                    <Text style={styles.textoBoton}>Limpiar</Text>
                </TouchableOpacity>
            </View>
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.titulo}>¿Desea imprimir la amonestación?</Text>
                        <View style={styles.botonesModal}>
                            <TouchableOpacity
                                style={styles.botonImprimirModal}
                                onPress={handleImprimir}
                            >
                                <Text style={styles.textoBotonModal}>Imprimir</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.botonCancelarModal} onPress={limpiarInterfaz}>
                                <Text style={styles.textoBotonModal} >Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );

    return (
        <View style={styles.padre}>
            <ScrollContainer />
            <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
            {Platform.OS === 'web' ? Content : <ScrollView contentContainerStyle={styles.scroll}>{Content}</ScrollView>}
            <CustomAlert
        isVisible={alertVisible}
        onClose={() => setAlertVisible(false)}
        title={alertTitle}
        message={alertMessage}
        showSpinner={enviando}
                />
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    padre: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f7fa',
    },
    bg: {
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contenido: {
        width: '90%',
        maxWidth: 650,
        backgroundColor: '#fff',
        padding: 26,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 12,
        elevation: 6,
        alignSelf: 'center',
        alignItems: 'stretch',
        marginTop: 24,
        marginBottom: 26,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#2a3d6c',
        textAlign: 'left',
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1.5,
        borderColor: '#b6c6e0',
        borderRadius: 8,
        marginBottom: 18,
        backgroundColor: '#f9f9f9',
        fontSize: 16,
        color: '#2a3d6c',
    },
    botonesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 18,
        marginTop: 18,
        marginBottom: 36,
        width: '100%',
    },
    botonRegistrar: {
        backgroundColor: '#e8f5e9',
        borderColor: '#4caf50',
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#CED9EF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 4,
        minWidth: 120,
        alignItems: 'center',
        marginRight: 8,
    },
    botonCancelar: {
        backgroundColor: '#ffebee',
        borderColor: '#f44336',
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#f44336',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 4,
        minWidth: 120,
        alignItems: 'center',
        marginLeft: 8,
    },
    textoBoton: {
        color: '#2a3d6c',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    botonDeshabilitado: {
        opacity: 0.5,
        backgroundColor: '#cccccc',
        borderColor: '#999999',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: 'white',
        borderRadius: 14,
        padding: 28,
        alignItems: 'center',
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2a3d6c',
        textAlign: 'center',
    },
    botonesModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 10,
        marginTop: 10,
    },
    botonImprimirModal: {
        backgroundColor: '#e0e7ff',
        borderColor: '#746BC8',
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        marginRight: 8,
    },
    botonCancelarModal: {
        backgroundColor: '#ffebee',
        borderColor: '#f44336',
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        marginLeft: 8,
    },
    textoBotonModal: {
        color: '#2a3d6c',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loadingContainer: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
});