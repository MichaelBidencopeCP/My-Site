
import sqlite3
import dotenv
import os
from datetime import datetime, timedelta

from typing import Union
from typing_extensions import Annotated

from fastapi import FastAPI, HTTPException, status, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer

from database import Database

from authentication import Authentication

from jose import JWTError, jwt

from projectTypes import User, Token, TokenData, UserWithHash, Theme



app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

origins = [

    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


 

#lifecycle events
@app.on_event("startup")
async def create_database_if_not_exists():
    getDB()

def getDB():
    db = Database.get_instance().conn
    return db

def dbCommit():
    Database.get_instance().conn.commit()   

def getAuth():
    auth = Authentication()
    return auth
def get_user(username:str):
    db = getDB().cursor()
    db.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = db.fetchone()
    user = User(username=user[1], name=user[3], title=user[4], email=user[5], city=user[6], state=user[7], admin=user[8] ,id = user[0])
    return user

def get_user_with_hash(username:str):

    db = getDB().cursor()
    db.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = db.fetchone()
    if user:
        user = UserWithHash(username=user[1], name=user[3], title=user[4], email=user[5], city=user[6], state=user[7], admin=user[8], passwordHash=user[2], id = user[0])
    else:
        user = None
    return user

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
        )
    auth = getAuth()
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user
def get_current_user_or_none(token: Annotated[str, Depends(oauth2_scheme)]):
    if token is None:
        return None
    auth = getAuth()
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        token_data = TokenData(username=username)
    except JWTError:
        return None
    user = get_user(username=token_data.username)
    if user is None:
        return None
    return user

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    auth = getAuth()
    user = get_user_with_hash(form_data.username) 
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    userAuth = {"username": user.username, "passwordHash": user.passwordHash}
    user = auth.authenticate_user(userAuth, form_data.password)
    access_token = auth.create_access_token(
        data={"sub": user['username']}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/authorInfo")
def get_author_info(db: sqlite3.Connection = Depends(getDB)) -> Union[dict, str]:
    db = db.cursor()
    user = db.execute("SELECT * FROM users WHERE admin = 1").fetchone()
    
    if user:
        #select the selected users info from the database
        userInfo = db.execute("SELECT * FROM info WHERE user_id = ?", (user[0],)).fetchone()
        user = User(username=user[1], name=user[4], title=user[7], email=user[3], city=user[5], state=user[6], admin=user[8], id = user[0])
        db.close()
        if userInfo:
            return {
                "name": user.name,
                "title": user.title,
                "email": user.email,
                "city": user.city,
                "state": user.state,
                "bio": userInfo[2],
            }
        else:
            return {
                "name": user.name,
                "title": user.title,
                "email": user.email,
                "city": user.city,
                "state": user.state,
                "bio": "No bio found",
            }
    #if no user is found return a 404
    
    else:
        db.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user found",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.post("/authorInfo")
async def edit_page_author_info(request: Request,  db: sqlite3.Connection = Depends(getDB) , currentUser: User = Depends(get_current_user))  -> Union[dict, bool]:
    bio =  await request.json()
    bio = bio['bio']
    db = db.cursor()
    if currentUser.admin == 1:
        #query to update user bio
        db.execute("UPDATE info SET bio = ? WHERE user_id = ? ", (bio,currentUser.id))
    else:
        db.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    db.close()
    dbCommit()
    return {
        "response":True
    }
        
@app.post("/authorPersonalInfo")
async def edit_page_author_personal_info(request: Request,  db: sqlite3.Connection = Depends(getDB) , currentUser: User = Depends(get_current_user))  -> Union[dict, bool]:
    personalInfo =  await request.json()
    print(personalInfo)
    db = db.cursor()
    if currentUser.admin == 1:
        #query to update user bio
        db.execute("UPDATE users SET name = ?, title = ?, email = ?, city = ?, state = ? WHERE id = ?", (personalInfo['name'], personalInfo['title'], personalInfo['email'], personalInfo['city'], personalInfo['state'], currentUser.id))
    else:
        db.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    db.close()
    dbCommit()
    return {
        "response":True
    }

@app.get("/theme" , response_model=Theme)
async def setSiteTheme(db: sqlite3.Connection = Depends(getDB), user: User = Depends(get_current_user_or_none)) -> Union[dict, str]:
    db = db.cursor()
    if user is None:
        #select theme matching admin acount
        theme = db.execute("SELECT * FROM siteThemes WHERE user_id = ?", (1,)).fetchone()
    else:
        #select theme matching user acount
        theme = db.execute("SELECT * FROM siteThemes WHERE user_id = ?", (user.id,)).fetchone()
    #add rows 2 through 9 to a Theme object
    theme = Theme(background_default=theme[2],primary_main=theme[3], primary_contrast= theme[4], backup_main= theme[5], backup_contrast= theme[6], secondary_main= theme[7], error=theme[8])

    db.close()
    return theme

@app.post("/theme")
async def setSiteTheme(request: Request, db: sqlite3.Connection = Depends(getDB), user: User = Depends(get_current_user)) -> Union[dict, str]:
    db = db.cursor()
    theme = await request.json()
    #check the user is an admin
    flag = True
    if user.admin == 1:
        #update theme matching user_id in theme table
        try:
            db.execute("UPDATE siteThemes SET background_default = ?, primary_main = ?, primary_contrast = ?, backup_main = ?, backup_contrast = ?, secondary_main = ?, error = ? WHERE user_id = ?", (theme['background_default'], theme['primary_main'], theme['primary_contrast'], theme['backup_main'], theme['backup_contrast'], theme['secondary_main'], theme['error'], user.id))
        except:
            flag = False
    else:
        db.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    db.close()
    dbCommit()
    return {
        "response":flag
    }

