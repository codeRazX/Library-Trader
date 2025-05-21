import dotenv from 'dotenv';
dotenv.config({ path: process.cwd()+ '/backend/.env' });

export const {
    MONGO_URI,
    NODE_ENV,
    URL_CLIENT_DEV,
    URL_CLIENT_PROD,
    JWT_SECRET_KEY
} = process.env;

