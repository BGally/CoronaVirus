package coronavirus

uses java.io.File
uses java.time.LocalDate
uses java.time.Month
uses java.time.format.DateTimeFormatter
uses java.time.temporal.ChronoUnit

class CaseDataIO {

  private static final var INVALID_FILENAME_CHARS = "+'\"/\\[]:;|=,?<>*"
  private static final var KEY_FIELD = "Key"

  private var _virusStartDate = LocalDate.of(2020, Month.JANUARY, 22)

  construct(){}

  public function runWithDefaults(){
    var worksheet = createWorksheetFromCSVFile("./resources/inputs/Time_series_covid-19_Confirmed.csv", "Covid19-Initial")
    // createCSVFileFromTextWorksheet(worksheet, "./modules/configuration/outputs/") // Uncomment to check csv for data issues
    var locations = createLocationCasesFromWorksheet(worksheet)

    for(loc in locations){
      // print(loc) // Uncomment to check locations for data issues
      var colabWorksheet = createColabWorksheetFromLocation(loc)
      createCSVFileFromTextWorksheet(colabWorksheet, "./modules/configuration/outputs/", null, false)
    }

    var allCountriesWorksheet = createColabWorksheetFromCombinedLocations(locations)
    createCSVFileFromTextWorksheet(allCountriesWorksheet, "./modules/configuration/outputs/", "AllCountries", false)

    var allChina = locations.where(\elt -> elt.Country == "China")
    var allChinaWorksheet = createColabWorksheetFromCombinedLocations(allChina)
    createCSVFileFromTextWorksheet(allChinaWorksheet, "./modules/configuration/outputs/", "AllChina", false)

    var allUS = locations.where(\elt -> elt.Country == "US")
    var allUSWorksheet = createColabWorksheetFromCombinedLocations(allUS)
    createCSVFileFromTextWorksheet(allUSWorksheet, "./modules/configuration/outputs/", "AllUS", false)

    var allCanada = locations.where(\elt -> elt.Country == "Canada")
    var allCanadaWorksheet = createColabWorksheetFromCombinedLocations(allCanada)
    createCSVFileFromTextWorksheet(allCanadaWorksheet, "./modules/configuration/outputs/", "AllCanada", false)

    var allAustralia = locations.where(\elt -> elt.Country == "Australia")
    var allAustraliaWorksheet = createColabWorksheetFromCombinedLocations(allAustralia)
    createCSVFileFromTextWorksheet(allAustraliaWorksheet, "./modules/configuration/outputs/", "AllAustralia", false)

    var allExcludingChina = locations.where(\elt -> elt.Country != "China")
    var allExcludingChinaWorksheet = createColabWorksheetFromCombinedLocations(allExcludingChina)
    createCSVFileFromTextWorksheet(allExcludingChinaWorksheet, "./modules/configuration/outputs/", "AllExcludingChina", false)

  }

  public function createLocationCasesFromWorksheet(worksheet : TextWorksheet) : ArrayList<Location>{
    var locations = new ArrayList<Location>()
    for(row in worksheet.ContentArray){
      var location = new Location(row.get(1), row.get(2), row.get(3), row.get(4))
      locations.add(location)
      for(val in row index colIndex){
        if(colIndex <5){
          continue
        }

        var dateFormatter = DateTimeFormatter.ofPattern("M/d/yy")
        var caseDate = LocalDate.parse(worksheet.ColumnNames.get(colIndex), dateFormatter)
        if(val == ""){val = "0"}
        var confirmedCases = Integer.valueOf(val)
        new CasesLocationDate(location, caseDate, confirmedCases, 0, 0)

      }
    }

    return locations
  }

  public function createColabWorksheetFromLocation(loc : Location, title : String = null) : TextWorksheet {

    if(title == null){
      title = loc.Key
    }

    var headers = new ArrayList<String>()
    headers.addAll({"day","cases","cases_new","growth","date"})

    var contentArray = new ArrayList<ArrayList<String>>()

    var prevCasesDate : CasesLocationDate
    for(casesDate in loc.CasesLocationDates.Values){
      if(casesDate.Confirmed > 0){
        var days = ChronoUnit.DAYS.between(_virusStartDate, casesDate.Date)
        var row = new ArrayList<String>()
        row.add(days as String)
        row.add(casesDate.Confirmed as String)
        var newCases : int
        var growth : float
        if(prevCasesDate?.Confirmed > 0){
          newCases = casesDate.Confirmed - prevCasesDate.Confirmed
          growth = (casesDate.Confirmed as float/prevCasesDate.Confirmed as float)
        } else{
          newCases = casesDate.Confirmed
          growth = 1
        }
        row.add(newCases as String)

        var growthString = growth as String
        if(growthString.length > 5){
          growthString = growthString.substring(0,5)
        }
        row.add(growthString)

        var dateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd")
        var strDate = dateFormat.format(casesDate.Date)
        row.add(strDate)

        contentArray.add(row)
      }
      prevCasesDate = casesDate
    }

    return new TextWorksheet(title, headers, contentArray)
  }

  public function createColabWorksheetFromCombinedLocations(locs : List<Location>, title : String = null) : TextWorksheet {

    if(title == null){
      title = "CombinedLocations"
    }

    var headers = new ArrayList<String>()
    headers.addAll({"day","cases","cases_new","growth","date"})

    var combinedCaseDates = new LinkedHashMap<LocalDate, CasesLocationDate>()

    var combinedLocation = new Location(title)
    for(loc in locs){
      for(caseDateEntry in loc.CasesLocationDates.entrySet()){
        var val = combinedCaseDates.get(caseDateEntry.Key)
        if(val != null){
          val.Confirmed += caseDateEntry.Value.Confirmed
        } else{
          var newCaseDateEntry = new CasesLocationDate(combinedLocation, caseDateEntry.Value.Date)
          newCaseDateEntry.Confirmed = caseDateEntry.Value.Confirmed
          combinedCaseDates.put(caseDateEntry.Key, newCaseDateEntry)
        }
      }
    }

    var contentArray = generateColabContentArray(combinedCaseDates.Values.toList())

    return new TextWorksheet(title, headers, contentArray)
  }

  private function generateColabContentArray(casesDates : List<CasesLocationDate>): ArrayList<ArrayList<String>>{

    var contentArray = new ArrayList<ArrayList<String>>()

    var prevCasesDate : CasesLocationDate
    for(casesDate in casesDates){
      if(casesDate.Confirmed > 0) {
        var days = ChronoUnit.DAYS.between(_virusStartDate, casesDate.Date)
        var row = new ArrayList<String>()
        row.add(days as String)
        row.add(casesDate.Confirmed as String)
        var newCases : int
        var growth : float
        if(prevCasesDate?.Confirmed > 0){
          newCases = casesDate.Confirmed - prevCasesDate.Confirmed
          growth = (casesDate.Confirmed as float/prevCasesDate.Confirmed as float)
        } else{
          newCases = casesDate.Confirmed
          growth = 1
        }
        row.add(newCases as String)

        var growthString = growth as String
        if(growthString.length > 5){
          growthString = growthString.substring(0,5)
        }
        row.add(growthString)

        var dateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd")
        var strDate = dateFormat.format(casesDate.Date)
        row.add(strDate)

        contentArray.add(row)
      }
      prevCasesDate = casesDate
    }
    return contentArray
  }

  public function createWorksheetFromCSVFile(csvFilePath : String, title : String = null) : TextWorksheet {

    var url = getClass().getResource(csvFilePath)
    var csvFile = new File(url.getPath())
    if(title == null){
      title = csvFile.Name
    }

    var allCSVContent = FileUtil.readCSVFile(csvFile).iterator()

    var headers = new ArrayList<String>()
    headers.add(KEY_FIELD)
    headers.addAll(allCSVContent.next())

    var contentArray = new ArrayList<ArrayList<String>>()

    while(allCSVContent.hasNext()){
      var vals = allCSVContent.next()
      vals = applyDataFixes(vals)
      // Use Country + Province as key
      var key = vals.get(1) + vals.get(0)
      key = key.remove(" ")
      key = key.remove(",")
      var keyedRow = new ArrayList<String>()
      keyedRow.add(key)
      keyedRow.addAll(vals)
      contentArray.add(keyedRow)
    }
    var sortedContentArray = new ArrayList<ArrayList<String>>()
    sortedContentArray.addAll(contentArray.sortBy(\t -> t.get(0)))

    return new TextWorksheet(title, headers, sortedContentArray)
  }

  private function applyDataFixes(values: ArrayList<String>): ArrayList<String>{
    var stringToReplace = "\"Korea, South"
    var replacementString = "South Korea"
    var newVals = new ArrayList<String>()
    if (values.contains(stringToReplace)){
      for(val in values){
        if(val == stringToReplace){
          val = replacementString
        }
        newVals.add(val)
      }
      values = newVals
    }
    return values
  }

  public function createCSVFileFromTextWorksheet(worksheet: TextWorksheet, folderPath: String, fileName : String = null, quoteEscaped : boolean = true){

    if(fileName == null){
      fileName = worksheet.Title.trim().remove(".")
    }
    for(ch in INVALID_FILENAME_CHARS.toCharArray()){
      fileName = fileName.remove(ch)
    }
    var fileNameCSV = folderPath + fileName + ".csv"
    FileUtil.writeCSVFile(worksheet.ColumnNames, worksheet.ContentArray, fileNameCSV, quoteEscaped)

  }

  private function generateCSVTableContent(columnNames: ArrayList<String> , contentArray: ArrayList<ArrayList<String>>): String {
    var content = new StringBuilder()
    // Create comma delimited Headers
    var colNames = columnNames.join(",")
    content.append(colNames + "\r\n")

    // Create 'escaped' comma delimited table content
    for (row in contentArray) {
      var rowData = row.map(\elt -> "\"" + (elt.remove("\"")?: "") + "\"").join(",")
      content.append("${rowData}\r\n")
    }
    return content.toString()
  }

}