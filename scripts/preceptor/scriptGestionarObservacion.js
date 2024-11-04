import { Alert, Platform } from 'react-native';
import React, { useState } from 'react';
const api_url = 'http://localhost:5000'
const api_urlAlumnoCurso = 'http://localhost:5000/alumnosPorCurso'

export const obtenerSolicitante = async () => {
    try{
        const respuesta = await fetch(`${api_url}/solicitante`)
        const data = await respuesta.json()
        if(respuesta.ok){
            return data.solicitante
        }else{
            console.log('error')
            throw new Error(data.error)

        }
    }catch(error){
        console.log(error)
        throw new Error("Error al obtener los solicitantes")
    }
}

export const obtenerAlumnoCurso = async (idcurso) =>{
    try{
        const respuesta = await fetch(`${api_urlAlumnoCurso}/${idcurso}`)
        const data = await respuesta.json()
        if(respuesta.ok){
            return data.alumnos
        }else{
            console.log('error')
            throw new Error(data.error)

        }
    }catch(error){
        console.log(error)
        throw new Error("Error al obtener los alumnos")
    }
}

export const registrarObservacion = async (formData) => {
    try{
        const respuesta = await fetch(`${api_url}/observacion`, {
            method: 'POST',
            headers: {'Content-Type' : 
            'application/json'},
            body: JSON.stringify(formData)
        })
        const data =  await respuesta.json()

        if(respuesta.ok){
            console.log("Se agrego la observación")
            return data;  
        } else {
            throw new Error(data.error || 'Error desconocido al registrar la observación');
        }
    }catch(error){
        console.log(error)
        throw new Error("Error al cargar la observación")
    }
}


export const mostrarMensaje = (titulo, texto) => {
    if (Platform.OS === 'web') {
        // Para web
        return new Promise((resolve) => {
            alert(`${titulo}\n${texto}`);
            resolve();
        });
    } else {
        // Para móvil
        return new Promise((resolve) => {
            Alert.alert(
                titulo,
                texto,
                [
                    {
                        text: "OK",
                        onPress: () => resolve()
                    }
                ],
                { cancelable: false }
            );
        });
    }
}

