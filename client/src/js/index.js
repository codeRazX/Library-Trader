import '../sass/app.scss';
import UI from './UI.js';
import v from './variables.js';
import { create, read, update, remove } from './fetching.js';
import { getDataForm, assingTxtContent, FORM_INDEX, config } from './helper.js';
import request from './endpoint.js';
import { Components } from "./Components.js";


const handlePostRequest = async (e, dataFetch, done = null, toast = false, endpoint = null)=>{
    e.preventDefault();
    if(endpoint) request.setEndpoint(endpoint);
    const {req} = request.getEndpoint();
    
    try{
        const data = await create(dataFetch, req);
        if(data.success){
           if(done) done(data);
        }
    }
    catch(error){ 
        toast? UI.showToast(error, true) :  UI.showError(error, v.modal, v.form);
    }
}

const handleGetRequest = async (endpoint, fn = null) =>{
    request.setEndpoint(endpoint);

    try{    
        const data = await read(request.getEndpoint().req);  
        if(data.success){
            if(fn) fn(data);
        } 
    }
    catch(error){
        UI.showToast(error, true);
    }
}

const handlePathRequest = async (e, dataFetch, endpoint = null, fn = null, toast = false, containerError, nodeRefError)=>{
    e.preventDefault();
    request.setEndpoint(endpoint);
    
    try{
      const data = await update(dataFetch, request.getEndpoint().req);
      if(data.success){
        if(fn) fn(data);
      }
    }
    catch(error){
        toast? UI.showToast(error, true) :  UI.showError(error, containerError, nodeRefError);
    }
}

const handleDeleteRequest = async (endpoint, fn = null) => {
    request.setEndpoint(endpoint);

    try{
        const data = await remove(request.getEndpoint().req);
        if(data.success){
            if(fn) fn(data);
        }
    }
    catch(err){
        UI.showToast(err, true);
    }
}

const checkNotifications = ()=>{
    handleGetRequest(`user/profile?section=notifications`, ({user})=>{
       user.data.length? v.buttonNotifications.classList.add('with-notification') : v.buttonNotifications.classList.remove('with-notification');
    });
}

const deleteInDashboard = async (e)=>{
    const action = e.target.dataset?.action;
    if(!action) return;
    const {book} = e.target.parentElement.dataset;
    if(!book) return;

    let paramsType;
    let message;

    if(action === 'delete-book'){
        paramsType = 'book';
        message = 'Are you sure you want to delete this book? All associated trades will be canceled';        
    }
    else if(action === 'cancel-trader'){
        paramsType = 'trader';
        message = `You are about to cancel the request for the book "${book}". Do you agree?`;
    }

    try{
        const popup = await Components.popupConfirm(message);
        handleDeleteRequest(`user/profile/delete/${paramsType}/${book}`, (data) =>{
        UI.showFeedbackSuccessfuly(data, false, true);
        UI.disappearEl(e.target.parentElement);
        checkNotifications();
        popup.remove();
        });
    }
    catch(popup){
        popup.remove();
    }
}


const handleNotificationsInDashboard = async (e) =>{
    const action = e.target.dataset?.action;
    if(action === 'delete-book' ||action === 'cancel-trader')return;
    if(!action) return;
    const {request: book, type} = e.target.closest('li.notification').dataset;
  
    if(!book || !type) return;
    
    if(action === 'resolve-trader'){
        try{
            const popup = await Components.popupConfirm('Confirm exchange? The book will be shared with the other user');
            handlePathRequest(e, {book, type}, `trader/${action}`, (data) =>{
                checkNotifications();
                UI.showFeedbackSuccessfuly(data, false, true);
            });
            popup.remove();
            return;
        }
        catch(popup){
            popup.remove();
            return;
        }
    }
    handlePathRequest(e, {book, type}, `trader/${action}`, (data) =>{
        checkNotifications();
        UI.showFeedbackSuccessfuly(data, false, true);
    })
}
const handleEventsDashboard = (e)=>{
    
    if(e.target.classList.contains('close-modal')){
        UI.toggleModalOrContainer('close');
        return;
    }
    UI.visibilityPassword(e.target);
    deleteInDashboard(e);
    handleNotificationsInDashboard(e);

    const {fetch, open} = e.target.dataset;
    if(!fetch)return;
    
    handleGetRequest(`user/profile?section=${fetch}`, (data)=>{
        const conf = config( open, [FORM_INDEX.DASHBOARD, FORM_INDEX.LIBRARY_TRADERS, FORM_INDEX.LIBRARY_USERS_BOOKS], undefined, v.titleDashboard, e.target.textContent || 'Profile', true); 
        UI.toggleModalOrContainer('open', conf);
        UI.render(data);
    });

}

const handleEventsMainLibrary = (e)=>{
    const {fetch, open} = e.target.dataset;
    if(!fetch || !open) return;
    const title = e.target.textContent;
    
    handleGetRequest(fetch, (data)=> {
        const conf = config( open, [FORM_INDEX.DASHBOARD, FORM_INDEX.DASHBOARD_FORM, FORM_INDEX.DASHBOARD_GRID], 'grid', v.titleLibrary, (title.toLowerCase() === 'books')? `${title} available for trade` : `Alls ${title}`, false); 
        UI.toggleModalOrContainer('open', conf);
        UI.render(data);
    });
}


//Listener request
v.form.addEventListener('submit', (e)=> handlePostRequest(e, getDataForm(v.form), UI.showFeedbackSuccessfuly));
v.btnLogout.addEventListener('click', ()=> handleGetRequest('logout',UI.disconnect));
v.groupLibraryBTN.addEventListener('click', handleEventsMainLibrary);
v.formEdit.addEventListener('submit', (e) => handlePathRequest(e, getDataForm(v.formEdit),'user/profile/edit', UI.updateInterfaceProfile, false, v.formEdit, v.fieldsetFormEdit));


//Open modals
v.singBTN.addEventListener('click', ()=> {
    const conf = config([FORM_INDEX.FORM_USER, FORM_INDEX.FIELD_CREATE_ACCOUNT], undefined, undefined, v.modalTitle, 'Create Account',  undefined, true, 'Sign Up'); 
    UI.toggleModalOrContainer('open', conf);
    request.setEndpoint('register');
});
v.logBTN.addEventListener('click', ()=> {
    const conf = config(FORM_INDEX.FORM_USER, undefined, undefined, v.modalTitle, 'Log In',  undefined, true, 'Continue'); 
    UI.toggleModalOrContainer('open', conf);
    request.setEndpoint('login');
});
v.addBookBTN.addEventListener('click', ()=>{
    const conf = config(FORM_INDEX.FORM_BOOK, undefined, undefined, v.modalTitle, 'Create new Book',  undefined, true, 'Send Book'); 
    UI.toggleModalOrContainer('open', conf);
    request.setEndpoint('register/book');
});


//Open modal edit
v.nickname.addEventListener('click', (e)=> {
    const conf = config(FORM_INDEX.DASHBOARD); 
    UI.toggleModalOrContainer('open', conf);
    checkNotifications();
    v.buttonProfile.click();
});


//Open modal trader
v.library.addEventListener('click',  (e)=>{
    request.setEndpoint('requested/book');
    UI.showModalTrader(e);
});


//Handle request dashboard
v.dashboard.addEventListener('click', handleEventsDashboard);


//Listener helper
v.form['book-description'].addEventListener('input', (e)=> assingTxtContent(v.characters[0], e.target.value.length));
v.form['requested-message'].addEventListener('input', (e)=> assingTxtContent(v.characters[1], e.target.value.length));
v.eyeVisibilityForm.addEventListener('click',(e)=> UI.visibilityPassword(e.target))


//Auth init session
window.addEventListener('load', (e)=>{  
    handleGetRequest('auth/status', (data)=> UI.showFeedbackSuccessfuly(data, false, false));
    v.buttonGetBooks.click();
});


//Close modal && overlay
v.closeModal.addEventListener('click', (e)=> UI.toggleModalOrContainer('close'));
v.overlay.addEventListener('click', (e)=>{
    if(e.target.closest('#dashboard')) return;
    if(e.target.closest('[class *="modal"]'))return;
    UI.toggleModalOrContainer('close');
})

