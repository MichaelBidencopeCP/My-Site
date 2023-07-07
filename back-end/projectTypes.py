from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    id : int
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

class Theme(BaseModel):
    background_default: str
    primary_main: str
    primary_contrast: str
    backup_main: str
    backup_contrast: str
    secondary_main: str
    error: str