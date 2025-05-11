/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    try{
        if (options.method === 'GET'){
            const queryString = new URLSearchParams(options.data).toString();
                xhr.open(options.method, `${options.url}?${queryString}`);
                xhr.send()
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
    
            
                 xhr.open(options.method, options.url);
                 xhr.send(formData);
                 console.log('send post');
           
              
        }
    }catch(e){
        options.callback(e, null);
        return;
    }
    

    xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
           // console.log('Ответ сервера', xhr.response);
            options.callback(null, xhr.response);
        } else {
            options.callback(new Error(`Ошибка ${xhr.status}: ${xhr.statusText}`), null);
        }
    });
    xhr.addEventListener('error', () => {
        options.callback(new Error('Сетевая ошибка'), null);
    });
};
