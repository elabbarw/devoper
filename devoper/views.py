from devoper import app
from devoper.blueprints import *


app.register_blueprint(DevOper)
app.register_blueprint(DevOperAdmin)