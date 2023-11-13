from flask import render_template, request, session, redirect, Response, flash, get_flashed_messages, Blueprint, jsonify
from devoper import rolerequired
import os, requests, json

DevOperAdmin = Blueprint('DevOperAdmin', __name__, template_folder='templates')

@DevOperAdmin.route('/admin')
@rolerequired('admin_user_access')
def admin():
    try:
        return render_template('layouts/default.html', roles=session['user']['roles'], whodis=session['user']['name'], content=render_template('admin_pages/admin.html'))
    except:
        return render_template('layouts/other-default.html', content=render_template('pages/404.html'))   
    
    
    
@DevOperAdmin.route('/adminfetch', methods=['GET','POST'])
@rolerequired('admin_user_access')
def adminfetch():
    if request.method == 'POST':
        jsondata = request.get_json()
        with open('./devoper/models/devoper.json', 'w+') as json_file:
            json.dump(jsondata,json_file)
            return jsonify(success=True)  
    else:
        with open('./devoper/models/devoper.json') as json_file: 
            devops = json.load(json_file)
            return jsonify(devops)

    
    
    

    
