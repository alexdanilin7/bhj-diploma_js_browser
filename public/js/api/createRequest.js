/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    let requestData = null;
    let url = options.url;
        if (options.method === 'GET'){
                 const queryString = new URLSearchParams(options.data).toString();
                 url = `${options.url}?${queryString}`;
        }else{
            const formData = new FormData();
            const jsonData = options.data;
            for (const key in jsonData) {
                if (jsonData.hasOwnProperty(key)) {
                    const value = jsonData[key];
                    if (Array.isArray(value)) {
                        value.forEach((item, index) => {
                            formData.append(`${key}[${index}]`, item);
                        });
                    } else {
                        formData.append(key, value);
                    }
                    
                }
            }
            requestData = formData;
        }
    try{

        xhr.open(options.method, url);
        xhr.send(requestData);   
    }catch(e){
        options.callback(e, null);
        return;
    }
    

    xhr.addEventListener('load', () => {
         console.log("request ", requestData, url);
         console.log("xhr ", JSON.stringify(xhr.response));
         console.log("options ", options)


            options.callback(null, xhr.response);
    });
    xhr.addEventListener('error', () => {
        options.callback(new Error('Сетевая ошибка'), null);
    });
};
