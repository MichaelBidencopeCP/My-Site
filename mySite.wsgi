activate_this = '/venvs/my-site-venv/bin/activate'
with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate))
from mySite import app as application
 