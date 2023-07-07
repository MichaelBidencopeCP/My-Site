import axios from 'axios';
import { EditBio } from './componets/features/editBio';
import { getInitColorSchemeScript } from '@mui/material';

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

async function getThemeForSite(token){
    let res = 0;
    if (token) {
        res = api.get(
            '/theme',
            {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }
        ).catch((error) => {
            return 0;
        });
    }
    else{
        res = api.get(
            '/theme',
        ).catch((error) => {
            return 0;
        });

    }
    res = await res;
    
    return res.data;
}

async function postThemeForSite(theme, token){
    token = await token;
    theme = await theme;
    const response = await api.post(
        '/theme',
        {
            'background_default': theme.background_default,
            'primary_main': theme.primary_main,
            'primary_contrast': theme.primary_contrast,
            'backup_main': theme.backup_main,
            'backup_contrast': theme.backup_contrast,
            'secondary_main': theme.secondary_main,
            'error': theme.error,
        },
        {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
    ).catch((error) => {
        return 0;
    });
    if(response.status < 400){
        return true;
    }
    return 0;

}

export { getUser, getToken, postInfo, postPersonalInfo, getThemeForSite, postThemeForSite }