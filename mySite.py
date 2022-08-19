from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from functools import wraps
from dotenv import load_dotenv
import socket

import os

## env variables ##
load_dotenv('/home/ubuntu/my-site/My-Site/.env')

SQL_USER = os.getenv("SQL_USER")
SQL_PASSWORD = os.getenv("SQL_PASSWORD")
SQL_DATABASE = os.getenv("SQL_DATABASE")
SQL_HOST = os.getenv("SQL_HOST")
MY_SITE = os.getenv("MY_SITE")
SECRET_KEY = os.getenv("FLASK_SECRET")
HOUSE_IP = os.getenv("HOUSE_IP")
LOCK_PORT = os.getenv("LOCK_PORT")
LOCK_PASSWORD = os.getenv("LOCK_PASSWORD")
## Flask App ##

app = Flask(__name__)

app.secret_key = SECRET_KEY
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql://{SQL_USER}:{SQL_PASSWORD}@localhost/{SQL_DATABASE}'

app.config["DEBUG"] = True
db = SQLAlchemy(app)



## Database Definition ##
class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_name = db.Column(db.String(80), unique=True, nullable=False)
    discription = db.Column(db.Text())
    image = db.Column(db.String(80))
    priority = db.Column(db.Integer, default=0)
    github = db.Column(db.String(80))
    live = db.Column(db.String(80))
    skills = db.Column(db.String(140))

    def toDict(self):
        return {
            "id": self.id,
            "project_name": self.project_name,
            "discription": self.discription,
            "image": self.image,
            "priority": self.priority,
            "github": self.github,
            "live": self.live
        }

    def __repr__(self):
        return '<%r>' % self.project_name
#holds programing skills
class Skills(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    link = db.Column(db.String(200), unique=True, nullable=False)

    def toDict(self):
        return {
            "id": self.id,
            "link": self.link
        }
    
## End Database Definition ##

## Context Processor ##
@app.context_processor
def loggedin():
    if session.get('user') is None:
        return dict(loggedin=False)
    else:
        return dict(loggedin=True)



## Login Decorator ##
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get('user') is None:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function
## End Login Decorator ##

## Public Routes ##

# Home Page
@app.route('/')
def index():
    
    return render_template('index.html')

# Api Call for Projects
@app.route('/api/projects')
def get_projects():
    #query db for all projects
    projects = Project.query.all()
    returns = []
    for x in projects:
        returns.append(x.toDict())
        
    return jsonify(json_list = returns)

#simple single user login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        try:
            username = request.form['username']
            password = request.form['password']
            print(username, password)
            if str(username) == 'admin':

                if password == MY_SITE:
                    print('session should be set')
                    session['user'] = 1
                    if 'user' in session:
                        print(session['user'])
                    
                    return redirect(url_for('index'))
            raise Exception('Invalid username or password')
        except Exception as e:
            return render_template('login.html', error=e)
    else:
        return render_template('login.html')
##TODO skils to load in skils for form, and another skills/<procject_id> to load skills for project
@app.route('/api/skills')
def get_skills():
    skills = Skills.query.all()
    returns = []
    for x in skills:
        returns.append(x.toDict())
        print    (returns)
        
    return jsonify(json_list = returns)

@app.route('/api/skills/<project_id>')
def get_skills_for_project(project_id):
    #query db for project matching id
    project = Project.query.filter_by(id=project_id).first()
    #get skills
    skillsp = project.skills
    #split skills into list
    skillsp = skillsp.split(',')
    #get skills with matching id from db
    skills = Skills.query.filter(Skills.id.in_(skillsp)).all()
    #order skills to match skills in project
    skills = sorted(skills, key=lambda x: skillsp.index(str(x.id)))
    returns = []
    for x in skills:
        returns.append(x.toDict()['link'])


    return jsonify(json_list = returns)


## End Public Routes ##

## User Routes ##

# adding a project
@app.route('/add-project', methods=['GET', 'POST'])
@login_required
def add_project():
    if request.method == 'POST':
        #check if projectName in post request
        if 'projectName' in request.form:
            try:
                project_name = request.form['projectName']
                if project_name == '':
                    raise Exception('Project name is required')
                discription = request.form['projectDescription']
                priority = request.form['projectPriority']
                skills = request.form['skills']
                github = request.form['github']
                if github == '':
                    github = None
                live = request.form['live']
                if live == '':
                    live = None
                

                new_project = Project(project_name=project_name, discription=discription, priority=priority, skills=skills, github=github, live=live)

                db.session.add(new_project)
                db.session.commit()

                return redirect(url_for('index'))
                
            except Exception as e:
                return render_template('add-project.html', error=e)
        if 'skillUrl' in request.form:
            try:
                skill = request.form['skillUrl']
                if skill == '':
                    raise Exception('Skill is required')
                new_skill = Skills(link=skill)
                db.session.add(new_skill)
                db.session.commit()
                s = 'Skill added'
                return render_template('add-project.html', success=s)
            except Exception as e:
                return render_template('add-project.html', error=e)
    else:
        return render_template('add-project.html' )

# edit a project
@login_required
@app.route('/edit-project/<project_id>', methods=['GET', 'POST'])
def editProject(project_id):
    project = Project.query.filter_by(id=project_id).first()
    if request.method == 'POST':
        try:
            project_name = request.form['projectName']
            if project_name == '':
                raise Exception('Project name is required')
            discription = request.form['projectDescription']
            priority = request.form['projectPriority']
            skills = request.form['skills']
            github = request.form['github']
            if github == '':
                github = None
            live = request.form['live']
            if live == '':
                live = None
            project.project_name = project_name
            project.discription = discription
            project.priority = priority
            project.skills = skills
            project.github = github
            project.live = live
            db.session.commit()
            return redirect(url_for('index'))
        except Exception as e:
            return render_template('edit-project.html', error=e, project=project)
    else:
        return render_template('edit-project.html', project=project)
@login_required
@app.route('/edit')
def edit():
    projects = Project.query.all()
    return render_template('edit.html', projects=projects)


@login_required
@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('index'))


@login_required
@app.route('/home', methods=['GET', 'POST'])
def home():
    
    return render_template('home.html')

@login_required
@app.route('/api/locktriger')
def locktriger():
    lockResponse = make_request()
    return jsonify(json_list = lockResponse)


## End User Routes ##

## FUNCTIONS ##

def make_request():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Connect the socket to the port where the server is listening
    server_address = (HOUSE_IP , int(LOCK_PORT))
    print( f'connecting to {server_address[0]} port {server_address[1]}' )
    sock.connect(server_address)
    response = ""
    try:
        while response != 'done':
            # Send data
            message = LOCK_PASSWORD
            
            sock.sendto(message.encode(), server_address)
            #set response to the data received from the server
            response = sock.recv(1024).decode()
            print ( f'received "{response}"' )
    except:
        return False
    finally:
        print( 'closing socket')
        sock.close()
        return True
    
    
        



#if __name__ == '__main__':
#    app.run(host='0.0.0.0', port=5000)