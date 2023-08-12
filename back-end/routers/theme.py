import sqlite3
from projectTypes import User, Theme, Technologie
from common import get_current_user, getDB, dbCommit, get_current_user_or_none
from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import Union

router = APIRouter()

#returns the theme for the site based on the user
@router.get("/theme" , response_model=Theme)
async def setSiteTheme(db: sqlite3.Connection = Depends(getDB), user: User = Depends(get_current_user_or_none)) -> Union[dict, str]:
    db = db.cursor()
    if user is None:
        #select theme matching admin acount
        theme = db.execute("SELECT * FROM siteThemes WHERE user_id = ?", (1,)).fetchone()
    else:
        #select theme matching user acount
        theme = db.execute("SELECT * FROM siteThemes WHERE user_id = ?", (user.id,)).fetchone()
    #add rows 2 through 9 to a Theme object
    theme = Theme(background_default=theme[2],primary_main=theme[3], primary_contrast= theme[4], backup_main= theme[5], backup_contrast= theme[6], secondary_main= theme[7], error=theme[8])

    db.close()
    return theme

#lets logged in user to change the theme of the site
@router.post("/theme")
async def setSiteTheme(request: Request, db: sqlite3.Connection = Depends(getDB), user: User = Depends(get_current_user)) -> Union[dict, str]:
    db = db.cursor()
    theme = await request.json()
    #check the user is an admin
    flag = True
    if user.admin == 1:
        #update theme matching user_id in theme table
        try:
            db.execute("UPDATE siteThemes SET background_default = ?, primary_main = ?, primary_contrast = ?, backup_main = ?, backup_contrast = ?, secondary_main = ?, error = ? WHERE user_id = ?", (theme['background_default'], theme['primary_main'], theme['primary_contrast'], theme['backup_main'], theme['backup_contrast'], theme['secondary_main'], theme['error'], user.id))
        except:
            flag = False
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
        "response":flag
    }
