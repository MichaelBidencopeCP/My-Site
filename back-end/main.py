
import sqlite3
import dotenv
import os
from datetime import datetime, timedelta

from typing import Union
from typing_extensions import Annotated

from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel

from database import Database

from authentication import Authentication

from jose import JWTError, jwt


app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    username: str
    name: str
    title: str
    email: str
    city: str
    state: str
    admin: int

class TokenData(BaseModel):
    username: str = None

class UserWithHash(User):
    passwordHash: str

#lifecycle events
@app.on_event("startup")
async def create_database_if_not_exists():
    getDB()

def getDB():
    db = Database().connection
    return db

def getAuth():
    auth = Authentication()
    return auth

def get_user(username:str):
    db = getDB().cursor()
    db.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = db.fetchone()
    user = User(username=user[1], name=user[3], title=user[4], email=user[5], city=user[6], state=user[7], admin=user[8])
    return user
def get_user_with_hash(username:str):

    db = getDB().cursor()
    db.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = db.fetchone()
    user = UserWithHash(username=user[1], name=user[3], title=user[4], email=user[5], city=user[6], state=user[7], admin=user[8], passwordHash=user[2])
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
    userAuth = {"username": user.name, "passwordHash": user.passwordHash}
    user = auth.authenticate_user(userAuth, form_data.password)
    access_token = auth.create_access_token(
        data={"sub": user['username']}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me/", response_model=User)
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user

@app.get("/authorInfo")
def get_author_info(db: sqlite3.Connection = Depends(getDB)) -> Union[dict, str]:
    user = ["test"]
    test = db.execute("SELECT * FROM users").fetchall()
    print(test)
    
    return {
        "name": "Michael Bidencope Test",
        "title": user[0],
        "email": "test@test.test",
    }


