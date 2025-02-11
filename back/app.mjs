import express from 'express'
import { ruta } from './ruta/ruta.mjs'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()

// Configuración de CORS más específica
// app.use(cors({
//     origin: ['http://192.168.0.22:19006', 'http://192.168.0.22:8081'],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
// }));

app.use(cors({
    origin: ['http://localhost:19006', 'http://localhost:8081'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Middleware para manejar tipos MIME
app.use((req, res, next) => {
    const url = req.url.toLowerCase();
    
    if (url.includes('.bundle')) {
        res.setHeader('Content-Type', 'application/javascript');
    } else if (url.includes('.chunk')) {
        res.setHeader('Content-Type', 'application/javascript');
    } else if (url.includes('.map')) {
        res.setHeader('Content-Type', 'application/json');
    } else if (url.includes('.hot-update.json')) {
        res.setHeader('Content-Type', 'application/json');
    }
    
    // Cabeceras adicionales para desarrollo
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    next();
});

app.use('/', ruta)

const port = process.env.PUERTO || 5000 

// app.listen(port,() => {
//     console.log(`El servidor se alojo en http://192.168.0.22:${port}`)
// })

app.listen(port,() => {
    console.log(`El servidor se alojo en http://localhost:${port}`)
})