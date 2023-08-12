
from fastapi import APIRouter, Depends, HTTPException, status, Request
import sqlite3
from projectTypes import User
from common import get_current_user, getDB, dbCommit
from typing import Union


router = APIRouter()


@router.get("/author-info")
def get_author_info(db: sqlite3.Connection = Depends(getDB)) -> Union[dict, str]:
    db = db.cursor()
    user = db.execute("SELECT * FROM users WHERE admin = 1").fetchone()
    
    if user:
        #select the selected users info from the database
        userInfo = db.execute("SELECT * FROM info WHERE user_id = ?", (user[0],)).fetchone()
        user = User(username=user[1], name=user[4], title=user[7], email=user[3], city=user[5], state=user[6], admin=user[8], id = user[0])
        db.close()
        if userInfo:
            return {
                "name": user.name,
                "title": user.title,
                "email": user.email,
                "city": user.city,
                "state": user.state,
                "bio": userInfo[2],
            }
        else:
            return {
                "name": user.name,
                "title": user.title,
                "email": user.email,
                "city": user.city,
                "state": user.state,
                "bio": "No bio found",
            }
    #if no user is found return a 404
    
    else:
        db.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user found",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/author-info")
async def edit_page_author_info(request: Request,  db: sqlite3.Connection = Depends(getDB) , currentUser: User = Depends(get_current_user))  -> Union[dict, bool]:
    bio =  await request.json()
    bio = bio['bio']
    db = db.cursor()
    if currentUser.admin == 1:
        #query to update user bio
        db.execute("UPDATE info SET bio = ? WHERE user_id = ? ", (bio,currentUser.id))
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
