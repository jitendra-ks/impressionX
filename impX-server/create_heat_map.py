import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

def generate_heat_map(filepath):
    df = pd.read_csv(filepath)

    # Drop ID column
    if 'ID' in df.columns:
        df = df.drop("ID", axis=1)


    # Converting Datetime to datetime format
    df['date'] = pd.to_datetime(df['Datetime'])

    ## Break the timeseries data to multiple units
    df['Date1'] = pd.to_datetime(df.date.dt.date)
    df['year'] = df.date.dt.year
    df['month'] = df.date.dt.month
    df['day'] = df.date.dt.day
    df['hour'] = df.date.dt.hour
    df['weekday'] = df.date.dt.weekday

    # Using pivot table to create a dataframe having index as hours and columns as weekdays and each cell will contain the average
    #Impression data for that particular hour of the weekday

    return df.pivot_table(values='Count', index='hour', columns = 'weekday', aggfunc = 'mean')

    #plotting a heatmap with a colorbar; the colorbar shows the energy consumption in MWH
    # _ = plt.figure(figsize=(12, 8))
    #ax = sns.heatmap(hour_weekday.sort_index(ascending = False), cmap='viridis')
    #_ = plt.title('Average energy consumption in MWH for each hour of each weekday over the entire period')
    #_ = ax.set_title("Average impression each hour of each weekday averaged over years", fontsize = 14)
