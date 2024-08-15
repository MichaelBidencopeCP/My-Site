import axios from 'axios';

const api = axios.create({
    //swap to env variable in future
    //non docker dev
    //baseURL: 'http://localhost:8000',
    //Dev
    //baseURL: 'http://localhost/api/',
    //Prod
    baseURL: 'https://michael-bidencope.com/api/',
});
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function createUser(username, password){
    const response = await api.post(
        '/register',
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
        if (error.response.status === 409){
            return 409;
        }
        return 0;
    }).then((response) => {
        if(response.status === 200){
            return 200;
        }
        return 0;
    });
    return response;
}

//test getting user with id 1
async function getUser(){
    const response = await api.get('/author-info');
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
        '/author-info',
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

/**
 * Posts personal info to the database
 * @param {data} data object with name, title, email, city, state
 * @param {*} token jwt token
 * @returns {boolean} true if successful, false if failed
 */
async function postPersonalInfo(data, token) {
    token = await token;
    data = await data;
    const response = await api.post(
        '/author-personal-info',
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
    ).then((response) => {
    if(response.status < 400){
        return true;
    }
    else{
        return false;
    }
    }).catch((error) => {
        return false;
    });
    return response;
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

/**
 * gets tags for a project (ie. docker, fastApi and React ) if no project is given it will return all tags
*/
async function getProejectTags(){

    const response = api.get(
        '/technologies'
        
    ).catch(
        (error) =>
        {
            return false;
        }
    );
    return await response;
}

async function removeProjectTags(tags, token){
    await tags;
    await token;
    let res = api.post(
        '/remove-technology',
        {
            'tags':tags
        },
        {
            headers:{
                'Authorization': 'Bearer ' + token
            }
        }
    ).then((data)=>{return data.data}).catch(()=>{return false;});
    return res
}

async function postNewTag(tag, token){
    tag = await tag
    token = await token
    const response = api.post(
        '/add-technology',
        {
            id: null,
            ...tag
        },
        {
            headers:{
                Authorization: 'Bearer ' + token
            }
        }
    ).then((response) =>{
        if (response.status < 400 && response.data > 0){
            return true
        }
        
    }).catch((error)=>{
        return false
    });
    return response;
}

/**
 * axios call to post a project to the database
 * @param {object} project
 * @param {string} project.name
 * @param {string} project.description
 * @param {string} project.image
 * @param {string} project.link
 * @param {array} project.tags
 * @param {string} token
 * @returns {boolean} true if successful, false if failed
 */
async function postProjectInfo(project, token){
    token = await token;
    project = await project;

    const response = await api.post(
        '/projects',
        {
            'name': project.name,
            'description': project.description,
            'image': "",//placeholder
            'link': "",//placeholder
            'technologies': [...project.tags],
        },
        {
            headers: {
                Authorization: 'Bearer ' + token,
                "Content-Type": 'application/json'
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


/**
 * 
 * @returns {string | boolean} update string, false if there is failed request
 * 
 */
async function getUpdateValue(){
    const response = await api.get(
        '/update',
    ).catch((error) => {
        return false;
    });
    return response.data;
}
/**
 * tell server to change update value, this will trigger cache update for all users
 * @param {string} token
 * @returns {boolean} true if successful, false if failed
 */
async function setUpdateValueAPI(token){
    token = await token;
    const response = await api.post(
        '/update',
        {},

        {
            headers: {
                Authorization: 'Bearer ' + token,
                "Content-Type": 'application/json'
            }
        }
    ).catch((error) => {
        return false;
    }).then((response) => {
        if(response.status < 400){
            return true;
        }
        return false;
    })
    return response;
}

/**
 * gets all projects from the database
 * @returns {array | boolean} array of projects or false if failed
 */
async function getProjects(){
    const response = await api.get(
        '/projects'
    ).catch((error) => {
        return false;
    }).then((data) => {
        return data.data;
    });
    return response['projects'];
}

/**
 * delete selected projects from the database
 * @param {array} projects array of project ids to delete
 * @param {string} token
 * @returns {boolean} true if successful, false if failed
 */
async function deleteProjects(projects, token){
    token = await token;
    projects = await projects;
    const response = await api.post(
        '/projects/delete',
        {
            'projects': projects
        },
        {
            headers: {
                Authorization: 'Bearer ' + token,
                "Content-Type": 'application/json'
            }
        }
    ).catch((error) => {
        return false;
    }).then((response) => {
        if(response.status < 400){
            return true;
        }
        return false;
    });
    return response;
}
/**
 * api call to change password of admin user
 * @param {string} password 
 * @param {string} token 
 * @returns {boolean} true if successful, false if failed
 */
async function ChangePasswordPost(password, token){
    token = await token;
    password = await password;
    const response = await api.post(
        '/change-password',
        {
            'password': password
        },
        {
            headers: {
                Authorization: 'Bearer ' + token,
                "Content-Type": 'application/json'
            }
        }
    ).catch((error) => {
        return false;
    }).then((response) => {
        if(response.status < 400){
            return true;
        }
        return false;
    });
    return response;
}

/**
 * api to see if extras have been enabled. If they have the site will have extra features page enabled
 * @param {string} token
 * @returns {boolean} true if enabled, false if not
 */
async function getExtrasEnabled(token){
    token = await token;
    const response = await api.get(
        '/extras',
        {
            headers: {
                Authorization: 'Bearer ' + token,
                "Content-Type": 'application/json'
            }
        }
    ).catch((error) => {
        return false;
    }).then((response) => {
        return response.data;
    });
    return response;
}

/**
 * api to enable or disable extras
 * @param {boolean} enabled true to enable, false to disable
 * @param {string} token
 * @returns {boolean} true if successful, false if failed
 */
 async function postExtras(enabled, token){
    token = await token;
    enabled = await enabled;
    const response = await api.post(
        '/extras',
        {
            'selected': true
        },
        {
            headers: {
                Authorization: 'Bearer ' + token,
                "Content-Type": 'application/json'
            }
        },
        
    ).catch((error) => {
        return false;
    }
    ).then((response) => {
        if(response.status < 400){
            return true;
        }
        return false;
    });
    return response;
}

export {api, parseJwt, createUser, getUser, getToken, postInfo, postPersonalInfo, getThemeForSite, postThemeForSite, getProejectTags, postProjectInfo, postNewTag, removeProjectTags, getUpdateValue, getProjects, setUpdateValueAPI,deleteProjects, ChangePasswordPost, getExtrasEnabled, postExtras }
