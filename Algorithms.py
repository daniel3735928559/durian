from __future__ import division
import numpy as np
import math
from sklearn import datasets, linear_model

def get_random_view():

    iris = datasets.load_iris()
    data = 20*iris['data']
    labels = list(iris['target'])

    p = data.shape[1]
    n = data.shape[0]

    proj = np.random.rand(p,2)

    view = np.dot(data, proj)

    view = np.column_stack((view, labels))
    
    return view
    

def pursue_target_grad_descent(target, curr, data, old_proj, selection):
    '''
    Args:
    
    * target    : the targetted view as decided by user
    * curr      : the current view before user changes
    * old_proj  : the old set of weights that generated current view
    * selection : array of indices of points that have been moved
    '''

    # no points have been changed; nothing to pursue
    if len(selection) == 0:
        return -1

    # extract examples that have been moved
    sel_target = target[selection,:]
    sel_curr = curr[selection, :]
    sel_data = data[selection, :]
    
    # n := number of examples
    n = data.shape[0]
    
    # p := number of features in big data set
    p = data.shape[1]

    # Globals
    TRAINING_RATE = 0.2
    MIN_VALUE = 1e-100
    TRAINING_EPOCH_LIMIT = 500
    TRAINING_ERROR_MARGIN = 1e-5
    TRAINING_CONVERGENCE_MARGIN = 0.001
    TRAINING_MOMENTUM = 0.5
    
    rate = TRAINING_RATE / n

    # Calculate the Frobenius norm of the selected points of the matrix
    # If that norm is < MIN_VALUE throw an exception
    norm_target = np.linalg.norm(sel_target, ord='fro')
    if frob < MIN_VALUE:
        return -1

    # this is a fancy way of saying L2 error on each coordinate separately
    # and then add them up. :) my dumb brain figured this one out.
    # get the frobenius norm of the difference between the target and current view
    prev_error = np.linalg.norm(sel_curr - sel_target, ord='fro')

    epoch = 1;
    while epoch < TRAINING_EPOCH_LIMIT:

        epoch += 1

        # if the error is small enough then quit
        if prev_error < TRAINING_ERROR_MARGIN:
            return {'error':prev_error, 'projection_mat':old_proj}

        # else train and get new weights for projection matrix
        # (Batch train the projection to produce the target when applied to the
        # selected points in the data)        
        # batch := involves training with every single selected point in training set
        # gradient descent step has a Momentum term
        else:
            new_proj = train(sel_target, sel_curr, sel_data, old_proj, rate)
    
        new_view = np.dot(data, new_proj)

        # get new error, based on target and new current view
        # (in their code they divide the new error with norm_target)
        # but they dont for prev_error. WEIRD. I've kept it standard.
        new_error = np.linalg.norm(sel_target - new_view[selection,:])

        # if network has converged then quit
        if math.fabs((new_error - prev_error)/prev_error) < TRAINING_CONVERGENCE_MARGIN:
            old_proj = new_proj
            prev_error = new_error
            return {'error': prev_error, 'projection_mat':old_proj}
        
        # if the net diverged by more than 5%then reduce the rate and reset
        # values to previous
        if new_error > prev_error * 1.05:
            # if we cannot reduce the rate any further then quit            
            if rate < 1e-10:
                return {'error': prev_error, 'projection_mat':old_proj}
            else:
                rate = rate * .5

        else:
            old_proj = new_proj
            prev_error = new_error
            
    return {'error': prev_error, 'projection_mat':old_proj}
    

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

def least_squares_lms(X, y, w, eta):

    grad = 0
    nw = np.zeros(len(w))
    
    # for each weight 
    for i, w_i in enumerate(w):
        for j, x in X:
            prediction = np.dot(x,w_i)
            error = y[j] - prediction
            grad += error*x[j]

        # have full gradient, do the update,
        # not doing any of that momentum bullshit
        nw[i] = w_i + eta*grad

    return nw

def least_squares_optimized(X,y):
    regr = linear_model.LinearRegression()
    regr.fit(X, y)

    return regr.coef_


if __name__ == '__main__':

    print('Test')
    
    v = get_random_view()
