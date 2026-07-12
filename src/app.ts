import express from 'express';
import router from './routes';


const app = express();



app.use(express.json());
// toda requisição passará por aqui
app.use(router)







export default app;