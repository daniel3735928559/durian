import sys
sys.path.append("../")
from Utils import *
import numpy as np

negative =[
    "terrible",\
    "devastating",\
    "awful",\
    "painful",\
    "cruel",\
    "murderous",\
    "despicable",\
    "malicious",\
    "despicable",\
    "malicious",\
    "stupid",\
    "banal",\
    "decaying",\
    "rotten",\
    "unwanted",\
    "unhealthy",\
    "ugly",\
    "disgusting",\
    "filthy",\
    "dead",\
    "corrosive",\
    "severe",\
    "vice",\
    "wicked",\
    "noxious",\
    "gruesome"
]

positive =[
    "awesome",
    "wonderful",
    "delightful",
    "positive",
    "happy",
    "pleasant",
    "encouraging",
    "jolly",
    "beautiful",
    "helpful",
    "generous",
    "kind",
    "lovely",
    "healthy",
    "wholesome",
    "sunny",
    "refreshing",
    "impressive",
    "excellent",
    "fabulous",
    "brave",
    "commendable",
    "corageous",
    "appealing",
    "good",
    "wise",
    "benevolent"
]

X = []
desc = []
with open('/Users/aritrabiswas/Downloads/eigenwords.300k.200.en') as f:
    a = f.readlines()

for i,row in enumerate(a):

    temp = row.split(' ', 1)
    word = temp[0]
    
    vector = temp[1]
    if word in positive or word in negative:
        print word
        X.append(vector.split())
        desc.append(word)
X = np.array(X).astype(float)

np.save('../DATA/extreme_positve_negative', X, allow_pickle=True)
save_data(desc, '../DATA/extreme_positive_negative_description')

    
