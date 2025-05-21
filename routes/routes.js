import Controller from '../controllers/Controller.js';
import express from 'express'
import { validateCredentials, validateLength, validateToken, updateFieldLowerCase } from '../middlewares/middleware.js';


const router = express.Router();

router.get('/auth/status', validateToken(false, false), Controller.authenticationStatus);

router.post('/register', validateToken(true, false), validateCredentials('Username and password are required', 'name', 'password'), validateLength('Password must be between 8 and 30 characters', 8, 30, 'password'), Controller.createUser);

router.post('/login',validateToken(true, false), validateCredentials('Username and password are required', 'name', 'password'), Controller.login);

router.post('/register/book', validateToken(false, true), validateCredentials('The book name is required', 'book-name'), validateLength('The book description must be at most 200 characters long', 0, 200, 'book-description'), updateFieldLowerCase('book-name'), Controller.createBook);

router.post('/requested/book', validateToken(false, true), validateCredentials('The book title and the requested user are required', 'requested-book', 'requested-user'), validateLength('The message must be at most 100 characters long', 0, 100, 'requested-message'), updateFieldLowerCase('requested-book'), Controller.createRequestedTrader);

router.patch('/user/profile/edit', validateToken(false, true), Controller.updateUser);
router.patch('/trader/:action', validateToken(false, true), updateFieldLowerCase('book'), Controller.resolveTrader);

router.get('/logout', validateToken(false, true), Controller.logout);
router.get('/users', Controller.getAllUsers);
router.get('/books', Controller.getAllBooks);
router.get('/traders', Controller.getAllsTraders);
router.get('/user/profile', validateToken(false, true), Controller.getInfoUser);

router.delete('/user/profile/delete/:type/:item', validateToken(false, true), updateFieldLowerCase('item', true), Controller.deleteInProfile);


export default router;