import bcrypt from 'bcrypt';
const SALT_ROUND = 10;
import { JWT_SECRET_KEY, NODE_ENV } from '../config.js';
import jwt from 'jsonwebtoken';

export const helperSuccess = (res, status = 200, msg, data = null, success = true)=> {
    res.status(status).json({
        success,
        message: msg,
        user: data
    });
       
}

export const validateFieldsHelper = (object, fn)=>{
    for(const prop in object){
        fn(prop);
    }
}

export const hashPassword = async (password) => bcrypt.hash(password, SALT_ROUND);

export const comparePassword = async (rawPassword, hashedPassword) => bcrypt.compare(rawPassword, hashedPassword);

export const generateCookie = (res, data)=>{
    const token = jwt.sign(data, JWT_SECRET_KEY);
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: NODE_ENV === 'production'? 'None' : 'Lax',
    });
};

export const removeCookie = (res)=>{
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: NODE_ENV === 'production'? 'None' : 'Lax',
    });
}

export const getCookie = (req,res, next) =>{
    const {jwt: token} = req.cookies;
    if(!token) return helperSuccess(res, 200, '', null, false);
    
    try{
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const {userID, name} = decoded;
        return {userID, name};
    }
    catch(error){
        error.message = 'Something went wrong. Please try again later';
        next(error);
    }
}