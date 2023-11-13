### Needed to enable websocket ###
import eventlet
eventlet.monkey_patch()
#################################
from devoper import app, socketio
from flask_socketio import SocketIO


if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0')
