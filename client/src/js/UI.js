import { removeIfExists, removedAt, generateHTML, assingTxtContent, show, hide, resetForm, selectElement, containers, FORM_INDEX, config, capitalizeFirstLetter} from "./helper.js";
import v from './variables.js';
import { Components } from "./Components.js";

class UI{
    
    showError = (msg, container, node) =>{
        if(!msg) return;
        removeIfExists(container, '.error');
        const error = generateHTML('P', 'error', msg);
        container.insertBefore(error, node);
        removedAt(error, 4000);
    }

    showToast = (msg, error = false)=>{
        if(!msg) return;
        removeIfExists(document.body, '.toast');
        removeIfExists(document.body, '.toast-error');
        const toast = generateHTML('DIV', error? 'toast-error' : 'toast', msg, document.body);
        removedAt(toast, 5000);
    }

    showNickname = (name)=> {
        show(v.headerNickname);
        v.nickname.style.whiteSpace = 'pre';
        assingTxtContent(v.nickname, ` ${name}, `);
    };

    showFeedbackSuccessfuly = (data, useModal = true, useToast = true)=>{
        const {user} = data;    
        if(useToast)this.showToast(data.message);
        if(useModal) v.closeModal.click();
        if(!user) return;

        if(user.type && user.type === 'login'){
            this.showNickname(user.name);
            if(user.notifications && user.notifications.length) this.showToast('You have new notifications. Please check your dashboard');
            v.buttonGetBooks.click();
        }
        else if(user.type === 'update-books'){
             v.buttonGetBooks.click();
        }
        else if(user.type === 'notification'){
            v.buttonNotifications.click();
            v.buttonGetBooks.click();
        }
    }

    toggleModalOrContainer = (action = 'open', config = null) => {
        if(action === 'open'){
            const {excludes, showContainers, display, titleEl, title, useOverlay, useModal, textButtonSubmit} = config;
            const setExcludes = new Set([...excludes]);
            const setContainers = new Set(Array.isArray(showContainers) ? showContainers : [Number(showContainers)]);
        
            if (titleEl) assingTxtContent(titleEl, title);      
            if (useOverlay) show(v.overlay, 'block');
            if (useModal){
                show(v.modal, 'block');
                assingTxtContent(v.btnSubmitForm, textButtonSubmit); 
            }

            containers.forEach((container, index) => {               
                if (setExcludes.has(index)) return;
                else if (setContainers.has(index)) show(container, display);
                else hide(container);
            });
        }
        else if(action === 'close'){
            hide(v.overlay);
            hide(v.modal);
            hide(v.dashboard);
            removeIfExists(v.modal, '.error');
            removeIfExists(v.dashboard, '.error');
            resetForm(v.form);
            resetForm(v.formEdit);
            selectElement(document.body, '.with-icon > input', this.deleteVisibilityPassword, true);
            v.characters.forEach(char => assingTxtContent(char, '0'));
        }
    };
    

    disconnect = (data) =>{
        this.showToast(data.message, false);
        hide(v.headerNickname);
    }

    updateInterfaceProfile = (data) =>{
        const {name} = data.user;
        assingTxtContent(v.nickname, ` ${name}, `);
        this.showToast(data.message);
        v.buttonGetBooks.click();
    }

  
    render = (content) => {
      
      const { data, type, id } = content.user;
      const fragment = document.createDocumentFragment();
     
      if(!(data.length || data && type === 'profile')){
        fragment.appendChild(Components.messageDefault());
        containers[parseInt(id)].replaceChildren(fragment);
        return;
      }

      if(type === 'profile'){
        this.renderProfile(data);
        return;
      }

      if(!data) return;

      data.forEach(element => {
        
        switch(type){
            case 'users':
                fragment.appendChild(Components.user(element));
            break;
            case 'books':
                fragment.appendChild(Components.book(element));
            break;
            case 'traders':
                fragment.appendChild(Components.trader(element));
            break;
            case 'upload-books':
                fragment.appendChild(Components.bookDashboard(element));
            break;
            case 'request-books':
                fragment.appendChild(Components.requestedBookDashboard(element));
            break;
            case 'notifications':
                fragment.appendChild(Components.notifications(element));
            break;
        }

      });
      
      containers[parseInt(id)].replaceChildren(fragment);
  };

  visibilityPassword = (target)=> {
    if(target.classList.contains('visibility')){
        const input = target.previousElementSibling;
        input.type = input.type === 'password'? 'text' : 'password';
    }
  }

  deleteVisibilityPassword = input =>{
    if(input.type === 'text') input.type = 'password';
  }

  renderProfile = (data) =>{
    for(const prop in data){
        if(v.formEdit.hasOwnProperty(`edit-${prop}`)){
            v.formEdit[`edit-${prop}`].value = data[prop] || 'not info';
        }
    }
  }

  showModalTrader = (e)=>{
    if(!e.target.closest('.item')) return;
    const {from, book} = e.target.closest('.item').dataset;
    if(!from || !book) return;
    const conf = config( FORM_INDEX.FORM_REQUESTED, undefined, undefined, v.modalTitle, 'Requested Book', true, true, 'Send'); 
    this.toggleModalOrContainer('open', conf);
    v.form['requested-book'].value = capitalizeFirstLetter(book);
    v.form['requested-user'].value = from;
  }


  disappearEl = (el) => {
    el.classList.add('disappear');
    removedAt(el, '350');
  };
}

export default new UI;