import { Schema,model } from "mongoose";


const userSchema = new Schema({
    name : {type: String, required: true},
    password : {type: String, required: true},
    fullname: String,
    city: String,
    state: String,
    notifications: {
    type: [
        {
            type: { type: String, required: true },
            message: { type: String },
            book: { type: String },
            sender: { type: String },
            messageInput: { type: String },
            
        }
    ],
    default: []
}
    
}, {versionKey: false});


const bookSchema = new Schema({
    name: {type: String, required: true},
    description: String, 
    userID: {type: Schema.Types.ObjectId, ref: 'user', required: true}
}, {versionKey: false});

const traderSchema = new Schema({
    senderID: {type: Schema.Types.ObjectId, ref: 'user', required: true},
    receiverID : {type: Schema.Types.ObjectId, ref: 'user', required: true},
    bookID: {type: Schema.Types.ObjectId, ref: 'book', required: true},
    status: {type: String, enum: ['pending', 'accepted'], default: 'pending', required: true},
    message: String
}, {versionKey: false});

export default {modelUser: model('user',userSchema), modelBook: model('book', bookSchema), modelTrader: model('trader', traderSchema)};