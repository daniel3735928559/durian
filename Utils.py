import pickle
import numpy as np
# Saving data using pickle
def save_data(data, filename):
    """
    Function saves data to a file using picke
    
    Args:
    data: The object we want to saves
    filename: The name of the file we want to save it as
    
    """
    f = open(filename,'w')
    pickle.dump(data,f)
    f.close()
    
# Load data
def load_data(filename):
    """
    Loads saved data from a file
    
    Args:
    filename: The name of the file to load from
    """
    f = open(filename,'r')
    data = pickle.load(f)
    f.close()
    return data

