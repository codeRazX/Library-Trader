import express from 'express';
import cookieParser from "cookie-parser";
import connectDB from './connect.js';
import cors from 'cors';
import router from './routes/routes.js';
import { handdleError, errorPrivate } from './middlewares/middleware.js';
import { NODE_ENV, URL_CLIENT_PROD, URL_CLIENT_DEV} from './config.js';
const app = express();

const corsOrigin = NODE_ENV === 'production' 
  ? URL_CLIENT_PROD 
  : URL_CLIENT_DEV;


app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());
connectDB();

app.use(router);
app.use((req, res, next)=> errorPrivate(req, res, next, 'Something went wrong. Please try again later', 404));
app.use(handdleError);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Server running on port: ', PORT));