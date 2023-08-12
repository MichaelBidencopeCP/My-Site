import { jsx } from "@emotion/react";
import jwt_decode from "jwt-decode";




/**
 * checks to see if the update value is different from the one stored in local storage
 * @param {string} value update value
 * @returns {boolean} returns true if updated needed, fasle if not
*/
function checkForUpdate(value){
    //if update value is different, then update local storage
    
    const update = localStorage.getItem("update");
    
    if (update === null || update !== value.toString()) {
        console.log("Updating local storage:", value.toString());
        localStorage.setItem("update", value.toString());
        return true;
    }
    
    return false;
}

/**
 * Saves the token to local storage
*/
async function saveLoginState(login){
    login = await login;
    localStorage.setItem("login", login);
}


/**
*checks to see if the user has saved login info, and that the token is not expired
* @returns {login | int} login object
*/
function getLoginState(){
    let token = localStorage.getItem("login");
    
    if (token != null){
        //TODO need to add admin data to response data
        let tokenData = jwt_decode(token);
        let admin = tokenData.admin==1?true:false;
        if(tokenData.exp < Math.round((Date.now()/1000))){
            localStorage.removeItem("login");
            return {token:0, admin:false, username:'', id:0, exp:-1};
        }
        return {token: token, admin: admin, username: tokenData.sub, id: tokenData.id, exp: tokenData.exp};
    } 
    return {token:0, admin:false, username:'', id:0, exp:-1};
}

/**
 * removes login state from local storage
 */
function removeLoginState(){
    localStorage.removeItem("user");
}

/**
 * gets site author info from local storage
 * @returns {user | boolean} user object
 */
function getUserInfoLocal(){
    let user = localStorage.getItem("user");
    if (user != null){
        return JSON.parse(user);
    }
    return false;
}

/**
 * saves site author info to local storage
 * @param {user} user user ojbect
 * @param {user.name} user.name name of user
 * @param {user.title} user.title title of user
 * @param {user.email} user.email email of user
 * @param {user.city} user.city city of user
 * @param {user.state} user.state state of user
 * @param {user.bio} user.city city of user
 * @returns {boolean} true if successful, false if not
 */
function saveUserInfo(user){
    localStorage.setItem("user", JSON.stringify(user));
    return true;
}

/**
 * gets site theme from local storage, returns false if no theme is found
 * @param {int} customUserTheme 0 for default theme, or the id of the logged in user
 * @returns {theme | boolean} theme object
*/
function getThemeFromLocal(customUserTheme = 0){
    if (customUserTheme == 0){
        let theme = localStorage.getItem("defaultTheme");
        if (theme != null){
            return JSON.parse(theme);
        }
        return false;
    }
    else{
        let theme = localStorage.getItem("customTheme"+customUserTheme);
        if (theme != null){
            return JSON.parse(theme);
        }
        return false;
    }
}

/**
 * saves site theme to local storage
 * @param {theme} theme theme object
 * @param {theme.background_default} theme.background_default background color of site
 * @param {theme.primary_main} theme.primary_main primary color of site
 * @param {theme.primary_contrast} theme.primary_contrast primary contrast color of site
 * @param {theme.backup_main} theme.backup_main backup color of site
 * @param {theme.backup_contrast} theme.backup_contrast backup contrast color of site
 * @param {theme.secondary_main} theme.secondary_main secondary color of site
 * @param {theme.error} theme.error error color of site
 * @param {int} customUserTheme 0 for default theme, 1 for custom theme
 * @returns {boolean} true if successful, false if not
 */
function saveTheme(theme, customUserTheme = 0){
    if (customUserTheme == 0){
        localStorage.setItem("defaultTheme", JSON.stringify(theme));
        return true;
    }
    else{
        localStorage.setItem("customTheme"+customUserTheme, JSON.stringify(theme));
        return true;
    }
}

/**
 * gets projects from local storage
 * @param {int} id  none for all projects, if provided, will return project with matching id
 * @returns {project | projects | boolean} project object, projects object, or false if no projects are found
 *  
*/
function getProjectsFromLocal(id = 0){
    if (id == 0){
        let projects = localStorage.getItem("projects");
        if (projects != null){
            return JSON.parse(projects);
        }
        return false;
    }
    else{
        let projects = localStorage.getItem("projects");
        if (projects != null){
            projects = JSON.parse(projects);
            for (let i = 0; i < projects.length; i++){
                if (projects[i].id == id){
                    return projects[i];
                }
            }
        }
        return false;
    }
}

function setProjectsInLocal(projects){
    localStorage.removeItem("projects");
    localStorage.setItem("projects", JSON.stringify(projects));

    return true;
}

export {saveLoginState, getLoginState, removeLoginState, checkForUpdate, getUserInfoLocal, saveUserInfo, getThemeFromLocal, saveTheme, getProjectsFromLocal, setProjectsInLocal};