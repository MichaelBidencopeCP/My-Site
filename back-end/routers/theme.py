import sqlite3
from ..projectTypes import User, Theme, Technologie
from ..common import getCurrentUser, getDB, dbCommit, getCurrentUserOrNone
from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import Union

router = APIRouter()

#returns the theme for the site based on the user
@router.get("/theme" , response_model=Theme)
async def setSiteTheme(db: sqlite3.Connection = Depends(getDB), user: User = Depends(getCurrentUserOrNone)) -> Union[dict, str]:
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
async def setSiteTheme(request: Request, db: sqlite3.Connection = Depends(getDB), user: User = Depends(getCurrentUser)) -> Union[dict, str]:
    db = db.cursor()
    theme = await request.json()
    #check the user is an admin
    #if user.admin == 1:
        #update theme matching user_id in theme table
    #try:
    if 1 == 1:
        query = "SELECT 1 FROM siteThemes WHERE user_id = ?"
        print(user.id)
        cursor = db.execute(query, (user.id,))
        result = cursor.fetchone()
        update = result is not None
        if update:
            db.execute("UPDATE siteThemes SET background_default = ?, primary_main = ?, primary_contrast = ?, backup_main = ?, backup_contrast = ?, secondary_main = ?, error = ? WHERE user_id = ?", (theme['background_default'], theme['primary_main'], theme['primary_contrast'], theme['backup_main'], theme['backup_contrast'], theme['secondary_main'], theme['error'], user.id))
        else:
            db.execute("INSERT INTO siteThemes (user_id, background_default, primary_main, primary_contrast, backup_main, backup_contrast, secondary_main, error) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (user.id, theme['background_default'], theme['primary_main'], theme['primary_contrast'], theme['backup_main'], theme['backup_contrast'], theme['secondary_main'], theme['error']))
    try:
        print('skip try')
    except Exception as e:
        print("whoopsie doopsies")
        print(e)
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="There was an error updating the theme",
            headers={"WWW-Authenticate": "Bearer"},
        )
    db.close()
    dbCommit()
    return {
        "response":True
    }
