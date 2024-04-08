import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import router from './routes/routes.js';

const app = express();
const PORT = 3001;

dotenv.config();

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@dashboard.ta1i6cz.mongodb.net/?retryWrites=true&w=majority&appName=dashboard`)
    .then(() => {
        app.listen(PORT)
        console.log('Conectou ao Banco')
    })
    .catch((err) => console.log(err))

app.use(express.json())

app.use(cors())

app.use('/', router)