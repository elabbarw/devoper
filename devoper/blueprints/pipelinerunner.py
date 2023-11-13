from flask import render_template, request, session, Blueprint, jsonify
from devoper import rolerequired, auth, socketio
from flask_socketio import emit, disconnect
import os, requests, json
from requests.auth import HTTPBasicAuth

DevOper = Blueprint('DevOper', __name__, template_folder='templates')
PAT = auth.secclient('AZURE DEVOPS PAT SECRET STORED IN AZURE KEYVAULT')
header = {"Content-Type": "application/json"}
    

def getinfo(defid,prj,org):
    
    paramlist = requests.get(f'https://dev.azure.com/{prj}/{org}/_apis/build/definitions/{defid}?api-version=5.0', auth=HTTPBasicAuth('basic',PAT))
    statuslist = requests.get(f'https://dev.azure.com/{prj}/{org}/_apis/build/latest/{defid}?api-version=5.0-preview.1', auth=HTTPBasicAuth('basic',PAT))
    
    try:
        variables = [{'name':k, 'options':v} for k,v in paramlist.json()['variables'].items() if 'allowOverride' in v] ## Only pickup variables that can be set at queue time (allowOverride = true)
    except:
        variables = ''
    try:
            status = statuslist.json()['status']
            result = statuslist.json()['result']
            queuetime = statuslist.json()['queueTime']
    except:
            status = ''
            result = ''
            queuetime = ''
            
    result = {'variables': variables, 'status': status, 'result': result, 'queuetime': queuetime}

        
    return result

    
@DevOper.route('/', defaults={'path': 'index.html'})
@DevOper.route('/<path>')
@rolerequired('basic_user_access')
def index(path):
    with open('./devoper/models/devoper.json') as json_file: 
        devops = json.load(json_file)

    try:
        return render_template('layouts/default.html', roles=session['user']['roles'], whodis=session['user']['name'], content=render_template('pages/index.html',groups=session['user']['groups'], devops=devops))
    except:
        return render_template('layouts/other-default.html', content=render_template('pages/404.html'))   

    

@DevOper.route('/pipelinerunner')
@rolerequired('basic_user_access')
def pipelinerunner():
    org = request.args.get('org')
    prj = request.args.get('prj')
    
    deflist = requests.get(f'https://dev.azure.com/{org}/{prj}/_apis/build/definitions?api-version=5.0', auth=HTTPBasicAuth('basic',PAT))
    
   
    jobdefs = [{'name':job['name'],'id':job['id'], 'info': getinfo(job['id'],org,prj) ,'author':job['authoredBy']['displayName'], "org":org,"prj":prj} for job in deflist.json()['value'] if 'OPS' in job['name']]
    

    return jsonify(jobdefs)

@DevOper.route('/pipelinestatus')
@rolerequired('basic_user_access')
def pipelinestatus():
    defid = request.args.get('defid')
    org = request.args.get('org')
    prj = request.args.get('prj')
    
    statuslist = requests.get(f'https://dev.azure.com/{org}/{prj}/_apis/build/latest/{defid}?api-version=5.0-preview.1', auth=HTTPBasicAuth('basic',PAT))
        
    try:
        result = {
            'status':statuslist.json()['status'],
            'result':statuslist.json()['result'],
            'queuetime':statuslist.json()['queueTime']
                  }
    except:
        result = {
            'status':'',
            'result':'',
            'queuetime':''
                  }

    return jsonify(result)

@DevOper.route('/pipelinequeue', methods=['POST'])
@rolerequired('basic_user_access')
def pipelinequeue():
    defid = request.args.get('defid')
    org = request.args.get('org')
    prj = request.args.get('prj')
    paramvalues = {}
    for k, v in request.form.items():
        paramvalues[str(k).replace(f'{defid}-','')] = v # Strip the definition id from the form ids so Azure Devops Recognizes them
    
    body_txt = {'definition': {'id': defid},
                "parameters": json.dumps(paramvalues)
                }
    deflist = requests.post(f'https://dev.azure.com/{org}/{prj}/_apis/build/builds?api-version=5.0', data=json.dumps(body_txt), auth=HTTPBasicAuth('basic',PAT), headers=header)
   
    
    

    return jsonify(deflist.json())



@socketio.on('queue_job', namespace='/pipelinerunner')
@rolerequired('basic_user_access')
def pipelinequeue(message):
    inputjson = json.loads(message)
    formdata = {}
    for k, v in inputjson.items():
        formdata[k] = v
    paramvalues = {}
    
    splitformids =  str(next(iter(formdata))).split('-')
    defid = splitformids[0] ## Get Definition ID from the first form input
    org = splitformids[1] ## Get Organisation Name from the first form input
    prj = splitformids[2] ## Get Project Name from the first form input
    
    for k, v in formdata.items():
        paramvalues[str(k).replace(f'{defid}-','')] = v # Strip the definition id from the form ids so Azure Devops Recognizes them
    
    body_txt = {'definition': {'id': defid},
                "parameters": json.dumps(paramvalues)
                }
    deflist = requests.post(f'https://dev.azure.com/{org}/{prj}/_apis/build/builds?api-version=5.0', data=json.dumps(body_txt), auth=HTTPBasicAuth('basic',PAT), headers=header)
   
    
    if deflist.status_code == 200:
                statusurl = deflist.json()['_links']['self']['href']
                timelineurl = deflist.json()['_links']['timeline']['href']
                complete = False
                
                while not complete:
                    status = (requests.get(statusurl, auth=HTTPBasicAuth('basic',PAT), headers=header)).json()['status']
                    timelinelog = (requests.get(timelineurl, auth=HTTPBasicAuth('basic',PAT), headers=header)).json()['records']
                    timelinetasks = [{"Name":item['name'],"Status":item['state'], "Result":item['result'], "StartTime":str(item['startTime']), "PercentComplete": item['percentComplete']} for item in timelinelog]
                    timelineout = sorted(timelinetasks, key=lambda k: k['StartTime'])
                    emit('job_status','<b><p class="text-white bg-info">Pipeline is Running...</p></b>')
                    emit('job_log',timelineout)
                    if status == 'completed':
                        complete = True
                        if all(x['Result'] == 'succeeded' for x in timelinetasks):
                            emit('job_status', '<b><p class="text-white bg-success">Pipeline Completed Successfully</p></b>')
                        if any(x['Result'] == 'succeeded' for x in timelinetasks) and any(x['Result'] == 'skipped' for x in timelinetasks):
                            emit('job_status', '<b><p class="text-white bg-success">Pipeline Completed Successfully</p></b>')
                        else:
                            emit('job_status', '<b><p class="text-white bg-danger">Pipeline Complete with Failures</p></b>')
                        disconnect()
    else:
        emit('job_status', f'<p class="text-white bg-danger">Error - Code Number: {deflist.status_code}</p>') 
        disconnect()
    
    return 