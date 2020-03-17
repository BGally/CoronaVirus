# Coronavirus Prediction Model

 
Inspired by [this video](https://www.youtube.com/watch?v=Kas0tIxDvrg) by 3Blue1Brown on exponential growth and epidemics.

I tried to find a way to model the logistic growth function from the worldwide data made available by [Johns Hopkins University](https://github.com/CSSEGISandData/COVID-19).

The model expands on source code written by Gianluca Malato in this [Medium Post](https://towardsdatascience.com/covid-19-infection-in-italy-mathematical-models-and-predictions-7784b4d7dd8d) which focuses on the Italian pandemic.

I used the following Gosu code to normalise and augment the global data so it could be easily used in a modified version of Gianlucas [colab notebook](https://colab.research.google.com/drive/1TQJrZELeDTqdn8KddWpaNRUYg8822MI5).

### Usage

Run with the default values

```
var caseDataIO = new CaseDataIO()
caseDataIO.runWithDefaults()
```
Or specify the input file
```
var worksheet = caseDataIO.createWorksheetFromCSVFile("./inputFolderPath/Time_series_covid-19_Confirmed.csv", "Covid19-Initial")
var locations = caseDataIO.createLocationCasesFromWorksheet(worksheet)
```
And then create a csv for each location
```
for(loc in locations){
  var colabWorksheet = caseDataIO.createColabWorksheetFromLocation(loc)
  caseDataIO.createCSVFileFromTextWorksheet(colabWorksheet, "./outputFolderPath/", null, false)
}
```
Or create a csv for combined locations e.g combine all locations except those in China
```
var allExcludingChina = locations.where(\elt -> elt.Country != "China")
var allExcludingChinaWorksheet = caseDataIO.createColabWorksheetFromCombinedLocations(allExcludingChina)
caseDataIO.createCSVFileFromTextWorksheet(allExcludingChinaWorksheet, "./outputFolderPath/", "AllExcludingChina", false)
```