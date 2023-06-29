from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from functools import wraps
from dotenv import load_dotenv
import socket
from markupsafe import escape
import datetime
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
LIGHT_PORT = os.getenv("LIGHT_PORT")
KEY = os.getenv("KEY")
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
class DeltaReports(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    status = db.Column(db.Boolean)

    def toDict(self):
        return {
            "id": self.id,
            "date": self.date,
            "status": self.report
        }
class Alerts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    severity = db.Column(db.Integer, default=1)
    date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    message = db.Column(db.String(200))
    alert = db.Column(db.String(200))

    def toDict(self):
        return {
            "id": self.id,
            "date": self.date,
            "message": self.message,
            "alert": self.alert
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

##API CALLS FOR REPORT ON DATA PIPELINE##
@app.route('/api/emergency-alert', methods=['GET', 'POST'])
def emergency_alert():
    if request.method == 'POST':
        #check if header has field authentication
        #raise Exception([x for x in request.headers.keys()])
        if 'Authentication' in [x for x in request.headers.keys()]:
            checks = request.headers['Authentication']
            if str(checks) != str(KEY):
                return jsonify({'auth': 'false'})

            #get post body
            #get message
            request.get_json()
            if request.json['message'] == None:
                return jsonify({'message': 'false'})
            #put message in db
            alert = Alerts(message=request.json['message'], alert='DeltaPipeline')
            db.session.add(alert)
            db.session.commit()
            return jsonify({'message': 'true'})
        else:
            return jsonify({'auth': 'reeee'})


@app.route('/api/dataPipelineReporting', methods=['GET', 'POST'])
def data_pipeline_reporting():
    if request.method == 'POST':
        #check if header has field authentication

        if request.headers.keys() == 'Authentication':
            if request.headers['Authentication'] != KEY:
                return jsonify({'auth': 'false'})


            #get post body
            #check results of post body
            # data in {"0": {"add": 'true'}, "1": {"update": 'true'}, "2": {"delete": 'true'}, "removedCurrent": 'true', "removeOldArchives": 'false', "moveReportToArchive-clean": 'true'}
            #check that all are true other then removedOldArchives
            jsonResponse = request.get_json()
            #changed stuff but im not chagning the name
            x = jsonResponse
            if x['0']['add'] != True or x['1']['update'] != True or x['2']['delete'] != True or x['removedCurrent'] != True or x['moveReportToArchive-clean'] != True:
                data = {'confirm':0}

                #instert failed result into DeltaReports
                result = DeltaReports(status=False, date = jsonResponse['date'])
                db.session.add(result)

            else:
                data = {'confirm':1}
                #instert success result into DeltaReports
                result = DeltaReports(status=True, date = jsonResponse['date'])
                db.session.add(result)
            db.session.commit()
            return jsonify(data)
        else:
            data = {'confirm':0}
        return jsonify(data)
    else:
        return jsonify({'confirm':0})





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
##skils to load in skils for form, and another skills/<procject_id> to load skills for project
@app.route('/api/skills')
def get_skills():
    skills = Skills.query.all()
    returns = []
    for x in skills:
        returns.append(x.toDict())
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
@app.route('/payment')
def payment():
    return render_template('payment.html')

@app.route('/api/time')
def get_time():
    current_time = datetime.datetime.now()
    current_time = current_time - datetime.timedelta(hours=5)
    hours = current_time.hour



    returns =  f"{str(hours).zfill(2)}:{str(current_time.minute).zfill(2)}:{str(current_time.second).zfill(2)}"
    returns = "{"+returns+"}"
    return returns
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

@app.route('/edit-project/<project_id>', methods=['GET', 'POST'])
@login_required
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

@app.route('/edit')
@login_required
def edit():
    projects = Project.query.all()
    return render_template('edit.html', projects=projects)



@app.route('/logout')
@login_required
def logout():
    session.pop('user', None)
    return redirect(url_for('index'))



@app.route('/home', methods=['GET', 'POST'])
@login_required
def home():

    return render_template('home.html')


@app.route('/api/locktriger')
@login_required
def locktriger():
    lockResponse = make_request()
    return jsonify(json_list = lockResponse)

@app.route('/api/lighttrigger/<int:light>/<string:rgb>/<int:brightness>')
@app.route('/api/lighttrigger/<int:light>/<string:rgb>/<int:brightness>/<int:bulb>')
@login_required
def lighttrigger(light, rgb, brightness, bulb = 0):
    frgb = rgb.replace('-', ' ')
    lightResponse = makeLightRequest(frgb, brightness, bulb)
    return jsonify(json_list = lightResponse)

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

def makeLightRequest(rgb,b, bulb = 0):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Connect the socket to the port where the server is listening
    server_address = (HOUSE_IP , int(LIGHT_PORT))
    print( f'connecting to {server_address[0]} port {server_address[1]}' )
    sock.connect(server_address)
    print('going')
    response = ""
    try:
        if bulb == 0:
            while response != 'done':
                # Send data
                message = f"1{str(rgb)}|{str(b)}"
                print(message)
                sock.sendto(message.encode(), server_address)
                #set response to the data received from the server
                response = sock.recv(1024).decode()
                print ( f'received "{response}"' )
        else:
            while response != 'done':
                # Send data
                message = f"2{str(rgb)}|{str(b)}|{bulb}"
                print(message)
                sock.sendto(message.encode(), server_address)
                #set response to the data received from the server
                response = sock.recv(1024).decode()
                print ( f'received "{response}"' )
    except:

        print ( f'error' )
        return False
    finally:
        print( 'closing socket')
        sock.close()
        return True


## End FUNCTIONS ##

## Temp Routs ##
#testing for another token system##
@app.route('/token/<token>')
def token(token):
    if token == '123456789':
        return jsonify({'user': '1'})
    else:
        return jsonify(json_list = '0')

import ast
@app.route('/api/ac-records/')
def ac_records():
    records = []
    #open formated ac record file
    basedir = os.path.abspath(os.path.dirname(__file__))
    with open(basedir+'/ac-record.txt', 'r') as f:
        lines = f.readlines()
        for line in lines:
            #remove /n from end of line
            line = line.rstrip()

            records.append(ast.literal_eval(line))

    return jsonify(records)

## End Temp Routs ##



#if __name__ == '__main__':
#    app.run(host='0.0.0.0', port=5000)