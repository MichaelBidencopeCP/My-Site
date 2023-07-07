import dotenv
import os

from typing_extensions import Annotated
from datetime import datetime, timedelta

from passlib.context import CryptContext
from jose import jwt

from fastapi.security import OAuth2PasswordBearer





class Authentication():
    #__instance = None
    #def __new__(cls):
    #    if cls.__instance is None:
    #        cls.__instance = super(Authentication, cls).__new__(cls)
    #    return cls.__instance

    def __init__(self):
        dotenv.load_dotenv()
        self.SECRET_KEY = os.getenv("SECRET_KEY")
        self.ALGORITHM = os.getenv("ALGORITHM")
        self.ACCESS_TOKEN_EXPIRE = os.getenv("ACCESS_TOKEN_EXPIRE")
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
    def verify_password(self, plain_password, hashed_password):
        return self.pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password):
        return self.pwd_context.hash(password)
    
    #takes the result of get user and password to authenticate
    def authenticate_user(self, user: dict, password: str):
        if not user:
            return False
        if not self.verify_password( password, user['passwordHash']):
            return False
        return user
        
    def create_access_token(self, data: dict, expires_delta: timedelta):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.SECRET_KEY, algorithm=self.ALGORITHM)
        return encoded_jwt




def getAuth():
    auth = Authentication()
    return auth
