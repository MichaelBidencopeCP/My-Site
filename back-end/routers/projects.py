from fastapi import APIRouter, Depends, HTTPException, status, Request
import sqlite3
from ..projectTypes import User, Project, Technologie,ProjectOut
from ..common import getCurrentUser, getDB, dbCommit
from typing import Union

router = APIRouter()

#post request to add project can only be accessed by admin user
@router.post("/projects")
async def create_proejct(request: Request, db:sqlite3.Connection = Depends(getDB), user: User = Depends(getCurrentUser)) :
    """
        Post a new project to the database
    """
    db = db.cursor()
    project = await request.json()
    print(project)
    
    if user.admin != 1:
        db.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if project['image'] == "":
        project['image'] = None
    if project['link'] == "":
        project['link'] = None
    if project['description'] == "" or project['name']== "":
        db.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    #insert project into database
    db.execute("INSERT INTO projects (title, description, image, link) VALUES (?, ?, ?, ?)", (project['name'], project['description'], project['image'], project['link']))
    
    dbCommit()
    projectId = db.lastrowid
    #insert technologies into database
    for x in project['technologies']:
        db.execute("INSERT INTO projectTechnologies (project_id, technology_id) VALUES (?, ?)", (projectId, x))
    db.close()
    dbCommit()
    return {
        "response":True
    }

 
@router.get("/projects")
@router.get("/projects/{id}")
def get_project(id: Union[int,None] = None, db:sqlite3.Connection = Depends(getDB)) -> Union[dict, str]:
    """
        Get project by id from the database
    """
    db = db.cursor()
    query = """
        SELECT projects.id, projects.title, projects.description, projects.link, projects.image , technologies.name, technologies.image
        FROM projects
        LEFT JOIN projectTechnologies ON projects.id = projectTechnologies.project_id
        LEFT JOIN technologies ON projectTechnologies.technology_id = technologies.id
    """
    if id is not None:
        query += 'WHERE projects.id = ?'
        projects = db.execute(query, (id,)).fetchall()
    projects = db.execute(query).fetchall()
    projectDict = {}
    for x in projects:
        if str(x[0]) in projectDict:
            projectDict[str(x[0])].technologies.append({'name':x[5], 'image':x[6]})
        else:
            projectDict[str(x[0])]=(ProjectOut(id=x[0], name=x[1], description = x[2], link=x[3], image=x[4], technologies=[{'name':x[5], 'image':x[6]}]))
    return {
        "projects":projectDict
    }

#get list of all technologies on site to be used in project creation
@router.get("/technologies")
async def getProjectTechnologies(db : sqlite3.Connection = Depends(getDB), technologies: Union[list,None] = None) -> list:
    db = db.cursor()
    if technologies == None:
        technologies = db.execute("SELECT id, name, image FROM technologies").fetchall()
        returns = []
        for x in technologies:
            returns.append(Technologie(id=x[0], name=x[1], image=x[2]))
    else:
        #get all technologies in the list
        pass
    db.close()
    return returns

#delete project from database
@router.post("/projects/delete")
async def deleteProject(request: Request, db:sqlite3.Connection = Depends(getDB), user: User = Depends(getCurrentUser)) :
    db = db.cursor()
    #check that user is admin
    if user.admin != 1:
        db.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin access required",
        )
    #check that project exists
    data = await request.json()
    projects = data['projects']
    if len(projects) == 0:
        db.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project not found",
        )
    #delete project from database
    for x in projects:
        db.execute("DELETE FROM projects WHERE id = ?", (x,))
        db.execute("DELETE FROM projectTechnologies WHERE project_id = ?", (x,))
    db.close()
    dbCommit()
    return {
        "response":True
    }
    



