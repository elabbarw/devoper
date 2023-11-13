from flask import Flask, session, redirect, url_for, render_template, request
import msal, requests, uuid, json, os
from functools  import wraps, update_wrapper
from flask_socketio import SocketIO
from devoper.models import auth
from flask_session_azure    import storage_account_interface

socketio = SocketIO()

basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)



### Storage for login session data ###
app.config.from_object(auth)
storage_az_string = auth.secclient('devoperconstring')  ## Connection string to mitacloudops storage account
app.secret_key = auth.secclient('devopersessions') ## Secret Key for session data encryption 
app.session_interface = storage_account_interface(storage_az_string,table_name="devopersessions") ## Session data is presisted on Azure Tables with AES encryption
######



@app.route("/login")
def login():
    session["state"] = str(uuid.uuid4())
    # Technically we could use empty list [] as scopes to do just sign in,
    # here we choose to also collect end user consent upfront
    auth_url = _build_auth_url(scopes=auth.SCOPE, state=session["state"])

    return render_template('layouts/other-default.html', content=render_template('pages/login.html', auth_url=auth_url))


# Its absolute URL must match your app's redirect_uri set in AAD
@app.route(auth.REDIRECT_PATH)
def authorized():
    if request.args.get('state') != session.get("state"):
        return redirect(url_for("DevOper.index"))  # No-OP. Goes back to OpsIndex.index page

    if "error" in request.args:  # Authentication/Authorization failure
        return render_template('layouts/other-default.html', content=render_template('pages/auth_error.html'), result=request.args)
    if request.args.get('code'):
        cache = _load_cache()
        result = _build_msal_app(cache=cache).acquire_token_by_authorization_code(
            request.args['code'],
            scopes=auth.SCOPE,  # Misspelled scope would cause an HTTP 400 error here
            redirect_uri=auth.redirect_uri)
        if "error" in result:
            return render_template('layouts/other-default.html', content=render_template('pages/auth_error.html'), result=result)
        session["user"] = result.get("id_token_claims")
        session.modified = True
        _save_cache(cache)
        
    return redirect(url_for("DevOper.index"))


@app.route("/logout")
def logout():
    session.clear()  # Wipe out user and its token cache from session
    return redirect(  # Also logout from your tenant's web session
        auth.AUTHORITY + "/oauth2/v2.0/logout" +
        "?post_logout_redirect_uri=" + url_for("DevOper.index", _external=True))


def _load_cache():
    cache = msal.SerializableTokenCache()
    if session.get("token_cache"):
        cache.deserialize(session["token_cache"])
    return cache


def _save_cache(cache):
    if cache.has_state_changed:
        session["token_cache"] = cache.serialize()


def _build_msal_app(cache=None, authority=None):
    return msal.ConfidentialClientApplication(
        auth.opsloginid, authority=authority or auth.AUTHORITY,
        client_credential=auth.opsloginsec, token_cache=cache)


def _build_auth_url(authority=None, scopes=None, state=None):
    return _build_msal_app(authority=authority).get_authorization_request_url(
        scopes or [],
        state=state or str(uuid.uuid4()),
        redirect_uri=auth.redirect_uri)


def _get_token_from_cache(scope=None):
    cache = _load_cache()  # This web app maintains one cache per session
    cca = _build_msal_app(cache=cache)
    accounts = cca.get_accounts()
    if accounts:  # So all account(s) belong to the current signed-in user
        result = cca.acquire_token_silent(scope, account=accounts[0])
        _save_cache(cache)
        return result
    

### Login Decorator ### ### Add it to sections you need AAD login whilst entering the AAD role ###
def rolerequired(role):
    def decorator(f):
        def login_function(*args, **kwargs):
            if 'user' in session:
                if 'roles' not in session['user']:
                    session.clear()
                    return render_template('layouts/other-default.html',
                                                content=render_template( 'pages/auth_error.html', result='<h4>User is not authorized to use OPS</h4></br><h4>Contact your admin for access</h4>'))

                if role not in session['user']['roles']:
                    return render_template('layouts/other-default.html',
                                                content=render_template( 'pages/auth_error.html', result=f'<h4>User does not have the {role} role to necessary for this section.</h4></br><h4>Contact your admin for access</h4>'))
            else:
                return redirect(url_for("login"))

            return f(*args, **kwargs)
        return update_wrapper(login_function, f)
    return decorator

from devoper import views   ### Add the views seperately (incase you need to maintain this file seperately)
socketio.init_app(app)