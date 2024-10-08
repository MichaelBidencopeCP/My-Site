
from fastapi import APIRouter, Depends, HTTPException, status, Request
import sqlite3
from api.projectTypes import User, Technologie
from typing import Union
from api.common import getCurrentUser, getDB, dbCommit, getAuth


router = APIRouter()

#remove technology from site
@router.post("/remove-technology")
async def deleteProjectTechnology(tags:dict, db:sqlite3.Connection = Depends(getDB), user: User = Depends(getCurrentUser)) -> bool:
    if user.admin != 1:
        db.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    db = db.cursor()
    try:
        for x in tags['tags']:
            db.execute("DELETE FROM projectTechnologies WHERE technology_id = ?", (x,))
            db.execute("DELETE FROM technologies WHERE id = ?", (x,))
    except Exception as e:
        print(e)
        db.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to save data",
        )
    dbCommit()
    db.close()
    return True

#used to add tags to the site, from there they can be assigned to projects
@router.post("/add-technology")
async def postProjectTechnology(technology: Technologie, db:sqlite3.Connection = Depends(getDB), user: User = Depends(getCurrentUser)) -> int:
    if user.admin != 1:
        db.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    db = db.cursor()
    try:
        res = db.execute("INSERT INTO technologies (name, image) VALUES (?,?)", (technology.name, technology.image))
    except:
        db.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to save data",
        )
    dbCommit()
    db.close()
    return res.lastrowid

#edit the personal info of the author       
@router.post("/author-personal-info")
async def edit_page_author_personal_info(request: Request,  db: sqlite3.Connection = Depends(getDB) , currentUser: User = Depends(getCurrentUser))  -> Union[dict, bool]:
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


@router.post("/change-password")
def change_password(password: dict, db: sqlite3.Connection = Depends(getDB) , currentUser: User = Depends(getCurrentUser)) -> Union[dict, bool]:
    passwordInfo = password
    db = db.cursor()
    auth = getAuth()
    try:
        #query to update user password
        db.execute("UPDATE users SET password = ? WHERE id = ?", (auth.get_password_hash(passwordInfo['password']), currentUser.id))
    except:
        db.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to save data",
        )
    
    db.close()
    dbCommit()
    return {
        "response":True
    }

@router.get("/extras")
def extras(db: sqlite3.Connection = Depends(getDB) , currentUser: User = Depends(getCurrentUser)) -> Union[dict, bool]:
    db = db.cursor()
    if currentUser.admin == 1:
        #query to get extra info
        db.execute("SELECT * FROM siteSettings")
        extras = db.fetchone()
    else:
        db.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    db.close()
    if extras[1] == 0:
        returns = False
    else:
        returns = True

    return {
        "response":returns
    }

@router.post("/extras")
def extrasPost(db: sqlite3.Connection = Depends(getDB) , currentUser: User = Depends(getCurrentUser)) -> Union[dict, bool]:
    
    db = db.cursor()
    selected = db.execute("SELECT extras FROM siteSettings").fetchone()[0]
    if selected == 0:
        selected = 1
    else:
        selected = 0
    if currentUser.admin == 1:
        #query to get extra info
        db.execute("UPDATE siteSettings SET extras = ?", (selected,))

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
#from fastapi import UploadFile
#import boto3
#s3 = boto3.client('s3')
#
#@router.post('add-picture')
#def addProfilePic(file: UploadFile, currentUser: User = Depends(getCurrentUser)) -> bool:
#    #check if photo is correct file type
#    if not (file.content_type == "image/jpeg" or file.content_type == "image/png"):
#        return HTTPException(
#            status_code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
#            detail = "File must be jpeg or png",
#        )
#    if currentUser.admin != 1:
#        return HTTPException(
#            status_code = status.HTTP_401_UNAUTHORIZED,
#            details = "Must be admin to set profile picture",
#            headers = {"WWW-Authenticate": "Bearer"},
#        )
#    #check that bucket exists
#    bucket = s3.create_bucket(Bucket = "portfolio")
#    with open(file, 'rb') as fb:
#        bucket = s3.uploadfile(fb, 'portfolio', 'profilePicture')
#
#    return {
#        "response": True
#    }