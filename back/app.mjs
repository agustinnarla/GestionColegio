import express from 'express'
import { ruta } from './ruta/ruta.mjs'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()


app.use(express.json());
app.use(cors())
app.use('/',ruta)

app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
    next()
});

const port = process.env.PUERTO || 3000 

app.listen(port,() =>{
    console.log(`El servidor se alojo en http://localhost:${port}`)
})