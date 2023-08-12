from pydantic import BaseModel
from typing import Union
from typing_extensions import Annotated

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

class UserWithHash(User):
    passwordHash: str

class TokenData(BaseModel):
    username: str = None

class Theme(BaseModel):
    background_default: str
    primary_main: str
    primary_contrast: str
    backup_main: str
    backup_contrast: str
    secondary_main: str
    error: str

class Project(BaseModel):
    id: int
    name: str
    description: str
    technologies: list
    image: Union[str, None]
    link: Union[str, None]

class Technologie(BaseModel):
    id: Union[int, None]
    name: str
    image: str

class ProjectOut(Project):
    technologies: list