import axios from 'axios';
import { EditBio } from './componets/features/editBio';

const api = axios.create({
    baseURL: 'http://localhost:8000/',
});


//test getting user with id 1
async function getUser(){
    const response = await api.get('/authorInfo');
    return response.data;
}

async function getToken(username, password){
    let flag = 1;
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
        ).catch(function (error) {
            flag = 0;
        }
    );
    if (flag == 0){
        return 0;
    }
    let res = await response;
    
    return res.data.access_token;
    
}

async function postInfo(bio, token) {
    token = await token;
    bio = await bio;
    const response = await api.post(
        '/authorInfo',
        {
            bio: bio
        },
        {
            headers: {
                //'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + token
            }
        }
    );
    if(response.status < 400){
        return true;
    }
    else{
        return 0;
    }
}
async function postPersonalInfo(data, token) {
    token = await token;
    data = await data;
    const response = await api.post(
        '/authorPersonalInfo',
        {
            'name': data.name,
            'title': data.title,
            'email': data.email,
            'city': data.city,
            'state': data.state,
        },
        {
            headers: {
                //'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + token
            }
        }
    );
    if(response.status < 400){
        return true;
    }
    else{
        return 0;
    }
}
export { getUser, getToken, postInfo, postPersonalInfo };

