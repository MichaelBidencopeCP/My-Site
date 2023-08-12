from typing_extensions import Annotated
from fastapi import  HTTPException, status, Depends
from projectTypes import User, UserWithHash, TokenData
from database import Database
from authentication import Authentication
from jose import JWTError, jwt
from typing_extensions import Annotated
from fastapi.security import OAuth2PasswordBearer

##dummy for auth typing
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

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
