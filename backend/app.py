import os, io
import sys
import flask
import numpy as np
from tensorflow.keras import backend as K
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications import imagenet_utils
from PIL import Image
from flask import request, session
from flask_cors import CORS, cross_origin
import json

app = flask.Flask(__name__)
cors = CORS(app, resources={r"/foo": {"origins": "http://localhost:4200"}})
model = None

def loadmodel():
    global model
    model = load_model('ottermodel.h5')

def prep_image(image, target):
    if (image.mode != "RGB"):
        image = image.convert("RGB")
    image = image.resize(target)
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    image = imagenet_utils.preprocess_input(image)
    return image

def run_model(img):
    cls_list = ['nototters', 'otters']
    pred = model.predict(img)[0]
    top_inds = pred.argsort()[::-1][:5]
    for i in top_inds:
        pass

    if(pred[0]>0.9):
        res = "Not an otter!"
    elif(pred[0]<0.1):
        res = "It's an otter!"
    else:
        res = "Inconclusive.. better predictions coming soon!"
    return res

@app.route("/test", methods=['POST'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def home():
    data = request.files['image'].read()
    data = Image.open(io.BytesIO(data))
    data = prep_image(data, (224,224))

    resp = flask.Response(json.dumps(run_model(data)),  status=200,
        mimetype='application/json')
    return resp

if __name__ == "__main__":
	print("Loading model before starting flask")
	loadmodel()
	app.run(host='0.0.0.0', port=5000)

