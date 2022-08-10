from flask import Flask, render_template, request, redirect, url_for, flash, jsonify

app = Flask(__name__)
app.config["DEBUG"] = True

@app.route('/')
def index():
    file = url_for('static', filename='SCSS/scss/custom.css')
    return render_template('index.html', file=file)

if __name__ == '__main__':
    app.run()