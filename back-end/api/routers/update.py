from fastapi import APIRouter, Depends
import sqlite3
from api.database import Database
from api.projectTypes import User
from api.authentication import Authentication
from api.common import getCurrentUser, getDB, dbCommit, getAuth

router = APIRouter()


@router.get("/update")
async def updateLocalCheck(db: sqlite3.Connection = Depends(getDB) ):
    db = db.cursor()
    result = db.execute("SELECT * FROM updates").fetchone()
    return result[1]

@router.post("/update")
async def updateLocal(db: sqlite3.Connection = Depends(getDB), user: User = Depends(getCurrentUser) ):
    if user.admin == 1:
        db = db.cursor()
        db.execute("UPDATE updates SET update_key = update_key + 1")
        db.execute("SELECT * FROM updates").fetchone()
        dbCommit()
        db.close()

        return {"message": "Update key incremented"}
    else:
        #when user updates theme and is not an admin it will return this message
        return {"message": "This is fine"}
