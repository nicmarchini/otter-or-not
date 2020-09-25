import os
import sys
import glob
import argparse
import flask
import numpy as np
from tensorflow.keras import backend as K
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.preprocessing import image

# initialize our Flask application and the Keras model
app = flask.Flask(__name__)
model = None

def loadmodel():
    global model
    model = load_model('ottermodel.h5')

def run_model(path):

    cls_list = ['nototters', 'otters']
    image_file = path

    img = image.load_img(image_file, target_size=(224,224))

    x = image.img_to_array(img)
    x = preprocess_input(x)
    x = np.expand_dims(x, axis=0)
    pred = model.predict(x)[0]
    top_inds = pred.argsort()[::-1][:5]
    for i in top_inds:
        #print('    {:.3f}  {}'.format(pred[i], cls_list[i]))
        pass

    if(pred[0]>0.9):
        res = 'Not an otter!'
    elif(pred[0]<0.1):
        res = "It's an otter!"
    else:
        res = "Inconclusive... better predictions coming soon!"

    return res

@app.route('/')
def index():
    return ''

@app.route("/test")
def home():
    resp = flask.Response(run_model("uploads/image.jpg"))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

# if this is the main thread of execution first load the model and
# then start the server
if __name__ == "__main__":
	print(("* Loading Keras model and Flask starting server..."
		"please wait until server has fully started"))
	loadmodel()
	app.run()

