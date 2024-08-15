
import sqlite3
import dotenv
import os
from datetime import timedelta
from typing_extensions import Annotated
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from .routers import update, authorInfo, projects, theme, admin
from .projectTypes import Token
from .common import getCurrentUser, getDB, dbCommit, getCurrentUserOrNone, getAuth, getUserWithHash
from contextlib import asynccontextmanager
app = FastAPI()

#lifecycle events
@asynccontextmanager
async def lifespan(app: FastAPI):
    getDB()

origins = [

    "http://localhost:3000",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(update.router)
app.include_router(authorInfo.router)
app.include_router(projects.router)
app.include_router(theme.router)
app.include_router(admin.router)

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    auth = getAuth()
    user = getUserWithHash(form_data.username) 
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=45)
    user = auth.authenticate_user(user, form_data.password)
    access_token = auth.create_access_token(data={"id":user.id,"admin":user.admin,"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register")
async def register(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    try:
        auth = getAuth()
        newUser = auth.create_new_user(form_data.username, form_data.password)
        #check username is not already registered
        if newUser:
            query = "SELECT * FROM users WHERE username = ?"
            db = getDB().cursor()
            db.execute(query, (form_data.username,))
            if db.fetchone():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Username already registered",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            #enter new user into database
            query = "INSERT INTO users (username, password, email, name, city, state, title, admin) VALUES (?, ?, 'email', 'name', 'city', 'state', 'title', 0)"
            db.execute(query, (form_data.username, newUser.passwordHash))
            dbCommit()
            db.close()
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing Fields",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except Exception as e:
        #check if raised exception is a HTTPException
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="There was an error registering the user",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"response":True}