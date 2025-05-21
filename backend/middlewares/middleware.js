import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config.js';
import models from "../model/model.js";
const {modelUser: User} = models;


export const handdleError = (err, req, res, next)=>{
    const status = err.status || 500;
    const msg = err.message || 'Something went wrong on the server';  
    if (!res.headersSent) res.status(status).json({error:msg});
}

export const errorPrivate = (req,res,next,msg,status)=>{
    const error = new Error(msg);
    error.status = status;
    return next(error);
}

export const validateCredentials =(msg, ...fields)=> (req, res, next)=>{

    for(const field of fields){
        if(!req.body[field]){
            return errorPrivate(req, res, next, msg, 400);
        }
    }

    next();
}


export const validateLength = (msg, min = 0, max = Infinity, field) => (req, res, next)=>{
    const fieldToValidate = req.body[field];

    if(typeof fieldToValidate !== 'string') return errorPrivate(req, res, next, `${field} must be a string`, 400);
    
    if(fieldToValidate.length < min || fieldToValidate.length > max){
         return errorPrivate(req, res, next, msg, 400);
    }

    next();
}

export const validateToken =(validateLogin = false, validateAuth = false) => async (req, res, next)=>{
    const {jwt: token} = req.cookies;

    if(token && validateLogin) return errorPrivate(req, res, next, 'You are already logged in', 400);
    if(!token && !validateAuth) return next();
    if(!token && validateAuth) return errorPrivate(req, res, next, 'You must be logged in to perform this action', 400); 
   
    try{
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const {userID, name} = decoded;
        const user = await User.findOne({_id: userID, name: name});
        if(!user) return errorPrivate(req, res, next, 'You must be logged in to perform this action', 400);
        next();
    }
    catch(error){
        error.message = 'Something went wrong. Please try again later';
        next(error);
    }

}

export const updateFieldLowerCase = (field, inParams = false) => (req, res, next) =>{
    inParams? req.params[field] = req.params[field].toLowerCase() :  req.body[field] = req.body[field].toLowerCase();
    next();
};