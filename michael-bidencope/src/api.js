import axios from 'axios';
import { EditBio } from './componets/features/editBio';
import { getInitColorSchemeScript, getTablePaginationUtilityClass } from '@mui/material';

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
    ).catch(function (error) {
        return false;
    });
    if(response.status < 400){
        return true;
    }
    return false;
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

//gets tags for a project (ie. docker, fastApi and React ) if no project is given it will return all tags
async function getProejectTags(proejct = 0){
    //check if tags are in memory for this proejct if not get them from the server
    //if project in id in memory return tags, else continue

    //request server with project id
    
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    await sleep(50);
    console.log('went')

}

async function postProjectInfo(project, token){
    token = await token;
    project = await project;

    const response = await api.post(
        '/projects',
        {
            'name': project.name,
            'discription': project.discription,
            'tags': JSON.stringify([...project.tags]),
        },
        {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }
    ).catch((error) => {
        console.log(error);
        return false;
    });
    if(response.status < 400){
        return true;
    }
    return false;
}



export { getUser, getToken, postInfo, postPersonalInfo, getThemeForSite, postThemeForSite, getProejectTags, postProjectInfo }