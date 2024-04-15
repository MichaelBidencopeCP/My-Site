import sqlite3
import os
from authentication import Authentication

class Database():
    __instance = None
    @staticmethod
    def get_instance():
        if Database.__instance is None:
            Database()
        return Database.__instance

    def __init__(self):
        if Database.__instance is not None:
            raise Exception("SQLiteDB instance already exists. Use get_instance() method to access it.")
        else:
            Database.__instance = self
            self.conn = sqlite3.connect("database.db", check_same_thread=False)
            self.cursor = self.conn.cursor()
            self.create_database_if_not_exists()

    def create_database_if_not_exists(self):
        auth = Authentication()
        cursor = self.cursor
        #create tables
        cursor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL, email TEXT NOT NULL, name TEXT NOT NULL, city TEXT NOT NULL, state TEXT NOT NULL, title TEXT NOT NULL, admin INTEGER NOT NULL DEFAULT 0)")
        cursor.execute("CREATE TABLE IF NOT EXISTS info (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, bio TEXT NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id))")
        cursor.execute("CREATE TABLE IF NOT EXISTS siteThemes (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, background_default TEXT NOT NULL, primary_main TEXT NOT NULL, primary_contrast TEXT NOT NULL, backup_main TEXT NOT NULL, backup_contrast TEXT NOT NULL, secondary_main TEXT NOT NULL, error TEXT NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id))")
        cursor.execute("CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT NOT NULL, image TEXT, link TEXT )")
        cursor.execute("CREATE TABLE IF NOT EXISTS technologies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, image TEXT NOT NULL)")
        cursor.execute("CREATE TABLE IF NOT EXISTS projectTechnologies (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER NOT NULL, technology_id INTEGER NOT NULL, FOREIGN KEY(project_id) REFERENCES projects(id), FOREIGN KEY(technology_id) REFERENCES technologies(id))") 
        cursor.execute("CREATE TABLE IF NOT EXISTS updates (id INTEGER PRIMARY KEY AUTOINCREMENT, update_key INTEGER NOT NULL)")
        cursor.execute("CREATE TABLE IF NOT EXISTS siteSettings (id INTEGER PRIMARY KEY AUTOINCREMENT, extras INT NOT NULL)")
        #check if any users exist
        cursor.execute("SELECT * FROM users")
        users = cursor.fetchall()
        if len(users) == 0:
            #create admin user and place holder data
            cursor.execute("INSERT INTO users (username, password, email, name, city, state, title, admin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", ("admin", auth.get_password_hash("admin"),"test", "admin", "admin", "admin", "admin", 1))
            cursor.execute("INSERT INTO info (user_id, bio) VALUES ((SELECT id FROM users ), ?)", ( "test",))
            cursor.execute("INSERT INTO siteThemes (user_id, background_default, primary_main, primary_contrast, backup_main, backup_contrast, secondary_main, error) VALUES ((SELECT id FROM users ), ?, ?, ?, ?, ?, ?, ?)", ("#787878", "#4A7C59", "#000000", "#2F4C45", "#AFC299", "#C8D5B9", "#92140C"))
            cursor.execute("INSERT INTO updates (update_key) VALUES (?)", (0,))
            cursor.execute("INSERT INTO siteSettings (extras) VALUES (?)", (0,))
        self.conn.commit()
        
    
