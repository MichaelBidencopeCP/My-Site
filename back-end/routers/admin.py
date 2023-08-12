
from fastapi import APIRouter, Depends, HTTPException, status, Request
import sqlite3
from projectTypes import User, Technologie
from typing import Union
from common import get_current_user, getDB, dbCommit


router = APIRouter()

#remove technology from site
@router.post("/remove-technology")
async def deleteProjectTechnology(tags:dict, db:sqlite3.Connection = Depends(getDB), user: User = Depends(get_current_user)) -> bool:
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
async def postProjectTechnology(technology: Technologie, db:sqlite3.Connection = Depends(getDB), user: User = Depends(get_current_user)) -> int:
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