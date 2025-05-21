const request = (function(){
    const endpoint = {req: ''};

    const setEndpoint = value => endpoint.req = value;
    const getEndpoint = ()=> endpoint;

    return{setEndpoint, getEndpoint};
})();

export default request;