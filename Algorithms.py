from __future__ import division
import numpy as np
import math
from sklearn import datasets, linear_model
from Utils import *
from make_fake_blog import make_data


#--------------------------------------------------------------------
# Data created so that we clearly separate positive and negative words
# A = np.load('DATA/extreme_positve_negative.npy')
# desc = load_data('DATA/extreme_positive_negative_description')
#--------------------------------------------------------------------

#--------------------------------------------------------------------
# Data created from Wikipedia
# A = np.load('DATA/circle_data.npy')
# desc = load_data('DATA/circle_desc')
#--------------------------------------------------------------------

#--------------------------------------------------------------------
# NeXT emotional words data, gotten from Eigen words
# A = np.load('DATA/next_data.npy')
# desc = load_data('DATA/next_desc')
#--------------------------------------------------------------------

# n,p = A.shape
# data = A
# labels = np.zeros(n) # all Unknown labels

#---------Fake blog data--------------------------------
make_data('DATA/fake_blog_data_III', class_choice=True)

data = np.load('DATA/blog_data.npy')
n,p = data.shape
labels = load_data('DATA/labels_blog_data')
#labels = np.zeros(n)
desc = load_data('DATA/description_blog_data')


def get_urls():

    return ["01F_AN_O.jpeg","01F_CA_C.jpeg","01F_CA_O.jpeg","01F_DI_C.jpeg","01F_DI_O.jpeg","01F_FE_C.jpeg","01F_FE_O.jpeg","01F_HA_C.jpeg","01F_HA_O.jpeg","01F_HA_X.jpeg","01F_NE_C.jpeg","01F_NE_O.jpeg","01F_SA_C.jpeg","01F_SA_O.jpeg","01F_SP_O.jpeg","01f_an_c.jpeg","06F_AN_C.jpeg","06F_AN_O.jpeg","06F_CA_C.jpeg","06F_CA_O.jpeg","06F_DI_C.jpeg","06F_DI_O.jpeg","06F_FE_C.jpeg","06F_FE_O.jpeg","06F_HA_C.jpeg","06F_HA_O.jpeg","06F_HA_X.jpeg","06F_NE_C.jpeg","06F_NE_O.jpeg","06F_SA_C.jpeg","06F_SA_O.jpeg","06F_SP_O.jpeg","09F_AN_C.jpeg","09F_AN_O.jpeg","09F_CA_C.jpeg","09F_CA_O.jpeg","09F_DI_C.jpeg","09F_DI_O.jpeg","09F_FE_C.jpeg","09F_FE_O.jpeg","09F_HA_C.jpeg","09F_HA_O.jpeg","09F_HA_X.jpeg","09F_NE_C.jpeg","09F_NE_O.jpeg","09F_SA_C.jpeg","09F_SA_O.jpeg","09F_SP_O.jpeg","11F_AN_C.jpeg","11F_AN_O.jpeg","11F_CA_C.jpeg","11F_CA_O.jpeg","11F_DI_C.jpeg","11F_DI_O.jpeg","11F_FE_C.jpeg","11F_FE_O.jpeg","11F_HA_C.jpeg","11F_HA_O.jpeg","11F_HA_X.jpeg","11F_NE_C.jpeg","11F_NE_O.jpeg","11F_SA_C.jpeg","11F_SA_O.jpeg","11F_SP_O.jpeg","12F_AN_C.jpeg","12F_AN_O.jpeg","12F_CA_C.jpeg","12F_CA_O.jpeg","12F_DI_C.jpeg","12F_DI_O.jpeg","12F_FE_C.jpeg","12F_FE_O.jpeg","12F_HA_C.jpeg","12F_HA_O.jpeg","12F_HA_X.jpeg","12F_NE_C.jpeg","12F_NE_O.jpeg","12F_SA_C.jpeg","12F_SA_O.jpeg","12F_SP_O.jpeg","13F_AN_C.jpeg","13F_AN_O.jpeg","13F_CA_C.jpeg","13F_CA_O.jpeg","13F_DI_C.jpeg","13F_DI_O.jpeg","13F_FE_C.jpeg","13F_FE_O.jpeg","13F_HA_C.jpeg","13F_HA_O.jpeg","13F_HA_X.jpeg","13F_NE_C.jpeg","13F_NE_O.jpeg","13F_SA_C.jpeg","13F_SA_O.jpeg","13F_SP_O.jpeg","20M_AN_C.jpeg","20M_AN_O.jpeg","20M_CA_C.jpeg","20M_CA_O.jpeg","20M_DI_O.jpeg","20M_FE_C.jpeg","20M_FE_O.jpeg","20M_HA_C.jpeg","20M_HA_O.jpeg","20M_HA_X.jpeg","20M_NE_C.jpeg","20M_NE_O.jpeg","20M_SA_C.jpeg","20M_SA_O.jpeg","20M_SP_O.jpeg","21M_AN_C.jpeg","21M_AN_O.jpeg","21M_CA_C.jpeg","21M_CA_O.jpeg","21M_DI_C.jpeg","21M_DI_O.jpeg","21M_FE_C.jpeg","21M_FE_O.jpeg","21M_HA_C.jpeg","21M_HA_O.jpeg","21M_HA_X.jpeg","21M_NE_C.jpeg","21M_NE_O.jpeg","21M_SA_C.jpeg","21M_SA_O.jpeg","21M_SP_O.jpeg","25M_AN_C.jpeg","25M_AN_O.jpeg","25M_CA_C.jpeg","25M_CA_O.jpeg","25M_DI_C.jpeg","25M_DI_O.jpeg","25M_FE_O.jpeg","25M_HA_C.jpeg","25M_HA_O.jpeg","25M_HA_X.jpeg","25M_NE_C.jpeg","25M_SA_C.jpeg","25M_SA_O.jpeg","25M_SP_O.jpeg","39M_AN_C.jpeg","39M_AN_O.jpeg","39M_CA_C.jpeg","39M_CA_O.jpeg","39M_DI_C.jpeg","39M_DI_O.jpeg","39M_FE_C.jpeg","39M_FE_O.jpeg","39M_HA_C.jpeg","39M_HA_O.jpeg","39M_HA_X.jpeg","39M_NE_C.jpeg","39M_NE_O.jpeg","39M_SA_C.jpeg","39M_SA_O.jpeg","39M_SP_O.jpeg","40M_AN_C.jpeg","40M_AN_O.jpeg","40M_CA_C.jpeg","40M_CA_O.jpeg","40M_DI_C.jpeg","40M_DI_O.jpeg","40M_FE_C.jpeg","40M_FE_O.jpeg","40M_HA_C.jpeg","40M_HA_O.jpeg","40M_HA_X.jpeg","40M_NE_C.jpeg","40M_NE_O.jpeg","40M_SA_C.jpeg","40M_SA_O.jpeg","40M_SP_O.jpeg","43M_AN_C.jpeg","43M_AN_O.jpeg","43M_CA_C.jpeg","43M_CA_O.jpeg","43M_DI_C.jpeg","43M_DI_O.jpeg","43M_FE_C.jpeg","43M_FE_O.jpeg","43M_HA_C.jpeg","43M_HA_O.jpeg","43M_HA_X.jpeg","43M_NE_C.jpeg","43M_NE_O.jpeg","43M_SA_C.jpeg","43M_SA_O.jpeg","43M_SP_O.jpeg"]


    # return ["AlOH3_BS.png","BS_BF3.png","BS_Br2.png","BS_C2H3Cl.png","BS_C2H3OH.png","BS_C2H5F.png","BS_C2H6.png","BS_C2HCl.png","BS_C3H4.png","BS_C3H5F.png","BS_C3H5OH.png","BS_C4H3Cl.png","BS_C4H3F.png","BS_C4H9OH.png","BS_C5H11Cl.png","BS_C5H11F.png","BS_C5H7Cl.png","BS_C5H9Cl.png","BS_C6H12(Cyclohexane).png","BS_CCl4.png","BS_CH3-.png","BS_CH3Br.png","BS_CH3F.png","BS_CO2.png","BS_CO3(2-).png","BS_CaCl2.png","BS_Cl2.png","BS_F2.png","BS_H2O2.png","BS_H2SO4.png","BS_HNO3.png","BS_LAlanine.png","BS_LiBr.png","BS_N2O.png","BS_NF3.png","BS_NO3-.png","BS_NaBr.png","BS_PO4(3-).png","BS_SO2.png","BrF_BS.png","C2F6_BS.png","C2H7N_dimethylamine_BS.png","C3F8_BS.png","C3H8O3_glycerol_BS.png","C3H9N_trimethylamine_BS.png","C6H11NH2_cyclohexamine_BS.png","C6H7N_analine_BS.png","Cl-_BS.png","Mg(OH)2_BS.png","NO_BS.png"]

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

    if math.fabs(approx_view.max()) > 1 or math.fabs(approx_view.min()) > 1:
        approx_view = (0.9/np.max([math.fabs(approx_view.max()), math.fabs(approx_view.min())]))*approx_view

            
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
    
