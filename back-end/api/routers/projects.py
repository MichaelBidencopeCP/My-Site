from fastapi import APIRouter, Depends, HTTPException, status
import sqlite3
from api.projectTypes import User, Project, Technologie,ProjectOut, Project, NewIndexs
from api.common import getCurrentUser, getDB, dbCommit
from typing import Union

router = APIRouter()

#post request to add project can only be accessed by admin user
@router.post("/projects")
async def create_proejct(project:Project, db:sqlite3.Connection = Depends(getDB), user: User = Depends(getCurrentUser)) :
    """
        Post a new project to the database
    """
    db = db.cursor()
    #get count of projects in database
    db.execute("SELECT COUNT(*) FROM projects")
    count = db.fetchone()[0]
    if user.admin != 1:
        db.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if project.image == "":
        project.image = None
    if project.link == "":
        project.link = None
    if project.description == "" or project.name == "":
        db.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    #insert project into database
    db.execute("INSERT INTO projects (title, description, image, link, project_index) VALUES (?, ?, ?, ?, ?)", (project.name, project.description, project.image, project.link, count))
    
    dbCommit()
    projectId = db.lastrowid
    #insert technologies into database
    for x in project.technologies:
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
        SELECT projects.id, projects.title, projects.description, projects.link, projects.image, projects.project_index, technologies.name, technologies.image, technologies.id
        FROM projects
        LEFT JOIN projectTechnologies ON projects.id = projectTechnologies.project_id
        LEFT JOIN technologies ON projectTechnologies.technology_id = technologies.id
    """
    if id is not None:
        query += 'WHERE projects.id = ?'
        projects = db.execute(query, (id,)).fetchall()
    else:
        projects = db.execute(query).fetchall()
    projectDict = {}
    for x in projects:
        if str(x[0]) in projectDict:
            projectDict[str(x[0])].technologies.append({'id':x[8],'name':x[6], 'image':x[7]})
        else:
            projectDict[str(x[0])]=(ProjectOut(id=x[0], name=x[1], description = x[2], link=x[3], image=x[4], index=x[5], technologies=[{'id':x[8],'name':x[6], 'image':x[7]}]))
    return {
        "projects":projectDict
    }

@router.post("/projects/index")
def update_projects_index(newIndexs: NewIndexs, db:sqlite3.Connection = Depends(getDB), user: User = Depends(getCurrentUser)) -> dict:
    """
        Update the index of all projects based id and index values from user
        Used to reorder projects in the database
        Separate from the main project creation/update endpoints to allow live updates as user drags and drops projects, without saving other unsaved changes
    """
    if user.admin != 1:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin access required",
        )
    db = db.cursor()
    #check that newIndexs is not empty
    if len(newIndexs.indexs) == 0:
        db.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No projects to update",
        )
    query = "UPDATE projects SET project_index = ? WHERE id = ?"
    for x in newIndexs.indexs:
        db.execute(query, (x.index, x.id))
    db.close()
    dbCommit()
    return {
        "response": True,
        "message": "Projects updated successfully"
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
@router.delete("/projects")
async def deleteProject(projects:list[int], db:sqlite3.Connection = Depends(getDB), user: User = Depends(getCurrentUser)) :
    db = db.cursor()
    #check that user is admin
    if user.admin != 1:
        db.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin access required",
        )
    #check that project exists
    if len(projects) == 0 or projects[0] == None:
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

@router.put("/projects")
def editProjects(project:Project, db:sqlite3.Connection = Depends(getDB), user: User = Depends(getCurrentUser)) :
    db = db.cursor()
    #check that user is admin
    if user.admin != 1:
        db.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin access required",
        )
    #check that project exists
    print(project)
    if project.id == None:
        db.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project not found",
        )
    #update project in database
    try:
        db.execute("UPDATE projects SET title = ?, description = ?, image = ?, link = ? WHERE id = ?", (str(project.name), str(project.description), None, None, project.id))
        db.execute("DELETE FROM projectTechnologies WHERE project_id = ?", (project.id,))
        for x in project.technologies:
            print(x.id)
            db.execute("INSERT INTO projectTechnologies (project_id, technology_id) VALUES (?, ?)", (project.id, x.id))
        db.close()
        dbCommit()
    except sqlite3.Error as e:
        db.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project not found"+str(e),
        )
    return {
        "response":True
    }
    



