



// Saves the token to local storage
async function saveLoginState(login){
    login = await login;
    localStorage.setItem("login", {...login});
}


// Returns 0 if not logged in, returns token if logged in
function getLoginState(){
    let user = localStorage.getItem("user");
    if (user){
        
        if (user === 0){
            return 0;
        }
        return user;
    }
    
    return 0;
}

// Removes the token from local storage
function removeLoginState(){
    localStorage.removeItem("user");
}


export {saveLoginState, getLoginState, removeLoginState};