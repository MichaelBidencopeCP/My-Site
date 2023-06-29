import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/',
});


//test getting user with id 1
async function getUser(){
    const response = await api.get('/authorInfo');
    return response.data;
}

async function getToken(username, password){
    const response = await api.post(
        '/token',
        {
            username: username,
            password: password
        },
        {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

    return response.data;
    
}

export { getUser, getToken };

