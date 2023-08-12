from fastapi import APIRouter, Depends
import sqlite3
from database import Database
from projectTypes import User
from authentication import Authentication
from common import get_current_user, getDB, dbCommit, getAuth

router = APIRouter()


@router.get("/update")
async def updateLocalCheck(db: sqlite3.Connection = Depends(getDB) ):
    db = db.cursor()
    result = db.execute("SELECT * FROM updates").fetchone()
    return result[1]

@router.post("/update")
async def updateLocal(db: sqlite3.Connection = Depends(getDB), user: User = Depends(get_current_user) ):
    if user.admin == 1:
        db = db.cursor()
        db.execute("UPDATE updates SET update_key = update_key + 1")
        db.execute("SELECT * FROM updates").fetchone()
        dbCommit()
        db.close()

        return {"message": "Update key incremented"}
