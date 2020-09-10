import os
import sys
import glob
import argparse

import numpy as np
from tensorflow.keras import backend as K
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.preprocessing import image

cls_list = ['nototters', 'otters']

# load the trained model
net = load_model('ottermodel.h5')

image_file = "uploads/image.jpg"

img = image.load_img(image_file, target_size=(224,224))

x = image.img_to_array(img)
x = preprocess_input(x)
x = np.expand_dims(x, axis=0)
pred = net.predict(x)[0]
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

print(res)