import ENVIRONMENT from "./config/environment.config.js";
import connectMongoDB from "./config/mongodb.config.js";
import express from 'express';
import authRouter from './routes/auth.router.js'

console.log(ENVIRONMENT)

connectMongoDB()
const app = express()
app.listen(
  ENVIRONMENT.PORT,
  () => {
    console.log(`App de express se ejecuta correctamente en el puerto ${ENVIRONMENT.PORT}`)
  }
)


app.use(express.json());


app.get(
  '/api/test',
  (req, res) => {
    console.log(`Llego una consulta de prueba`)
    res.send('<h1>Respuesta de prueba</h1>')
  }
)

app.use('/api/auth', authRouter);
