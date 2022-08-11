from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

import os

load_dotenv()
SQL_USER = os.getenv("SQL_USER")
SQL_PASSWORD = os.getenv("SQL_PASSWORD")
SQL_DATABASE = os.getenv("SQL_DATABASE")
SQL_HOST = os.getenv("SQL_HOST")

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql://{SQL_USER}:{SQL_PASSWORD}@{SQL_HOST}/{SQL_DATABASE}'

app.config["DEBUG"] = True
db = SQLAlchemy(app)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_name = db.Column(db.String(80), unique=True, nullable=False)
    discription = db.Column(db.Text())
    image = db.Column(db.String(80))
    priority = db.Column(db.Integer, default=0)

    def __repr__(self):
        return '<User %r>' % self.project_name



@app.route('/')
def index():
    file = url_for('static', filename='SCSS/scss/custom.css')
    return render_template('index.html', file= file)

@app.route('/add-project', methods=['GET', 'POST'])
def add_project():
    if request.method == 'POST':
        project_name = request.form['project_name']
        discription = request.form['discription']
        priority = request.form['priority']

        new_project = Project(project_name=project_name, discription=discription, priority=priority)

        db.session.add(new_project)
        if db.session.commit():

            return redirect(url_for('index'))
        else:
            return render_template('add-project.html', error='Error adding project')
    else:
        return render_template('add-project.html' )

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)