import sqlite3
import os
from authentication import Authentication

class Database():
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
        return cls._instance
    def __init__(self):
        flag = False

        self.database_file = "database.db"
        if not os.path.isfile(self.database_file):
            flag = True
        self.connection = sqlite3.connect(self.database_file, check_same_thread=False)

        self.create_database_if_not_exists(flag)

    
    def create_database_if_not_exists(self,flag:bool):
        
            auth = Authentication()
            cursor = self.connection.cursor()
            #create tables
            cursor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL, email TEXT NOT NULL, name TEXT NOT NULL, city TEXT NOT NULL, state TEXT NOT NULL, title TEXT NOT NULL, admin INTEGER NOT NULL DEFAULT 0)")
            cursor.execute("CREATE TABLE IF NOT EXISTS prortfolio (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, ticker TEXT NOT NULL, shares INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id))")
            cursor.execute("CREATE TABLE IF NOT EXISTS info (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, bio TEXT NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id))")
            cursor.execute("CREATE TABLE IF NOT EXISTS siteThemes (id INTEGER PRIMARY KEY AUTOINCREMENT, primary_color TEXT NOT NULL, secondary_color TEXT NOT NULL, background_color TEXT NOT NULL)")
            #create admin user and place holder data
            cursor.execute("INSERT INTO users (username, password, email, name, city, state, title, admin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", ("admin", auth.get_password_hash("admin"),"test", "admin", "admin", "admin", "admin", 1))

            
        
    