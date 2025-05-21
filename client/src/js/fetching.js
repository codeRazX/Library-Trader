import API_URL from './env.js';

export const create = async(data, endpoint)=>{

    try{
        const req = await fetch(`${API_URL}${endpoint}`, {
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify(data),
            credentials: 'include'
        });

        if(!req.ok) {
            const errorData = await req.json();
            throw new Error(errorData.error);
        }
        return req.json();
    }
    catch(err){
        console.error(err.message);
        if(err.message === 'Failed to fetch') err.message = '';
        throw err.message;
    }
}

export const read = async(endpoint)=>{

    try{
        const req = await fetch(`${API_URL}${endpoint}`,{
            method: 'GET',
            credentials: 'include'
        });

        if(!req.ok) {
            const errorData = await req.json();
            throw new Error(errorData.error);
        }
        return req.json();
    }
    catch(err){
        console.error(err.message);
        if(err.message === 'Failed to fetch') err.message = '';
        throw err.message;
    }
}


export const update = async (data, endpoint)=>{
     try{
        const req = await fetch(`${API_URL}${endpoint}`, {
            method:'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
            credentials: 'include'
        });

        if(!req.ok) {
            const errorData = await req.json();
            throw new Error(errorData.error);
        }
        return req.json();
    }
    catch(err){
        console.error(err.message);
        console.log(err);
        if(err.message === 'Failed to fetch') err.message = '';
        throw err.message;
    }
}

export const remove = async (endpoint) =>{

    try{
        const req = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if(!req.ok){
            const error = await req.json();
            throw new Error(error.error);
        }

        return req.json();
    }
    catch(err){
        console.error(err);
        if(err.message === 'Failed to fetch') err.message = '';
        throw err.message;
    }
}