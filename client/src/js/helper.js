export const show = (el, display = 'flex') => {
    const dis = window.getComputedStyle(el).display;
    if(display !== dis)  el.style.display = display;
};

export const hide = (el) => {
    const display = window.getComputedStyle(el).display;
    if(display !== 'none') el.style.display = 'none';
};

export const selectElement = (container, selector, fn = null, moreThanOne = false) => {
    if(!moreThanOne) return container.querySelector(selector);
    if(!fn) return Array.from(container.querySelectorAll(selector));
    const selectors = Array.from(container.querySelectorAll(selector));
    if(fn) selectors.forEach(fn);  
    return selectors;
}

export const getDataForm = form => Object.fromEntries(new FormData(form));

export const generateHTML = (el, cls = '', content = '', container = null)=>{
    const item = document.createElement(el);
    if(cls) item.classList.add(...cls.trim().split(/\s+/));
    if(content) assingTxtContent(item, content);
    if(container) container.appendChild(item);
    return item;
}

export const removeIfExists = (container, el) => {
    const hasEl = container.querySelector(el);
    hasEl && hasEl.remove();
};

export const removedAt = (el, time) => setTimeout(()=> el.remove(), time);

export const resetForm = (form) => form.reset();

export const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const assingTxtContent = (el, str) => el.textContent = str;

export const colourProfile = ['greenyellow', 'purple', 'orangered', 'tomato', 'cyan', 'chocolate', 'pink', 'yellow', 'green', 'black', 'violet', 'darkcyan', 'blue'];

export const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const containers = Array.from(selectElement(document.body, '[data-container]', null, true));

export const FORM_INDEX = {
    FORM_USER: 0,
    FIELD_CREATE_ACCOUNT: 1,
    FORM_BOOK: 2,
    FORM_REQUESTED: 3,
    DASHBOARD: 4,
    DASHBOARD_FORM: 5,
    DASHBOARD_GRID: 6,
    LIBRARY_USERS_BOOKS: 7,
    LIBRARY_TRADERS: 8,
}

const configContainers = {};

export const config = (containerShow, containerExcludes, dis, titleElement, titleStr, needOverlay, needModal, buttonStr)=>{

    return Object.assign(configContainers, {
        showContainers : containerShow || null,
        excludes: containerExcludes || [FORM_INDEX.LIBRARY_USERS_BOOKS, FORM_INDEX.LIBRARY_TRADERS],
        display: dis || 'flex',
        titleEl: titleElement || null,
        title: titleStr || '',
        useOverlay: needOverlay !== undefined ? needOverlay : true,
        useModal: needModal !== undefined ? needModal : false,
        textButtonSubmit: buttonStr || '',
    })
}

