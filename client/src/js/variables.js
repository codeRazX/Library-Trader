const getVariables = (function(){

    const $ = el=> document.querySelector(`.${el}`);
    const $$ = el => document.getElementById(el);

    const overlay = $$('overlay');
    const singBTN = $$('sign');
    const logBTN = $$('log-in');
    const closeModal = $('close-modal');
    const form = $$('form');
    const modal = $('modal');
    const modalTitle = $$('modal-title');
    const btnSubmitForm = $$('btn-form');
    const addBookBTN = $$('add-book');

   
    const headerNickname = $('header__nickname');
    const btnLogout = $$('logout');
    const nickname = $$('nickname');
    const groupLibraryBTN = $('main__group');
    const library = $$('library');
  
    const titleLibrary = $$('title-section-library');
    const dashboard = $$('dashboard');
  
    const buttonGetBooks = document.querySelector('button[data-fetch="books"]');
    const buttonProfile = document.querySelector('button[data-fetch="profile"]');
    const buttonNotifications = document.querySelector('button[data-fetch="notifications"]');
    const titleDashboard = $$('title-section-dashboard');
   
    const eyeVisibilityForm = modal.querySelector('.visibility');
    const formEdit = $$('form-edit');
    const fieldsetFormEdit = document.querySelector('fieldset');
    const characters = document.querySelectorAll('.characters-value');
    
    
    return {overlay, singBTN, logBTN, closeModal, form, modal, headerNickname, btnLogout, nickname, modalTitle, btnSubmitForm, groupLibraryBTN, titleLibrary, addBookBTN, buttonGetBooks, dashboard, buttonProfile, titleDashboard, eyeVisibilityForm, formEdit, library, characters, fieldsetFormEdit, buttonNotifications};
})();

export default getVariables;