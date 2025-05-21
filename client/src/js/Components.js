import { generateHTML, random, colourProfile, capitalizeFirstLetter } from "./helper.js"
import iconBook from '../../public/book.png';

export class Components{

    
    static user = (el)=>{
        const {name, fullname, city, state, books} = el;

        const item = generateHTML('DIV', 'item appear');
        const blockName = generateHTML('DIV', 'item__name', '', item);
        const username = generateHTML('P', 'item__name--user', name, blockName);
        const profileUser = generateHTML('SPAN', 'item__name--profile', '', blockName);
        profileUser.style.background = `radial-gradient(circle, ${random(colourProfile)}, whitesmoke)`;

        const blockInfo = generateHTML('DIV', 'item__info', '', item);
        if (fullname) generateHTML('P', '', `Fullname: ${fullname}`, blockInfo);
        if (city) generateHTML('P', '', state ? `City: ${city}, ${state}` : `City: ${city}`, blockInfo);
        if (books) generateHTML('P', 'item__info--countbooks', `Books: ${books}`, blockInfo);
        return item;
    }

    static book = (el)=>{
        const {name, description, user} = el;
        const item = generateHTML('DIV', 'item appear');
        const blockName = generateHTML('DIV', 'item__name', '', item);
        const bookName = generateHTML('P', 'item__name--user', capitalizeFirstLetter(name), blockName);
        const containerIMG = generateHTML('DIV', 'item__name--img-book', '', blockName);
        const imgBook = generateHTML('IMG', '', '', containerIMG);
        Object.assign(imgBook, {
            src: iconBook,
            loading: 'lazy',
            alt: ''
        });
  
        const blockInfo = generateHTML('DIV', 'item__info', '', item);
        if (description) generateHTML('P', '', `Description: ${description}`, blockInfo);
        const owner = generateHTML('P', 'item__info--book-from', `From: ${user}`, blockInfo);
        item.dataset.book = name;
        item.dataset.from = user;
        return item;
    }

    static trader = (el)=>{
        const {book, userReceiver, userSender} = el;

        const trader = generateHTML('DIV','trader appear');
        const traderRequester = generateHTML('DIV','trader__requester','',trader);
        generateHTML('P','','Requester:', traderRequester);
        generateHTML('P', 'trader__requester--label', userSender, traderRequester);

        const p = generateHTML('p','trader__book', book, trader);

        const traderFrom = generateHTML('DIV','trader__from','', trader);
        generateHTML('P','','From:', traderFrom);
        generateHTML('P', 'trader__from--label', userReceiver, traderFrom);
        return trader;
    }

    static bookDashboard = (el) =>{

        const {name, description} = el;
        const bookDashboard = generateHTML('LI', 'appear');
        const bookName = generateHTML('P','with-label',name, bookDashboard);
        const bookDescription = generateHTML('P','',description, bookDashboard);
        const buttonDelete = generateHTML('button', 'with-label with-label__delete', 'Delete', bookDashboard);
        buttonDelete.dataset.action = 'delete-book';
        bookDashboard.dataset.book = name;
        return bookDashboard;
    }

    static requestedBookDashboard = (el) =>{
        const {book, userReceiver, status} = el;

        const traderDashboard = generateHTML('LI','appear');
        traderDashboard.dataset.book = book;
        const traderBook = generateHTML('P', 'with-label', book, traderDashboard);
        const from = generateHTML('P', 'with-label with-label__from', 'From: ' + userReceiver, traderDashboard);
        const statusEl = generateHTML('span', 'with-label with-label__status', `Status: ${status}`, traderDashboard);
        if(status === 'pending'){
            const cancelTrader = generateHTML('button', 'with-label with-label__delete', 'Cancel', traderDashboard);
            cancelTrader.dataset.action = 'cancel-trader';
            statusEl.style.backgroundColor = 'goldenrod';
        }
      
        return traderDashboard; 
    }

    static notifications = (({book, message, messageInput, sender, type}) => {

        const notification = generateHTML('LI', 'notification appear');
        notification.dataset.request = book;
        notification.dataset.type = type;

        const msg = generateHTML('span','notification__title', message+'!', notification);

        if(type === 'request'){
          
            const blockRequest = generateHTML('DIV','notification__block','', notification);
            const from = generateHTML('p','with-label with-label__from', sender, blockRequest);
            generateHTML('span','notification__wants','wants', blockRequest);
            const wantsBook = generateHTML('p','with-label', book, blockRequest);
            if(messageInput) generateHTML('sppan','notification__message',`From the requester: ${messageInput}`, notification);
            const blockButton = generateHTML('DIV','notification__button','',notification);
            const btnConfirm = generateHTML('BUTTON','with-label with-label__accept', 'Accept Exchange', blockButton);
            const btnReject = generateHTML('BUTTON','with-label with-label__delete','Decline',blockButton);
            btnConfirm.dataset.action = 'resolve-trader';
            btnReject.dataset.action = 'reject-trader';
        }
        else{
            const buttonOK = generateHTML('BUTTON','with-label with-label__delete','OK', notification);
            buttonOK.style.alignSelf = 'flex-end';
            buttonOK.dataset.action = 'delete-notification';
        }
       
        return notification;
      
       
    })


    static popupConfirm = (answer)=>{
        return new Promise((resolve, reject) =>{
            const overlayPopup = generateHTML('DIV', 'overlay-popup','',document.body);
            const popup = generateHTML('DIV', 'popup appear','', overlayPopup);
            const answerTitle = generateHTML('P', '', answer, popup);
            const popupBTN = generateHTML('DIV', '','',popup);
            const buttonConfirm = generateHTML('BUTTON','btn','Yes', popupBTN);
            const buttonCancel = generateHTML('BUTTON', 'btn', 'Cancel', popupBTN);
            buttonConfirm.onclick = ()=> resolve(overlayPopup);
            buttonCancel.onclick = ()=> reject(overlayPopup);
        })
    }


    static messageDefault = ()=> generateHTML('P', 'msg-default', 'Nothing to show here right now')
}