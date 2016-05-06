import sys
sys.path.append("../")
from Utils import *
import numpy as np

# negative =[
#     "terrible",\
#     "devastating",\
#     "awful",\
#     "painful",\
#     "cruel",\
#     "murderous",\
#     "despicable",\
#     "malicious",\
#     "despicable",\
#     "malicious",\
#     "stupid",\
#     "banal",\
#     "decaying",\
#     "rotten",\
#     "unwanted",\
#     "unhealthy",\
#     "ugly",\
#     "disgusting",\
#     "filthy",\
#     "dead",\
#     "corrosive",\
#     "severe",\
#     "vice",\
#     "wicked",\
#     "noxious",\
#     "gruesome"
# ]

# positive =[
#     "awesome",
#     "wonderful",
#     "delightful",
#     "positive",
#     "happy",
#     "pleasant",
#     "encouraging",
#     "jolly",
#     "beautiful",
#     "helpful",
#     "generous",
#     "kind",
#     "lovely",
#     "healthy",
#     "wholesome",
#     "sunny",
#     "refreshing",
#     "impressive",
#     "excellent",
#     "fabulous",
#     "brave",
#     "commendable",
#     "corageous",
#     "appealing",
#     "good",
#     "wise",
#     "benevolent"
# ]

# circle_data, circle_desc
# words =[
#     'delighted',
#     'astonished',
#     'excited',
#     'happy',
#     'pleased',
#     'content',
#     'serene',
#     'calm',
#     'relaxed',
#     'sleepy',
#     'tired',
#     'bored',
#     'depressed',
#     'miserable',
#     'frustrated',
#     'annoyed',
#     'angry',
#     'afraid',
#     'alaramed'
       
# ]

# next_data, next_circle
words = ['hopelessness',
  'pride',
  'woe',
  'glumness',
  'terror',
  'frustration',
  'enthusiasm',
  'hate',
  'insecurity',
  'fondness',
  'neglect',
  'gladness',
  'anxiety',
  'embarrassment',
  'disgust',
  'euphoria',
  'elation',
  'optimism',
  'agony',
  'hope',
  'jubilation',
  'humiliation',
  'despair',
  'apprehension',
  'dislike',
  'irritation',
  'compassion',
  'cheerfulness',
  'pleasure',
  'desire',
  'passion',
  'mortification',
  'rage',
  'pity',
  'resentment',
  'fear',
  'defeat',
  'isolation',
  'exasperation',
  'guilt',
  'scorn',
  'spite',
  'worry',
  'sadness',
  'zest',
  'grouchiness',
  'jolliness',
  'excitement',
  'arousal',
  'bitterness',
  'lust',
  'dread',
  'liking',
  'amusement',
  'fury',
  'melancholy',
  'unhappiness',
  'thrill',
  'misery',
  'alarm',
  'exhilaration',
  'amazement',
  'triumph',
  'annoyance',
  'surprise',
  'suffering',
  'sentimentality',
  'aggravation',
  'caring',
  'remorse',
  'loathing',
  'hurt',
  'envy',
  'delight',
  'longing',
  'tenseness',
  'hostility',
  'hysteria',
  'satisfaction',
  'enthrallment',
  'panic',
  'grief',
  'bliss',
  'outrage',
  'contentment',
  'anger',
  'dismay',
  'depression',
  'enjoyment',
  'ecstasy',
  'zeal',
  'affection',
  'love',
  'ferocity',
  'displeasure',
  'rapture',
  'homesickness',
  'shame',
  'anguish',
  'gaiety',
  'rejection',
  'sympathy',
  'gloom',
  'grumpiness',
  'sorrow',
  'torment',
  'astonishment',
  'nervousness',
  'happiness',
  'regret',
  'revulsion',
  'horror',
  'loneliness',
  'agitation',
  'eagerness',
  'contempt',
  'attraction',
  'dejection',
  'insult',
  'fright',
  'alienation',
  'adoration',
  'relief',
  'vengefulness',
  'infatuation',
  'joy',
  'glee',
  'tenderness',
  'disappointment',
  'distress',
  'joviality',
  'uneasiness',
  'jealousy',
  'wrath',
  'shock']


X = []
desc = []
with open('/Users/aritrabiswas/Downloads/eigenwords.300k.200.en') as f:
    a = f.readlines()

for i,row in enumerate(a):

    temp = row.split(' ', 1)
    word = temp[0]
    
    vector = temp[1]
    
    if word in words:
        print word
        X.append(vector.split())
        desc.append(word)
X = np.array(X).astype(float)

missing = set(words) - set(desc) 

np.save('../DATA/next_data', X, allow_pickle=True)
save_data(desc, '../DATA/next_desc')

    
