import sys
sys.path.append('../')
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from Utils import *
import numpy as np

def make_data(input_filename,max_df=0.5, max_features=None,\
                             min_df=2, stop_words='english', use_idf = True ):

    with open(input_filename) as f:
        a = f.readlines()

    data = []
    labels = []
    for row in a:
        temp = row.split('&')
        if len(temp) == 2:
            data.append(temp[1])
            labels.append(temp[0])


    vectorizer = TfidfVectorizer(max_df=0.5, max_features=None,\
                             min_df=2, stop_words='english', use_idf = True)

    X = vectorizer.fit_transform(data)
    X = X.todense()

    np.save('DATA/blog_data',X)
    save_data(labels, 'DATA/labels_blog_data')
    save_data(data, 'DATA/description_blog_data')
