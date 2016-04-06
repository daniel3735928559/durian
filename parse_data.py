import pandas as pd

with open('language') as f:
    a = f.readlines()

data = []
for i in a:
    data.append(i.split())

    
df = pd.DataFrame(data)
