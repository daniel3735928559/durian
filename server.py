from flask import Flask, render_template
from flask.ext.socketio import SocketIO, emit
import random
import numpy as np
from Algorithms import *

app = Flask(__name__)
app.config['SECRET_KEY'] = str(random.random())
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@socketio.on('data', namespace='/elderberry')
def test_message(message):
    print('stuuuuuuuuuuuuu')
    sz = 0
    x = 0
    y = 0
    for i in message:
        x += message[i][0]
        y += message[i][1]
        sz += 1
    x /= sz
    y /= sz
    print(x,y)
    emit('update', {'centroid': [x,y]})


@socketio.on('get_projection', namespace='/elderberry')
def get_projection(message):

    data = get_data()['data']
    labels = get_data()['labels']
    
    selection = message['changed']
    target = np.matrix(message['view'])
    curr = np.matrix(message['old'])
    
    old_proj = None

    abc = pursue_target_closed_from(target, curr, data, old_proj, selection, labels)
    #abc = get_random_view()
    
    emit('projection', {'data': [list(x) for x in abc]})

@socketio.on('init_projection', namespace='/elderberry')
def initial_projection(message):
    print('asd')
    view,desc = get_random_view()
    emit('projection', {'data': [list(view[i])+[desc[i]] for i in range(len(view))]})

@socketio.on('my broadcast event', namespace='/elderberry')
def test_message(message):
    emit('my response', {'data': message['data']}, broadcast=True)

@socketio.on('connect', namespace='/elderberry')
def test_connect():
    print('Client connected')
    emit('my response', {'data': 'Connected'})

@socketio.on('disconnect', namespace='/elderberry')
def test_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    app.debug=True
    socketio.run(app,host='0.0.0.0',port=3797)
