/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    
    if (options.method === 'GET'){
        const queryString = new URLSearchParams(options.data).toString();
        try{
            xhr.open(options.method, `${options.url}?${queryString}`);
            xhr.send()
        }catch(e){
            options.callback(e, {});
        }
      
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
        try{
             xhr.open(options.method, options.url);
        xhr.send(formData);
        }catch(e){
            options.callback(e, {});
        }
       
    }

    xhr.addEventListener('load', options.callback);
};
