import mongoose from 'mongoose';
import { MONGO_URI } from './config.js';

const connectDB = ()=>{
    mongoose.connect(MONGO_URI)
    .then(()=> console.log('Database connection successful'))
    .catch((err)=> console.log('Failed to connect database', err));
}

export default connectDB;

