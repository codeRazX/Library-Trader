import { errorPrivate } from "../middlewares/middleware.js";
import models from "../model/model.js";
const {modelUser: User, modelBook: Book, modelTrader: Trader} = models;
import { hashPassword, comparePassword, generateCookie, removeCookie, helperSuccess, getCookie, validateFieldsHelper } from "../helpers/helper.js";


class Controller{

    authenticationStatus = async(req, res, next)=>{
      
       const {userID, name} = getCookie(req, res, next);

        try{
            const user = await User.findOne({_id: userID, name: name});
            if(user) return helperSuccess(res,200,'',{name: user.name, type: 'login'});
            return helperSuccess(res, 200, '', null, false);
        }
        catch(error){
            error.message = '';
            return next(error);  
        }
    }

    createUser = async (req,res,next)=>{
        const {password, ...data} = req.body;

        try{
            const user = await User.findOne({name: data.name});
            if(user) return errorPrivate(req, res, next, 'That username is already in use. Choose a different one', 400);
            const hashedPassword = await hashPassword(password);
            const newUser = await User.create({...data, password: hashedPassword});

            generateCookie(res, {userID: newUser._id, name: newUser.name});
            helperSuccess(res, 201, 'You have registered successfully!', {name: newUser.name, type:'login'});
        }
        catch(error){
            error.message = 'Something went wrong. Please try again later';
            next(error);
        }
    }

    login = async (req, res, next) => {

    const { name, password } = req.body;

    try {
        const user = await User.findOne({ name }).lean();
        if (!user) return errorPrivate(req, res, next, 'Invalid username or password', 422);
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) return errorPrivate(req, res, next, 'Invalid username or password', 422);
        
        const notifications = user.notifications.map(notification => {
            const {_id, ...rest} = notification;
            return {...rest};
        });

        generateCookie(res, {userID: user._id, name: user.name});
        return helperSuccess(res, 200, `Welcome back ${user.name}`, {name: user.name, notifications,  type:'login'});
        
    } catch (error) {
        error.message = 'Something went wrong. Please try again later';
        next(error);
    }
};

    logout = (req, res, next)=>{
        try{
            removeCookie(res);
            return helperSuccess(res,200,'Logged out successfully');
        }
        catch(error){
            error.message = 'Something went wrong. Please try again later';
            next(error);
        }
       
    }

    createBook = async(req, res, next) =>{
     
        const {'book-description': bookDescription, 'book-name': bookName} = req.body;

        try{
            const {userID} = getCookie(req,res, next);
            const existsBook = await Book.findOne({name: bookName, userID});
            if(existsBook) return errorPrivate(req, res, next, 'You have already published this book', 400);

            const book = await Book.create({name: bookName, description: bookDescription, userID});
            return helperSuccess(res, 200, 'Book registered successfully!', { type: 'update-books', data: {name: bookName, description: bookDescription}});
        }
        catch(error){
            error.message = 'Something went wrong. Please try again later';
            next(error);
        }
    }

    createRequestedTrader = async (req, res, next)=>{
      
        try{
            const {'requested-user': userRequested, 'requested-book': bookRequested, 'requested-message': msgRequested} = req.body;
            const {userID, name} = getCookie(req, res, next);

            const receiver = await User.findOne({ name: userRequested });
            const requestedBook = await Book.findOne({name: bookRequested, userID: receiver._id}).populate('userID');

            const haveBook = await Book.findOne({name: bookRequested, userID});
           
            const existsTrader = await Trader.findOne({bookID: requestedBook._id, senderID: userID});
            if(existsTrader) return errorPrivate(req, res, next, 'You have already requested this book', 404);
            
            if(!requestedBook) return errorPrivate(req, res, next, 'The requested book does not exist', 404);

            if(requestedBook.userID.name !== userRequested) return errorPrivate(req, res, next, 'The requested user does not match the book owner', 400);
            
            const userExists = await User.findOne({name: userRequested});

            if(!userExists) return errorPrivate(req, res, next, "The requested user does not exist", 404);
        
            if(requestedBook.userID.name === name && requestedBook.userID._id.equals(userID)){
                return errorPrivate(req, res, next, "You can't request a book for yourself", 400);
            }

            if(haveBook) return errorPrivate(req, res, next, 'Request denied: you already own a copy of this book', 404);

            const trader = await Trader.create({senderID: userID, bookID: requestedBook._id, receiverID: requestedBook.userID._id, status: undefined, message: msgRequested});

            await User.findByIdAndUpdate({_id: userExists._id},{

                $push: {
                    notifications : {
                        type: 'request',
                        message: `You’ve received a book exchange request`,
                        book: bookRequested,
                        sender: name,
                        messageInput: msgRequested,
                    }
                }
            } );

            return helperSuccess(res, 201, 'Request sent successfully. You will receive a response once the user accepts or rejects it');
        }
        catch(error){
            error.message = 'Something went wrong. Please try again later';
            next(error);
        }

    }

    getAllUsers = async(req, res, next)=>{
        
        try{
             
          const users = await User.aggregate(
        [{
            $lookup: {
            from: 'books', 
            localField: '_id', 
            foreignField: 'userID', 
            as: 'books' 
            }
            }  
        ]);

            const data = users.map(({name, city, state, fullname, books}) => ({name, city, state, fullname, books: books.length}));
            return helperSuccess(res, 200, '', {type: 'users', id: 7, data});
        }
        catch(error){
            error.message = 'Something went wrong. Please try again later';
            next(error);
        }
    }

    getAllBooks = async(req, res, next)=>{
        try{
            const books = await Book.find().populate('userID','name').lean();
        
            const data = books.map(({name,description,userID}) => {
               
                return {
                    name,
                    description,
                    user: userID.name,
                }
            });
        
            return helperSuccess(res, 200, '', {type: 'books', id: 7, data});
        }
         catch(error){
            error.message = 'Something went wrong. Please try again later';
            next(error);
        }
    }


    getAllsTraders = async (req, res, next)=>{
        try{
            const traders = await Trader.find({status: 'pending'})
            .select('status -_id')
            .populate('bookID', 'name -_id')
            .populate('senderID', 'name -_id')
            .populate('receiverID', 'name -_id')
            .lean();

            const data = traders.map(({bookID, receiverID, senderID}) => (
                {book: bookID.name,
                userSender: senderID.name,
                userReceiver: receiverID.name}));

            return helperSuccess(res, 200, '', {type: 'traders', id: 8 ,data});
        }
        catch(error){
            error.message = 'Something went wrong. Please try again later';
            next(error);
        }
    }


    getInfoUser = async (req, res, next)=>{
        try{
             const {section} = req.query;
             const {userID, name} = getCookie(req,res, next);
             if(!section) return errorPrivate(req, res, next, 'Something went wrong. Please try again later', 400);

             if(section === 'profile'){
                const user = await User.findOne({_id: userID, name}).select('-password -notifications -_id').lean();
                return helperSuccess(res, 200, '', {data: user, type: section});
             }
             else if(section === 'upload-books'){
                const books = await Book.find({userID}).select('name description -_id').sort({name: 1}).lean();
                return helperSuccess(res, 200, '', {data: books, type: section, id: 6});
             }
             else if(section === 'request-books'){
                const requestBooks = await Trader.find({senderID: userID}).     select('status -_id')
                .populate('bookID', 'name -_id')
                .populate('receiverID', 'name -_id')
                .lean();
                
                 const data = requestBooks.map(({bookID, receiverID, status}) => (
                {book: bookID.name,
                userReceiver: receiverID.name,
                status}));

                return helperSuccess(res, 200, '', {data, type: section, id: 6});
             }
             else if(section === 'notifications'){
                const user = await User.findById(userID).select('notifications -_id').lean();
                const notifications = user.notifications.map(notifications => {
                const {_id, ...rest} = notifications;
                return {...rest};
               })
                return helperSuccess(res, 200, '',{data: notifications, type:'notifications', id: 6});
             }

        }
        catch(error){
            error.message = 'Something went wrong. Please try again later';
            next(error);
        }
    }

    updateUser = async (req, res, next) =>{
        let validateDifferentsFields = false;

        try{
            const {'current-password': password, 'new-password': newPassword, 'repeat-password': repeatNewPassword, ...info} = req.body;
            const {userID, name} = getCookie(req, res, next);
            const user = await User.findOne({_id: userID, name});
            
            if(info.name !== name){
                const existUserWithName = await User.findOne({name: info.name});

                if(existUserWithName && (user._id !== existUserWithName._id)){
                    return errorPrivate(req, res, next, 'That username is already in use. Choose a different one', 400);
                }
            }
            if((newPassword || repeatNewPassword) && !password){
                return errorPrivate(req, res, next, 'To change your password, you must first enter your current password',400);
            }

            if(password && (!newPassword || !repeatNewPassword)){
                return errorPrivate(req, res, next, 'Don’t forget to enter and confirm your new password!',400);

            }
            if(password){
                const isValidPassword = await comparePassword(password, user.password);

                if(!isValidPassword) return errorPrivate(req, res, next, 'Invalid current password', 400);
            }
            if(newPassword){
                if(newPassword.length < 8 || newPassword.length > 30){
                    return errorPrivate(req, res, next, 'Password must be between 8 and 30 characters', 400);
                }
            }
            if (newPassword && repeatNewPassword && newPassword !== repeatNewPassword) {
                return errorPrivate(req, res, next, 'New password and confirmation must match.', 400);
            }

            validateFieldsHelper(info, (prop)=>{
                if(info[prop] !== user[prop]){
                    validateDifferentsFields = true;
                    if(!info[prop])info[prop] = '';
                }
            })

            if(!validateDifferentsFields && !(newPassword && repeatNewPassword && password)){
                 return errorPrivate(req, res, next, 'No changes detected',422);
            }
            
            if(!info.name) info.name = name;
            const updateUser = await User.findByIdAndUpdate({_id: userID}, {...info, password: newPassword? await hashPassword(newPassword) : user.password}, {new: true});
            generateCookie(res, {userID: updateUser._id, name: updateUser.name});
            return helperSuccess(res, 201, 'Profile updated successfully!', {name: updateUser.name});
        }
        catch(error){
            error.message = 'Something went wrong. Please try again later';
            next(error);
        }
    }

    deleteInProfile = async (req, res, next)=>{
      
        try{
            const {item, type} = req.params;
            const book = await Book.findOne({name: item});
            const {userID} = getCookie(req, res, next);

            if(!book) return errorPrivate(req, res, next, 'Something went wrong. Please try again later', 400);

            if(type === 'book'){
               
                const existsTrader = await Trader.findOne({bookID: book._id, receiverID: userID});

                if(existsTrader) {
                  await existsTrader.deleteOne();
                  await User.findByIdAndUpdate(userID, {
                    $pull: {
                        notifications: {
                            book: book.name,
                            type: 'request'
                        }
                    }
                  });
                }
                await Book.findByIdAndDelete(book._id);
                return helperSuccess(res, 200, 'Book deleted successfully', {type: 'update-books'});
            }
            else if(type === 'trader'){
                const trader = await Trader.deleteOne({bookID: book._id})
                return helperSuccess(res, 200, 'Your request has been canceled', {type: 'update-books'});
            }

            return errorPrivate(req, res, next, 'Something went wrong. Please try again later', 400);
        }
        catch(error){
            error.message = 'Something went wrong. Please try again later';
            next(error);
        }
    }

    resolveTrader = async (req, res, next) =>{

        try{
            const {action} = req.params;
            const {book, type} = req.body;
            if(!action || !book || !type) return errorPrivate(req, res, next, 'Something went wrong. Please try again later', 400);
            const {userID, name} = getCookie(req, res, next);

            if(action === 'delete-notification'){
                
                await User.findByIdAndUpdate(userID, {
                    $pull: {
                        notifications: {
                            book,
                            type,
                        }
                    }
                });

                return helperSuccess(res, 200, '', {type: 'notification'});
            }
            
            const currentBook = await Book.findOne({name: book, userID});

            const sendUser = await Trader.findOne({ bookID: currentBook._id, receiverID: userID },'senderID -_id')
           .populate('senderID', 'notifications name'); 

            const currentTrader = await Trader.findOne({bookID: currentBook._id, receiverID: userID});
       
            const senderUser = await User.findById(sendUser.senderID._id);

            const createMsg = (typ, msg) => ({type: typ, message: msg, book: currentBook.name });

            if(action === 'resolve-trader' || action === 'reject-trader'){
                await User.findByIdAndUpdate(userID, {
                $pull: {
                    notifications: {
                        book: currentBook.name,
                        type: 'request',
                        sender: sendUser.senderID.name
                    }
                }
            });
            }
            
            if(action === 'resolve-trader'){

                const senderHaveBook = await Book.findOne({name: book, userID: senderUser._id });
                if(senderHaveBook){
                       await User.findByIdAndUpdate(userID, {
                        $pull: {
                            notifications: {
                                book: currentBook.name,
                                type: 'request',
                                sender: senderUser.name
                            }
                        }
                    });
                    await currentTrader.deleteOne();
                    return helperSuccess(res, 200,'The user has already acquired a copy of this book. Notification has been removed', {type: 'notification'});
                    
                }

               
                currentBook.userID = sendUser.senderID;
                await currentTrader.deleteOne();
                await currentBook.save();
                senderUser.notifications.push(createMsg('accepted',`Your exchange request for "${currentBook.name}" has been accepted by ${name}`));
                await senderUser.save();
                return helperSuccess(res, 200, 'The exchange was successfully completed!', {type: 'notification'});
            }
            else if(action === 'reject-trader'){
                await currentTrader.deleteOne();
                senderUser.notifications.push(createMsg('rejected',`Your exchange request for "${currentBook.name}" has been declined by ${name}`));
                await senderUser.save();
                return helperSuccess(res, 200, 'You’ve successfully rejected the trade!', {type: 'notification'});
            }
           
            return errorPrivate(req, res, next, 'Something went wrong. Please try again later', 400);
        }
        catch(error){
            error.message = 'Something went wrong. Please try again later';
            next(error);
        }
    }
}

export default new Controller;