from flask import Flask, render_template, request
from flask.ext.socketio import SocketIO, emit
import random
import numpy as np
from Algorithms import *
import base64, zipfile, csv
from io import StringIO, BytesIO

app = Flask(__name__)
app.config['SECRET_KEY'] = str(random.random())
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/dataset',methods=['POST'])
def load_data():
    print(request.form['dataset'])
    dataset_raw = base64.b64decode(request.form['dataset'])
    print(dataset_raw)
    dataset_file = BytesIO(dataset_raw)
    z = zipfile.ZipFile(dataset_file)
    s = z.read("features.csv").decode('utf-8')
    print(s[:100])
    feature_file = StringIO(s)
    features = list(csv.reader(feature_file))
    s = z.read("descriptions.csv").decode('utf-8')
    print(s[:100])
    descriptions_file = StringIO(s)
    descriptions = list(csv.reader(descriptions_file))
    print(len(descriptions))
    set_data(np.array(features).astype(np.float), descriptions)
    return "asda"

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
    #print(x,y)
    emit('update', {'centroid': [x,y]})

    
@socketio.on('label_change', namespace='/elderberry')
def label_change(message):
    labels[message['index']] = message['label']

@socketio.on('get_projection', namespace='/elderberry')
def get_projection(message):
    print(message)
    data = get_data()['data'] # actual data
    labels = get_data()['labels'] # classes 
    
    selection = message['changed'] # indices of data that have been changed
    target = np.matrix(message['view']) # final view of data
    curr = np.matrix(message['old']) # current view of data
    
    alg = message['algorithm']
    params = message['params']
    
    view,desc, rank = pursue_target_closed_from(target, curr, data, selection, labels, alg, params)

    urls = get_urls()
    emit('projection', {'data': [list(view[i])+[desc[i]] for i in range(len(view))],\
                        'urls':urls,\
                        'ranking': [[int(rank[i][0]),float(rank[i][1])] for i in range(len(rank))]})

@socketio.on('init_projection', namespace='/elderberry')
def initial_projection(message):
    print('asd')
    view,desc, imp = get_random_view()
    print(len(desc),len(view))
    urls = get_urls()
    data = [list(view[i])+[desc[i]] for i in range(len(view))]
    ranking = [[int(imp[i][0]),float(imp[i][1])] for i in range(len(imp))]
    #print(data, ranking)
    emit('projection', {'data': data, 'ranking': ranking, 'urls':urls})

@socketio.on('request_points', namespace='/elderberry')
def request_points(message):
    print(message)
    emit('new_points', {'visible_indices': get_points(message['num'], message['visible_indices'], message['algorithm'])}, broadcast=True)

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
