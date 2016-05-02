from __future__ import division
import numpy as np
import math
from sklearn import datasets, linear_model
from Utils import *
from make_fake_blog import make_data


#------------DATA scraped from that works----------------
# X = load_data('DATA/emotional_words_vectors')
# X = np.array(X)

# A = np.load('DATA/extreme_positve_negative.npy')
# desc = load_data('DATA/extreme_positive_negative_description')
# n,p = A.shape

# data = A
# labels = np.zeros(n)

#---------Fake blog data--------------------------------
make_data('DATA/fake_blog_data_II')

data = np.load('DATA/blog_data.npy')
labels = load_data('DATA/labels_blog_data')
desc = load_data('DATA/description_blog_data')
n,p = data.shape

#------------Work with ben--------------------------------
# data = np.load('DATA/language.npy')

# data = (0.9/np.max(data))*data
# p = data.shape[1]
# n = data.shape[0]

# labels = np.zeros(n)
# desc = list(np.load('DATA/description.npy'))

#------------------------------------------------------------

def get_random_view():


    proj = np.random.rand(p,2)

    view = np.dot(data, proj)

    view = 0.9/np.max(view)*view
    
    view = np.column_stack((view, labels))

    imp = feature_importance(proj)

    ranking = np.argsort(imp)[::-1]
    values = np.sort(imp)[::-1]

    return view,desc, list(zip(ranking, values))[:20]



def alg_lasso(X,y,alpha):
    print("lasso!",alpha)
    lasso = linear_model.Lasso(alpha=alpha)
    lasso.fit(X,y)
    w = lasso.coef_
    b = lasso.intercept_[0]
    
    return {'weight': w, 'intercept': b}
    
def alg_least_squares_optimized(X,y,params):
    print("regression")

    
    regr = linear_model.LinearRegression()
    regr.fit(X, y)
    w = regr.coef_[0]
    b = regr.intercept_[0]

    return {'weight': w, 'intercept': b}

    
def pursue_target_closed_from(target, curr, data, selection, labels, alg, params):
    '''
    Args:
    
    * target    : the targetted view as decided by user
    * curr      : the current view before user changes
    * old_proj  : the old set of weights that generated current view
    * selection : array of indices of points that have been moved
    * lasso: flag for lasso or regular least squares
    '''
    
    MIN_VALUE = 1e-100
    # no points have been changed; nothing to pursue
    if len(selection) == 0:
        return -1

    # extract examples that have been moved
    #sel_target = target[selection,:]
    sel_target = target
    #sel_curr = curr[selection, :]
    sel_data = np.matrix(data[selection, :])

    # n := number of examples
    n = data.shape[0]
    # p := number of features in big data set
    p = data.shape[1]

    # X coordinate
    X = sel_data
    y = sel_target[:,0]
    
    temp = algs[alg](X,y,params)
    new_proj_x = temp['weight']
    new_proj_int_x = temp['intercept']    

    # Y coordinate
    X = sel_data
    y = sel_target[:,1]

    temp = algs[alg](X,y, params)
    new_proj_y = temp['weight']
    new_proj_int_y = temp['intercept']    
    
    proj =  np.vstack((new_proj_x,  new_proj_y)).T
    approx_view = np.dot(data, proj)

    interecept_matrix_x = new_proj_int_x*np.ones(data.shape[0])
    interecept_matrix_y = new_proj_int_y*np.ones(data.shape[0])
    
    intercept = np.vstack((interecept_matrix_x, interecept_matrix_y)).T

    approx_view = approx_view + intercept

    # print(np.matrix(target))
    # print('\n')
    # print(approx_view)

    if math.fabs(approx_view.max()) > 1:
        approx_view = (0.9/approx_view.max())*approx_view

            
    print(approx_view)
    approx_view = np.column_stack((approx_view, labels))

    importance = feature_importance(proj)

    ranking = np.argsort(importance)[::-1]
    values = np.sort(importance)[::-1]

    return approx_view,desc, list(zip(ranking, values))[:20]

def feature_importance(proj):

    temp = [np.linalg.norm(i) for i in proj]
    return temp

    
def train(targ, curr, data, old_proj, eta, choice='fast'):
    
    '''
    Perform one update step of the batch gradient 
    descent algorithm
    '''

    if choice == 'fast':
        # Solve Least squares for X coordinates
        X = data
        y = targ[:,0]
        w = old_proj[:,0]
        new_proj_x = least_squares_lms(X, y, w, eta)

        # Solve Least squares for Y  coordinates
        X = data
        y = targ[:,1]
        w = old_proj[:,1]
        new_proj_y = least_squares_lms(X, y, w, eta)
        
    else:
        # this needs work
        # do not do this right now
        X = data
        y = targ[:,0]
        new_proj_x = least_squares_optimized(X,y)

        X = data
        y = targ[:,1]
        new_proj_y = least_squares_optimized(X,y)

    return np.matrix([new_proj_x, new_proj_y]).T


def get_data():
    
    return {'data': data, 'labels': labels}


algs = {"lasso":alg_lasso,
        "regression":alg_least_squares_optimized}

if __name__ == '__main__':
    
    d = datasets.make_regression(n_samples=50, n_features=10, n_informative=10,\
                    n_targets=2, bias=0.0, effective_rank=None, \
                    tail_strength=0.5, noise=0.0, shuffle=True, \
                    coef=False, random_state=None)

    target = d[1]
    data = d[0]

    p = data.shape[1]
    n = data.shape[0]

    proj = np.random.rand(p,2)
    curr = np.dot(data, proj)
    
    x = pursue_target_closed_from(target, curr, data, old_proj=None, selection=np.arange(1,10))
    approx_view = np.dot(data, x)
    
