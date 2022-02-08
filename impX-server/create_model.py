import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.api as sm
from statsmodels.tsa.api import ExponentialSmoothing

from datetime import timedelta, date


# Create a date range
def daterange(date1, date2):
    for n in range(int ((date2 - date1).days)+1):
        yield date1 + timedelta(n)


# This API required to create the model and save
def create_model(filepath):
    
    # Read the file and create dataframe
    df = pd.read_csv(filepath)
    # Drop ID column
    df = df.drop("ID", axis=1)

    # Converting Datetime to datetime format
    df['date'] = pd.to_datetime(df['Datetime'])
    # set date as index column
    df.set_index('date', inplace=True)

    #Creating train and test set 
    #Index
    train=df[0:15000] 
    test=df[15000:]

    #Aggregating the dataset at daily level
    df.Timestamp = pd.to_datetime(df.Datetime,format='%d-%m-%Y %H:%M') 
    df.index = df.Timestamp 
    df = df.resample('D').mean()
    train.Timestamp = pd.to_datetime(train.Datetime,format='%d-%m-%Y %H:%M') 
    train.index = train.Timestamp 
    train = train.resample('D').mean() 
    test.Timestamp = pd.to_datetime(test.Datetime,format='%d-%m-%Y %H:%M') 
    test.index = test.Timestamp 
    test = test.resample('D').mean()


    y_hat_avg = test.copy()
    # Build SARIMAX model
    fit = sm.tsa.statespace.SARIMAX(train.Count, order=(2, 1, 4),seasonal_order=(0,1,1,7)).fit()

    print(len(df))

    # Saving a Model
    import os
    dir_name = os.path.dirname(filepath)
    filename = os.path.basename(filepath)
    pkl_file = dir_name + "/" + os.path.splitext(filename)[0] + ".pkl"
    print(pkl_file)
    fit.save(pkl_file)

    print("Model saved ::")


def load_and_predict(filepath):
    ## Load a model
    fit = sm.load(filepath)

    # forecast till 31Dec 2022
    forecast = fit.predict(start = 860,
                           end=1224,
                           typ='levels')



    start_dt = date(year=2022, month=1, day=1)
    end_dt = date(year=2022, month=12, day=31)

    ## Create the date range
    date_list = []
    for dt in daterange(start_dt, end_dt):
        date_list.append(dt.strftime("%Y-%m-%d"))
	

    # Convert forecast to List
    forecast_list = forecast.to_list()

    ## Forecast Data frame. -- This can be added to DB
    finalData = pd.DataFrame(
        {'DATE': date_list,
        'Impression': forecast_list
    })
    print(finalData)

    return finalData

# This will return impression data for a perticular date
def predict_for_date(filepath, dateyear):
    fit = sm.load(filepath)
    return fit.predict(dateyear, dynamic=True)

