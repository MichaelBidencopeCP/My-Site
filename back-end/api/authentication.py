import dotenv
import os

from typing_extensions import Annotated
from datetime import datetime, timedelta, timezone

from passlib.context import CryptContext
from jose import jwt

from fastapi.security import OAuth2PasswordBearer

from api.projectTypes import UserWithHash





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
        self.ACCESS_TOKEN_EXPIRE = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    def verify_password(self, plain_password, hashed_password):
        return self.pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password):
        return self.pwd_context.hash(password)
    
    #takes the result of get user and password to authenticate
    def authenticate_user(self, user: UserWithHash , password: str):
        if not user:
            return False
        if not self.verify_password( password, user.passwordHash):
            return False
        return user
        
    def create_access_token(self, data: dict):
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(minutes=self.ACCESS_TOKEN_EXPIRE)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.SECRET_KEY, algorithm=self.ALGORITHM)
        return encoded_jwt

    def create_new_user(self, username: str, password: str):
        return UserWithHash(id=0,username=username, passwordHash=self.get_password_hash(password), email="email", name="name", city="city", state="state", title="title", admin=0)
    def change_password(self, user: UserWithHash, password: str):
        return UserWithHash(username=user.username, passwordHash=self.get_password_hash(password))



def getAuth():
    auth = Authentication()
    return auth
