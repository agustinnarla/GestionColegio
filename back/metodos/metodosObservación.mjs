
import {pool} from '../dataBase/coneccion.mjs'

export const registrarObservacion = async (req, res) => {
    const { dnialumno, fecha, idsolicitante, motivo } = req.body; 
    try {
        const respuesta = await pool.query(
            'INSERT INTO observacion (dnialumno, fecha, idsolicitante, motivo) VALUES ($1, $2, $3, $4)',
            [dnialumno, fecha, idsolicitante, motivo]
        );
        console.log("Observación registrada exitosamente");
        res.status(200).json({ observacion: respuesta.rows});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Algo salió mal al cargar la observación' });
    }
};

export const obtenerEmailsPadres = async (req,res) => {
    try{
        const {dnialumno} = req.params; 
        const respuesta = await pool.query("SELECT emailfamiliar FROM alumno WHERE dnialumno = $1",[dnialumno])
        console.log(respuesta.rows)
        res.status(200).json({email : respuesta.rows})

    }catch(error){
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}