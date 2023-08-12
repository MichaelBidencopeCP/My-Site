
import sqlite3
import dotenv
import os
from datetime import timedelta
from typing_extensions import Annotated
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from routers import update, authorInfo, projects, theme, admin
from projectTypes import Token

from common import get_current_user, getDB, dbCommit, get_current_user_or_none, getAuth, get_user_with_hash

app = FastAPI()



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
app.include_router(update.router)
app.include_router(authorInfo.router)
app.include_router(projects.router)
app.include_router(theme.router)
app.include_router(admin.router)


#lifecycle events
@app.on_event("startup")
async def create_database_if_not_exists():
    getDB()


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
    access_token_expires = timedelta(minutes=45)
    user = auth.authenticate_user(user, form_data.password)
    access_token = auth.create_access_token(
        data={"id":user.id,"admin":user.admin,"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
